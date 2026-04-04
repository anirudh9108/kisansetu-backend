import { Platform } from 'react-native';
export const Theme = {
  colors: {
    primary: '#10B981', // Verdant Emerald
    primaryDark: '#047857',
    primaryLight: '#D1FAE5',
    secondary: '#F59E0B', // Harvest Amber
    secondaryLight: '#FEF3C7',
    accent: '#F59E0B',
    accentDark: '#B45309',
    accentLight: '#FEF3C7',
    error: '#EF4444',
    danger: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    // Verdant Ether Base Colors:
    background: '#FDFCF0', // Cream-Tinted Off-White
    surface: '#FFFFFF',
    surfaceContainerLow: '#F8F7EE', // Soft off-white for wide sections
    surfaceContainerHigh: '#F0EFE3', // Fills for inputs/cards
    textPrimary: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    white: '#FFFFFF',
    gradientPrimary: ['#006c49', '#10b981'], // Premium Stitch Green glow
    gradientAccent: ['#f59e0b', '#d97706'], // Pulse Amber
    gradientBlue: ['#3B82F6', '#2563EB'],
    
    // Tonal UI Fallbacks
    layer1: '#F1F5EB',
    layer2: '#E0E4DA',
    layer3: '#FFFFFF',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48
  },
  borderRadius: {
    sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, full: 9999
  },
  shadows: {
    // Ambient Depth (No harsh edges)
    ambient: {
      shadowColor: '#1b1c15',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
      elevation: 4,
    },
    float: {
      shadowColor: '#1b1c15',
      shadowOffset: { width: 0, height: 24 },
      shadowOpacity: 0.08,
      shadowRadius: 48,
      elevation: 12,
    },
    card: {
      shadowColor: '#1b1c15',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 16,
      elevation: 6,
    }
  },
  typography: {
    fontFamilyDisplay: Platform?.OS === 'ios' ? 'Helvetica' : 'sans-serif',
    h1: { fontSize: 36, fontWeight: '800', letterSpacing: -1 }, // display-lg
    h2: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }, // headline-lg
    h3: { fontSize: 18, fontWeight: '700' },
    body: { fontSize: 16, fontWeight: '600' } // Stronger body density for premium feel
  }
};
