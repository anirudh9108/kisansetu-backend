// LiquidImage - Ported from Framer for Expo Web
// WebGL liquid ripple displacement shader on an image background
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';

const defaultImageSrc = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80";

export default function LiquidBackground({ image, strength = 0.03, speed = 0.14, borderRadius = 0 }) {
  if (Platform.OS !== 'web') return null;
  const imageSrc = image || defaultImageSrc;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden', borderRadius, pointerEvents: 'none' }}>
      <LiquidCanvas imageSrc={imageSrc} strength={strength} speed={speed} borderRadius={borderRadius} />
    </div>
  );
}

function LiquidCanvas({ imageSrc, strength, speed, borderRadius }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const dprRef = useRef(1);
  const mouseRef = useRef({ x: -10, y: -10, active: false });
  const maskRadiusRef = useRef(0);
  const wakeRef = useRef([]);
  const hoveredRef = useRef(false);

  // Resize observer
  useEffect(() => {
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      setSize({ width: w, height: h });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Listen on document for mouse (since canvas has pointerEvents: none)
  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mouseRef.current = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)), active: true };
      hoveredRef.current = true;
      const now = Date.now();
      wakeRef.current = [...wakeRef.current.filter(w => now - w.t < 1200), { x, y, t: now }].slice(-8);
    };
    const onLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
      hoveredRef.current = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Mask radius animation
  useEffect(() => {
    let animId;
    let lastHovered = false;
    let start = null;
    let from = 0;
    let to = 0;
    const duration = 650;
    function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function animate(ts) {
      const hovered = hoveredRef.current;
      if (hovered !== lastHovered) { lastHovered = hovered; start = ts; from = maskRadiusRef.current; to = hovered ? 1.5 : 0; }
      if (start === null) start = ts;
      const elapsed = Math.min((ts - start) / duration, 1);
      const eased = easeInOutCubic(elapsed);
      maskRadiusRef.current = from + (to - from) * eased;
      animId = requestAnimationFrame(animate);
    }
    animId = requestAnimationFrame(animate);
    return () => animId && cancelAnimationFrame(animId);
  }, []);

  // WebGL render loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const dpr = dprRef.current || 1;
    canvasRef.current.width = size.width;
    canvasRef.current.height = size.height;
    canvasRef.current.style.width = size.width / dpr + "px";
    canvasRef.current.style.height = size.height / dpr + "px";
    let gl = canvasRef.current.getContext("webgl");
    if (!gl) return;
    let animationId;
    let img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    let tex, program, uTime, uMouse, uStrength, uSpeed, uResolution, uWake, uWakeCount, uMaskRadius;
    let startTime = Date.now();
    let loaded = false;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0, 1);
      }
    `;
    const fs = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_image;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_strength;
      uniform float u_speed;
      uniform vec2 u_resolution;
      #define MAX_WAKE 16
      uniform int u_wakeCount;
      uniform vec3 u_wake[MAX_WAKE];
      uniform float u_maskRadius;
      void main() {
        vec2 uv = v_uv;
        for (int i = 0; i < MAX_WAKE; ++i) {
          if (i >= u_wakeCount) break;
          vec2 w = u_wake[i].xy;
          float t = u_time - u_wake[i].z;
          float dist = distance(uv, w);
          float amp = exp(-dist * 16.0) * exp(-t * 1.2);
          float ripple = sin(32.0 * dist - t * 8.0 * u_speed) * 0.04;
          uv += normalize(uv - w) * ripple * u_strength * amp * 2.0;
        }
        if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0) {
          float dist = distance(uv, u_mouse);
          float ripple = sin(32.0 * dist - u_time * 8.0 * u_speed) * 0.04;
          float effect = exp(-dist * 12.0);
          uv += normalize(uv - u_mouse) * ripple * u_strength * effect * 2.0;
        }
        uv = clamp(uv, 0.0, 1.0);
        vec4 color = texture2D(u_image, uv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        vec3 grayColor = vec3(gray);
        float mask = 0.0;
        float maskRadius = u_maskRadius;
        if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0 && maskRadius > 0.0) {
          float d = distance(uv, u_mouse);
          mask = max(mask, smoothstep(maskRadius, maskRadius * 0.8, d));
        }
        for (int i = 0; i < MAX_WAKE; ++i) {
          if (i >= u_wakeCount) break;
          vec2 w = u_wake[i].xy;
          float d = distance(uv, w);
          mask = max(mask, smoothstep(maskRadius, maskRadius * 0.8, d));
        }
        vec3 finalColor = mix(grayColor, color.rgb, mask);
        gl_FragColor = vec4(finalColor, color.a);
      }
    `;
    function createShader(type, src) { let s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    function createProg(vsSrc, fsSrc) { let p = gl.createProgram(); gl.attachShader(p, vsSrc); gl.attachShader(p, fsSrc); gl.linkProgram(p); return p; }

    function setup() {
      let vshader = createShader(gl.VERTEX_SHADER, vs);
      let fshader = createShader(gl.FRAGMENT_SHADER, fs);
      program = createProg(vshader, fshader);
      gl.useProgram(program);
      let pos = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pos);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      let loc = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uTime = gl.getUniformLocation(program, "u_time");
      uMouse = gl.getUniformLocation(program, "u_mouse");
      uStrength = gl.getUniformLocation(program, "u_strength");
      uSpeed = gl.getUniformLocation(program, "u_speed");
      uResolution = gl.getUniformLocation(program, "u_resolution");
      uWake = gl.getUniformLocation(program, "u_wake");
      uWakeCount = gl.getUniformLocation(program, "u_wakeCount");
      uMaskRadius = gl.getUniformLocation(program, "u_maskRadius");
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);
      loaded = true;
    }

    img.onload = () => { setup(); render(); };

    function updateTexture() {
      if (!tex) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      let offW = size.width, offH = size.height;
      let offCanvas = document.createElement("canvas");
      offCanvas.width = offW; offCanvas.height = offH;
      let ctx = offCanvas.getContext("2d");
      let iw = img.width, ih = img.height;
      let scale = Math.max(offW / iw, offH / ih);
      let sw = iw * scale, sh = ih * scale;
      let sx = (offW - sw) / 2, sy = (offH - sh) / 2;
      ctx.clearRect(0, 0, offW, offH);
      ctx.drawImage(img, sx, sy, sw, sh);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, offCanvas);
    }

    function render() {
      if (!loaded || !gl) return;
      updateTexture();
      gl.viewport(0, 0, size.width, size.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const now = (Date.now() - startTime) / 1e3;
      gl.uniform1f(uTime, now);
      let mx = mouseRef.current.active ? Math.max(0, Math.min(1, mouseRef.current.x)) : -10;
      let my = mouseRef.current.active ? Math.max(0, Math.min(1, mouseRef.current.y)) : -10;
      my = 1 - my;
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uStrength, strength * 2.5);
      gl.uniform1f(uSpeed, speed);
      gl.uniform2f(uResolution, size.width, size.height);
      let wakeArr = wakeRef.current.slice(-16);
      let wakeData = new Float32Array(16 * 3);
      let count = 0;
      for (let i = 0; i < wakeArr.length; ++i) {
        let w = wakeArr[i];
        wakeData[i * 3 + 0] = w.x;
        wakeData[i * 3 + 1] = 1 - w.y;
        wakeData[i * 3 + 2] = (w.t - startTime) / 1e3;
        count++;
      }
      gl.uniform1i(uWakeCount, count);
      gl.uniform3fv(uWake, wakeData);
      gl.uniform1f(uMaskRadius, maskRadiusRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    return () => { if (animationId) cancelAnimationFrame(animationId); gl = null; };
  }, [imageSrc, size.width, size.height, strength, speed]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
