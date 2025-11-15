/**
 * BookMate Design System - Border Radius
 * 
 * Consistent rounded corner values for modern, professional UI
 * Updated: November 15, 2025
 */

export const BORDER_RADIUS = {
  none: 0,      // For specific cases (full-screen elements)
  xs: 4,        // Tiny badges, separators, chips
  sm: 8,        // Input fields, small buttons, form elements
  md: 12,       // Primary buttons, standard cards, list items
  lg: 16,       // Large cards, containers, hero sections
  xl: 20,       // Modals, bottom sheets (top corners only)
  pill: 999,    // Circular elements (avatars, icon buttons)
};

/**
 * Component-specific border radius mapping
 * Use these constants for consistency across the app
 */
export const COMPONENT_RADIUS = {
  // Inputs & Forms
  input: BORDER_RADIUS.sm,        // 8px - Text inputs, date pickers
  dropdown: BORDER_RADIUS.sm,     // 8px - Dropdown selectors
  searchBar: BORDER_RADIUS.md,    // 12px - Search inputs
  
  // Buttons
  button: BORDER_RADIUS.md,       // 12px - Primary action buttons
  buttonSmall: BORDER_RADIUS.sm,  // 8px - Secondary, cancel buttons
  iconButton: BORDER_RADIUS.pill, // Circular - Icon-only buttons
  
  // Cards & Containers
  card: BORDER_RADIUS.md,         // 12px - Transaction cards, list items
  cardLarge: BORDER_RADIUS.lg,    // 16px - Balance summary, section cards
  container: BORDER_RADIUS.md,    // 12px - Generic containers
  
  // Modals & Sheets
  modal: BORDER_RADIUS.xl,        // 20px - Modal backgrounds (top corners)
  bottomSheet: BORDER_RADIUS.lg,  // 16px - Bottom sheets (top corners)
  
  // Avatar & Profile
  avatar: BORDER_RADIUS.pill,     // Circular - Profile pictures
  avatarSquare: BORDER_RADIUS.md, // 12px - Square avatars with slight rounding
  
  // Badges & Tags
  badge: BORDER_RADIUS.xs,        // 4px - Status indicators
  badgePill: BORDER_RADIUS.pill,  // Pill - Rounded badge style
  chip: BORDER_RADIUS.sm,         // 8px - Filter chips, tags
  
  // Special Elements
  logoContainer: BORDER_RADIUS.lg, // 16px - Logo backgrounds
  imagePreview: BORDER_RADIUS.md,  // 12px - Image thumbnails
};

// Export default for convenience
export default BORDER_RADIUS;
