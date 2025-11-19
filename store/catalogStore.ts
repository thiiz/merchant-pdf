import { CatalogState, GlobalSettings, Product, Section } from '@/types/catalog';
import { create } from 'zustand';

interface CatalogStore extends CatalogState {
  // Actions
  setGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  addPage: (pageId?: string) => void;
  removePage: (pageId: string) => void;
  addSection: (pageId: string, section: Section) => void;
  updateSection: (pageId: string, sectionId: string, updates: Partial<Section>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  addProduct: (pageId: string, sectionId: string, product: Product) => void;
  updateProduct: (pageId: string, sectionId: string, productId: string, updates: Partial<Product>) => void;
  removeProduct: (pageId: string, sectionId: string, productId: string) => void;
  reorderSection: (pageId: string, sectionId: string, direction: 'up' | 'down') => void;
}

export const useCatalogStore = create<CatalogStore>((set) => ({
  globalSettings: {
    primaryColor: '#00AEEF',
    logoUrl: '',
    footerText: 'www.exemplo.com.br',
    companyName: 'Minha Loja',
    showHeader: true,
    headerTitle: 'Catálogo de Produtos',
    headerSubtitle: 'Ofertas Especiais',
    showDate: true,
  },
  pages: [
    {
      id: 'page-1',
      sections: [
        {
          id: 'section-1',
          type: 'header',
          title: 'DESTAQUES DA SEMANA',
        },
        {
          id: 'section-2',
          type: 'product-grid',
          columns: 3,
          products: [
            {
              id: 'prod-1',
              name: 'Exemplo Produto 1',
              price: 99.90,
              specs: ['Spec 1', 'Spec 2'],
              soldOut: false,
              piecesPerBox: 10,
            },
            {
              id: 'prod-2',
              name: 'Exemplo Produto 2',
              price: 149.90,
              specs: ['Spec A', 'Spec B'],
              soldOut: true,
              piecesPerBox: 5,
            },
          ],
        },
      ],
    },
  ],

  setGlobalSettings: (settings) =>
    set((state) => ({
      globalSettings: { ...state.globalSettings, ...settings },
    })),

  addPage: (pageId) =>
    set((state) => ({
      pages: [
        ...state.pages,
        {
          id: pageId || `page-${Date.now()}`,
          sections: [],
        },
      ],
    })),

  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== pageId),
    })),

  addSection: (pageId, section) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId ? { ...p, sections: [...p.sections, section] } : p
      ),
    })),

  updateSection: (pageId, sectionId, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId ? { ...s, ...updates } : s
            ),
          }
          : p
      ),
    })),

  removeSection: (pageId, sectionId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
            ...p,
            sections: p.sections.filter((s) => s.id !== sectionId),
          }
          : p
      ),
    })),

  addProduct: (pageId, sectionId, product) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId
                ? { ...s, products: [...(s.products || []), product] }
                : s
            ),
          }
          : p
      ),
    })),

  updateProduct: (pageId, sectionId, productId, updates) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  products: (s.products || []).map((prod) =>
                    prod.id === productId ? { ...prod, ...updates } : prod
                  ),
                }
                : s
            ),
          }
          : p
      ),
    })),

  removeProduct: (pageId, sectionId, productId) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        p.id === pageId
          ? {
            ...p,
            sections: p.sections.map((s) =>
              s.id === sectionId
                ? {
                  ...s,
                  products: (s.products || []).filter((prod) => prod.id !== productId),
                }
                : s
            ),
          }
          : p
      ),
    })),

  reorderSection: (pageId, sectionId, direction) =>
    set((state) => {
      const pageIndex = state.pages.findIndex((p) => p.id === pageId);
      if (pageIndex === -1) return state;

      const page = state.pages[pageIndex];
      const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return state;

      const newSections = [...page.sections];
      if (direction === 'up' && sectionIndex > 0) {
        [newSections[sectionIndex], newSections[sectionIndex - 1]] = [
          newSections[sectionIndex - 1],
          newSections[sectionIndex],
        ];
      } else if (direction === 'down' && sectionIndex < newSections.length - 1) {
        [newSections[sectionIndex], newSections[sectionIndex + 1]] = [
          newSections[sectionIndex + 1],
          newSections[sectionIndex],
        ];
      }

      const newPages = [...state.pages];
      newPages[pageIndex] = { ...page, sections: newSections };

      return { pages: newPages };
    }),
}));
