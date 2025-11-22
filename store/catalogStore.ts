import { CatalogState, GlobalSettings, Product, Section } from '@/types/catalog';
import { create } from 'zustand';

interface CatalogStore extends CatalogState {
  // Actions
  setGlobalSettings: (settings: Partial<GlobalSettings>) => void;
  addPage: (pageId?: string) => void;
  removePage: (pageId: string) => void;
  reorderPages: (oldIndex: number, newIndex: number) => void;
  addSection: (pageId: string, section: Section) => void;
  updateSection: (pageId: string, sectionId: string, updates: Partial<Section>) => void;
  removeSection: (pageId: string, sectionId: string) => void;
  addProduct: (pageId: string, sectionId: string, product: Product) => void;
  updateProduct: (pageId: string, sectionId: string, productId: string, updates: Partial<Product>) => void;
  removeProduct: (pageId: string, sectionId: string, productId: string) => void;
  reorderSection: (pageId: string, sectionId: string, direction: 'up' | 'down') => void;
  reorderProducts: (pageId: string, sectionId: string, oldIndex: number, newIndex: number) => void;
  moveProduct: (sourcePageId: string, sourceSectionId: string, targetPageId: string, targetSectionId: string, productId: string, newIndex: number) => void;
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
              retailPrice: 99.90,
              wholesalePrice: 79.90,
              dropPrice: 89.90,
              soldOut: false,
              piecesPerBox: 10,
            },
            {
              id: 'prod-2',
              name: 'Exemplo Produto 2',
              retailPrice: 149.90,
              wholesalePrice: 119.90,
              dropPrice: 134.90,
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
        p.id === pageId
          ? {
            ...p,
            // Insert 'header' sections at the beginning, others at the end
            sections: section.type === 'header'
              ? [section, ...p.sections]
              : [...p.sections, section],
          }
          : p
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

  reorderPages: (oldIndex, newIndex) =>
    set((state) => {
      const newPages = [...state.pages];
      const [movedPage] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, movedPage);
      return { pages: newPages };
    }),

  reorderProducts: (pageId, sectionId, oldIndex, newIndex) =>
    set((state) => {
      const pageIndex = state.pages.findIndex((p) => p.id === pageId);
      if (pageIndex === -1) return state;

      const page = state.pages[pageIndex];
      const sectionIndex = page.sections.findIndex((s) => s.id === sectionId);
      if (sectionIndex === -1) return state;

      const section = page.sections[sectionIndex];
      if (!section.products) return state;

      const newProducts = [...section.products];
      const [movedProduct] = newProducts.splice(oldIndex, 1);
      newProducts.splice(newIndex, 0, movedProduct);

      const newSections = [...page.sections];
      newSections[sectionIndex] = { ...section, products: newProducts };

      const newPages = [...state.pages];
      newPages[pageIndex] = { ...page, sections: newSections };

      return { pages: newPages };
    }),

  moveProduct: (sourcePageId, sourceSectionId, targetPageId, targetSectionId, productId, newIndex) =>
    set((state) => {
      // Deep clone pages to avoid mutation issues
      const newPages = JSON.parse(JSON.stringify(state.pages));

      // Find source
      const sourcePageIndex = newPages.findIndex((p: any) => p.id === sourcePageId);
      if (sourcePageIndex === -1) return state;
      const sourceSectionIndex = newPages[sourcePageIndex].sections.findIndex((s: any) => s.id === sourceSectionId);
      if (sourceSectionIndex === -1) return state;

      // Find target
      const targetPageIndex = newPages.findIndex((p: any) => p.id === targetPageId);
      if (targetPageIndex === -1) return state;
      const targetSectionIndex = newPages[targetPageIndex].sections.findIndex((s: any) => s.id === targetSectionId);
      if (targetSectionIndex === -1) return state;

      // Get product
      const sourceProducts = newPages[sourcePageIndex].sections[sourceSectionIndex].products || [];
      const productIndex = sourceProducts.findIndex((p: any) => p.id === productId);
      if (productIndex === -1) return state;

      const [movedProduct] = sourceProducts.splice(productIndex, 1);

      // Add to target
      if (!newPages[targetPageIndex].sections[targetSectionIndex].products) {
        newPages[targetPageIndex].sections[targetSectionIndex].products = [];
      }

      const targetProducts = newPages[targetPageIndex].sections[targetSectionIndex].products;

      // Ensure index is within bounds
      const safeIndex = Math.min(Math.max(0, newIndex), targetProducts.length);
      targetProducts.splice(safeIndex, 0, movedProduct);

      return { pages: newPages };
    }),
}));
