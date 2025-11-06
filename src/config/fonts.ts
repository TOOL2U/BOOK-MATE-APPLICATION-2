// Brand Font Configuration
export const BRAND_FONTS = {
  MADE_MIRAGE: 'MadeMirage-Regular',
  BEBAS_NEUE: 'BebasNeue-Regular',
  AILERON_REGULAR: 'Aileron-Regular',
  AILERON_BOLD: 'Aileron-Bold',
  AILERON_LIGHT: 'Aileron-Light',
};

export const FONT_STYLES = {
  brandDisplay: {
    fontFamily: BRAND_FONTS.MADE_MIRAGE,
    fontSize: 48,
    fontWeight: '400' as const,
    color: '#FFF02B',
  },
  body: {
    fontFamily: BRAND_FONTS.AILERON_REGULAR,
    fontSize: 16,
    fontWeight: '400' as const,
    color: '#FFFFFF',
  },
};
