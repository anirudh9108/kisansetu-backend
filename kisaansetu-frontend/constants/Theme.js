// Design system inspired by Faseelh (nature, sustainability, premium)
export const Theme = {
  colors: {
    primary: '#1B3022',      // Deep Forest Green
    secondary: '#395D41',    // Moss Green
    accent: '#8DC03F',       // Leaf Green (for CTAs)
    background: '#F9F7F2',   // Warm Cream / Off-white
    surface: '#FFFFFF',      // Pure White for Cards
    text: '#1A1A2E',         // Dark Navy for readability
    textMuted: '#666666',    // Gray for labels
    border: '#E0DED1',       // Soft bone-color border
    error: '#C64B3B',        // Earthy Red
    success: '#1D9E75',      // Vibrant Green
    cardShadow: {
      shadowColor: '#1B3022',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 3,
    }
  },
  typography: {
    fontFamily: 'System', // Inter/System
    h1: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: '400', color: '#666666' }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 24,
    full: 999
  }
};

export default Theme;
