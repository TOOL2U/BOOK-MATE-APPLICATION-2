export const COLORS = {
  // Brand Primary Colors - Sia Moon / BookMate Dark Professional Theme
  YELLOW: '#FFF02B',           // Primary accent color - buttons, highlights, icons, selection states
  BLACK: '#000000',            // Navbar, cards, subtle UI dividers
  GREY_PRIMARY: '#121212',     // Main background color
  GREY_SECONDARY: '#4D4D4D',   // Content blocks and secondary text backgrounds
  
  // Legacy support (keeping existing functionality)
  BG: '#121212',               // Updated to match brand grey
  SURFACE_1: '#1A1A1A',        // Slightly lighter than primary grey for cards
  SURFACE_2: '#2A2A2A',        // Even lighter grey for elevated elements
  
  // Text Colors
  TEXT_PRIMARY: '#FFFFFF',     // High-contrast white text on dark backgrounds
  TEXT_SECONDARY: '#B3B3B3',   // Secondary text with good contrast
  TEXT_MUTED: '#4D4D4D',       // Muted text matching secondary grey
  
  // Status Colors (maintaining existing functionality)
  SUCCESS: '#00FF88',
  ERROR: '#FF3366',
  WARNING: '#FFA500',
  INFO: '#FFF02B',             // Updated to use brand yellow
  
  // UI Elements
  BORDER: '#4D4D4D',           // Updated to match secondary grey
  BORDER_SUBTLE: '#2A2A2A',    // Subtle borders
  ACTIVE: '#FFF02B',           // Updated to use brand yellow
  INACTIVE: '#4D4D4D',         // Updated to match secondary grey
};

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  XXL: 24,
};

export const RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 24,
};

export const SHADOWS = {
  SMALL: {
    shadowColor: '#FFF02B',      // Subtle yellow glow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#FFF02B',      // Yellow glow for important elements
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#FFF02B',      // Strong yellow glow for prominent elements
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  YELLOW_GLOW: {
    shadowColor: '#FFF02B',      // Updated to use brand yellow
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  // Traditional black shadows for subtle elements
  BLACK_SMALL: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};
