export const COLORS = {
  // ===== PREMIUM DARK THEME PALETTE =====
  // Background
  BACKGROUND: '#121212',           // Main app background
  
  // Cards & Surfaces (layered by importance)
  CARD_PRIMARY: '#1A1A1A',        // Basic form cards, main content areas
  CARD_SECONDARY: '#1C1C1C',      // Input fields, dropdowns, secondary surfaces
  CARD_ELEVATED: '#1E1E1E',       // Buttons, selectable cards, raised elements
  CARD_HIGHLIGHT: '#242424',      // Analytics cards, totals, emphasized content
  
  // Borders & Separators
  BORDER: 'rgba(255, 255, 255, 0.06)',  // Subtle borders and separators
  BORDER_FOCUS: 'rgba(255, 240, 43, 0.3)', // Focused input borders
  
  // Text Colors
  TEXT_PRIMARY: '#FFFFFF',        // Headings, primary text
  TEXT_SECONDARY: '#B3B3B3',      // Labels, secondary text
  TEXT_MUTED: '#777777',          // Hints, placeholders, disabled text
  
  // Brand Colors
  BRAND_YELLOW: '#FFF02B',        // Primary brand accent - buttons, highlights, active states
  BRAND_BLACK: '#000000',         // Text on yellow buttons
  
  // Modern Value Colors (Updated: November 15, 2025)
  REVENUE_GREEN: '#00E676',       // Soft modern green for revenue/income
  EXPENSE_RED: '#FF4F70',         // Soft modern red for expenses/overheads
  PROFIT_POSITIVE: '#FFF02B',     // Brand yellow for positive profit
  PROFIT_NEGATIVE: '#FF4F70',     // Soft red for negative profit
  MARGIN_COLOR: '#FFF02B',        // Brand yellow for margins
  
  // Status Colors (Legacy - consider using modern value colors above)
  SUCCESS: '#00E676',             // Updated to match REVENUE_GREEN
  ERROR: '#FF4F70',               // Updated to match EXPENSE_RED
  WARNING: '#FFA500',
  INFO: '#FFF02B',
  
  // Legacy Aliases (for backward compatibility - will be phased out)
  YELLOW: '#FFF02B',
  BLACK: '#000000',
  GREY_PRIMARY: '#121212',
  GREY_SECONDARY: '#4D4D4D',      // DEPRECATED - use CARD_* variants
  BG: '#121212',
  SURFACE_1: '#1A1A1A',           // DEPRECATED - use CARD_PRIMARY
  SURFACE_2: '#2A2A2A',           // DEPRECATED - use CARD_ELEVATED
  TEXT_MUTED_OLD: '#4D4D4D',      // DEPRECATED - use TEXT_MUTED
  BORDER_SUBTLE: '#2A2A2A',       // DEPRECATED - use BORDER
  ACTIVE: '#FFF02B',
  INACTIVE: '#4D4D4D',
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
  SM: 8,    // Small elements - inputs, badges
  MD: 12,   // Medium elements - buttons, cards
  LG: 16,   // Large elements - modals, sections
  XL: 20,   // Extra large - hero cards
  FULL: 999, // Circular elements
};

export const SHADOWS = {
  NONE: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  SMALL: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 5,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  YELLOW_GLOW: {
    shadowColor: '#FFF02B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};
