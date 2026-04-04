from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vector_store import get_collections
from services.authenticity import get_trust_badge
import anthropic
import os
from datetime import datetime
import uuid

# Attempt to import firebase_admin, omit in local if not installed
try:
    from firebase_admin import firestore
except ImportError:
    firestore = None

router = APIRouter()
claude = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class KisanAIRequest(BaseModel):
    uid: str
    question: str
    language: str = "pa"

@router.post("/ask")
async def ask_kisan_ai(body: KisanAIRequest):
    collections = get_collections()
    context_parts = []
    total_count = 0
    sources_used = []

    try:
        if collections["schemes"]:
            res = collections["schemes"].query(query_texts=[body.question], n_results=3)
            docs = res.get("documents", [[]])[0]
            if docs:
                context_parts.append(f"SCHEMES:\n" + "\n".join(docs))
                sources_used.append("schemes")
                total_count += len(docs)
    except Exception as e:
        print(f"Vector search failed for schemes: {e}")

    try:
        if collections["diseases"]:
            res = collections["diseases"].query(query_texts=[body.question], n_results=3)
            docs = res.get("documents", [[]])[0]
            if docs:
                context_parts.append(f"DISEASES:\n" + "\n".join(docs))
                sources_used.append("diseases")
                total_count += len(docs)
    except Exception as e:
        print(f"Vector search failed for diseases: {e}")
        
    try:
        if collections["crops"]:
            res = collections["crops"].query(query_texts=[body.question], n_results=3)
            docs = res.get("documents", [[]])[0]
            if docs:
                context_parts.append(f"CROPS:\n" + "\n".join(docs))
                sources_used.append("crops")
                total_count += len(docs)
    except Exception as e:
        print(f"Vector search failed for crops: {e}")

    try:
        if collections["mandi"]:
            res = collections["mandi"].query(query_texts=[body.question], n_results=3)
            docs = res.get("documents", [[]])[0]
            if docs:
                context_parts.append(f"MANDI TIPS:\n" + "\n".join(docs))
                sources_used.append("mandi")
                total_count += len(docs)
    except Exception as e:
        print(f"Vector search failed for mandi tips: {e}")

    context = "\n\n".join(context_parts)
    full_language_name = "Punjabi" if body.language == "pa" else "Hindi"

    system = f"""You are KisaanSetu AI, a farming assistant for Punjab farmers. You speak only in {full_language_name}.
    
    Rules:
    - Answer ONLY in {full_language_name} using simple words a farmer understands.
    - Base answers ONLY on the provided context.
    - If context is insufficient say:
      Punjabi: "ਮੈਨੂੰ ਇਸ ਬਾਰੇ ਪੱਕੀ ਜਾਣਕਾਰੀ ਨਹੀਂ"
      Hindi: "मुझे इस बारे में पक्की जानकारी नहीं"
    - Always mention if answer comes from government source.
    - Keep answer under 150 words.
    - End with one actionable next step for the farmer."""

    try:
        response = claude.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=800,
            system=system,
            messages=[{
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {body.question}"
            }]
        )
        answer = response.content[0].text
    except Exception as e:
        print(f"LLM API failed: {e}")
        answer = "ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਹੁਣੇ ਕੁਝ ਤਕਨੀਕੀ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।" if body.language == "pa" else "क्षमा करें, तकनीकी समस्या है।"

    # Save to Firestore
    ts = datetime.utcnow()
    if firestore:
        try:
            db = firestore.client()
            user_msg_ref = db.collection('kisanAIHistory').document(body.uid).collection('messages').document(str(uuid.uuid4()))
            user_msg_ref.set({
                "role": "user", "content": body.question, "language": body.language,
                "sources_used": [], "timestamp": ts
            })
            ast_msg_ref = db.collection('kisanAIHistory').document(body.uid).collection('messages').document(str(uuid.uuid4()))
            ast_msg_ref.set({
                "role": "assistant", "content": answer, "language": body.language,
                "sources_used": sources_used, "timestamp": ts
            })
        except Exception as e:
            print(f"Failed to write to firestore: {e}")

    return {
        "answer": answer,
        "language": body.language,
        "sources_searched": sources_used,
        "results_found": total_count,
        "trust": get_trust_badge("schemes" if "schemes" in sources_used else "crops", live=True),
        "disclaimer_pa": "ਇਹ ਜਾਣਕਾਰੀ ਸਰਕਾਰੀ ਸਰੋਤਾਂ 'ਤੇ ਆਧਾਰਿਤ ਹੈ" if body.language == "pa" else "यह जानकारी सरकारी स्रोतों पर आधारित है"
    }

@router.get("/history/{uid}")
async def get_conversation_history(uid: str):
    if not firestore:
        return {"messages": []}
    
    try:
        db = firestore.client()
        messages_ref = db.collection('kisanAIHistory').document(uid).collection('messages')
        # Order by timestamp descending, limit to 20
        query = messages_ref.order_by("timestamp", direction=firestore.Query.DESCENDING).limit(20)
        results = query.stream()
        
        messages = []
        for doc in results:
            data = doc.to_dict()
            # Convert timestamp to ISO format for JSON serialization
            if "timestamp" in data and hasattr(data["timestamp"], "isoformat"):
                 data["timestamp"] = data["timestamp"].isoformat()
            messages.append(data)
            
        return {"messages": messages}
    except Exception as e:
        print(f"Firestore history query failed: {e}")
        return {"messages": []}
