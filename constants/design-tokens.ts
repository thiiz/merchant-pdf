/**
 * Design Tokens - Sistema Unificado de Design
 * 
 * Este arquivo centraliza todos os valores de design para garantir consistência
 * entre o preview HTML/CSS (px) e o PDF gerado (@react-pdf/renderer em pt).
 * 
 * Conversão: 1px ≈ 0.75pt (em 96 DPI)
 */

export const DESIGN_TOKENS = {
  // ===== SPACING =====
  spacing: {
    xs: { px: 4, pt: 3, tailwind: '1' },       // gap-1, p-1
    sm: { px: 8, pt: 6, tailwind: '2' },       // gap-2, p-2
    md: { px: 12, pt: 9, tailwind: '3' },      // gap-3, p-3
    lg: { px: 16, pt: 12, tailwind: '4' },     // gap-4, p-4
    xl: { px: 24, pt: 18, tailwind: '6' },     // gap-6, p-6
    '2xl': { px: 32, pt: 24, tailwind: '8' },  // gap-8, p-8
    '3xl': { px: 40, pt: 30, tailwind: '10' }, // gap-10, p-10
  },

  // ===== BORDERS =====
  borders: {
    thin: { px: 1, pt: 1, tailwind: '' },           // border
    medium: { px: 2, pt: 1.5, tailwind: '-2' },     // border-2
    thick: { px: 4, pt: 3, tailwind: '-4' },        // border-4
    thicker: { px: 8, pt: 6, tailwind: '-8' },      // border-8
  },

  // ===== TYPOGRAPHY =====
  fontSize: {
    xs: { px: 10, pt: 8, tailwind: 'text-[10px]' },     // Extra small
    sm: { px: 12, pt: 10, tailwind: 'text-xs' },        // Small (12px)
    base: { px: 14, pt: 12, tailwind: 'text-sm' },      // Base (14px)
    md: { px: 16, pt: 13, tailwind: 'text-base' },      // Medium (16px)
    lg: { px: 18, pt: 14, tailwind: 'text-lg' },        // Large (18px)
    xl: { px: 20, pt: 18, tailwind: 'text-xl' },        // XL (20px)
    '2xl': { px: 24, pt: 20, tailwind: 'text-2xl' },    // 2XL (24px)
  },

  fontWeight: {
    normal: { css: '400', pdf: 'normal', tailwind: 'font-normal' },
    medium: { css: '500', pdf: 'medium', tailwind: 'font-medium' },
    semibold: { css: '600', pdf: 'semibold', tailwind: 'font-semibold' },
    bold: { css: '700', pdf: 'bold', tailwind: 'font-bold' },
    black: { css: '900', pdf: 'heavy', tailwind: 'font-black' },
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    none: { px: 0, pt: 0, tailwind: 'rounded-none' },
    sm: { px: 2, pt: 1.5, tailwind: 'rounded-sm' },
    md: { px: 4, pt: 3, tailwind: 'rounded' },
    lg: { px: 8, pt: 6, tailwind: 'rounded-lg' },
    xl: { px: 12, pt: 9, tailwind: 'rounded-xl' },
    full: { px: 9999, pt: 9999, tailwind: 'rounded-full' },
  },

  // ===== COLORS (Common grays used throughout) =====
  colors: {
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    white: '#ffffff',
    black: '#000000',
  },

  // ===== COMPONENT SPECIFIC =====
  components: {
    page: {
      // A4 dimensions in mm: 210 x 297
      width: { mm: 210, px: 794, pt: 595 },
      height: { mm: 297, px: 1123, pt: 842 },
      padding: { px: 32, pt: 24 },
    },

    header: {
      decoration: { height: { px: 16, pt: 16 } },
      borderBottom: { px: 2, pt: 1.5 },
      paddingBottom: { px: 16, pt: 12 },
      marginBottom: { px: 20, pt: 15 },
      logo: { height: { px: 48, pt: 50 } },
      companyName: {
        fontSize: { px: 24, pt: 20 },
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: { px: 12, pt: 10 },  // text-xs = 12px
        color: '#6b7280',
      },
      specialOffer: {
        fontSize: { px: 14, pt: 12 },  // text-sm = 14px
      },
      contentGap: { px: 24, pt: 18 },  // gap-6 = 24px
      logoCompanyGap: { px: 16, pt: 12 }, // gap-4 = 16px
    },

    section: {
      title: {
        fontSize: { px: 20, pt: 18 },
        fontWeight: 'black',
        borderLeft: { px: 8, pt: 6 },
        paddingLeft: { px: 12, pt: 10 },
        marginBottom: { px: 16, pt: 12 },
      },
      marginBottom: { px: 24, pt: 18 },
    },

    productCard: {
      border: { px: 1, pt: 1 },
      borderBottom: { px: 4, pt: 3 },
      borderRadius: { px: 8, pt: 6 },
      padding: { px: 12, pt: 9 },
      image: {
        height: { px: 150, pt: 150 },
      },
      name: {
        fontSize: { px: 14, pt: 12 },
        fontWeight: 'bold',
        marginBottom: { px: 4, pt: 3 },
        lineHeight: { px: 28, pt: 28 }, // Fixed height for 2 lines
      },
      spec: {
        fontSize: { px: 10, pt: 8 },
        dot: {
          size: { px: 4, pt: 3 },
          marginRight: { px: 6, pt: 4 },
        },
        marginBottom: { px: 2, pt: 1.5 },
      },
      price: {
        label: { fontSize: { px: 10, pt: 8 } },
        value: { fontSize: { px: 18, pt: 14 } },
        borderTop: { px: 1, pt: 1 },
        paddingTop: { px: 8, pt: 4 },
        marginTop: { px: 8, pt: 4 },
      },
      soldOutBadge: {
        fontSize: { px: 10, pt: 8 },
        paddingY: { px: 4, pt: 3 },
        paddingX: { px: 8, pt: 6 },
        top: { px: 8, pt: 6 },
        right: { px: 8, pt: 6 },
      },
    },

    footer: {
      padding: { px: 12, pt: 10 },
      paddingX: { px: 32, pt: 30 },
      borderTop: { px: 4, pt: 3 },
      fontSize: { px: 10, pt: 8 },
    },

    grid: {
      gap: { px: 16, pt: 12 },
    },
  },
} as const;

// ===== HELPER FUNCTIONS =====

/**
 * Get Tailwind class for spacing
 */
export const getTailwindSpacing = (size: keyof typeof DESIGN_TOKENS.spacing) => {
  return DESIGN_TOKENS.spacing[size].tailwind;
};

/**
 * Get PDF points value for spacing
 */
export const getPdfSpacing = (size: keyof typeof DESIGN_TOKENS.spacing) => {
  return DESIGN_TOKENS.spacing[size].pt;
};

/**
 * Get pixel value for spacing
 */
export const getPxSpacing = (size: keyof typeof DESIGN_TOKENS.spacing) => {
  return DESIGN_TOKENS.spacing[size].px;
};
