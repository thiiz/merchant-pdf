import { CatalogState, CoverPage, GlobalSettings, Product, Section } from '@/types/catalog';
import { create } from 'zustand';

interface HistoryState {
  past: CatalogState[];
  future: CatalogState[];
}

interface CatalogStore extends CatalogState {
  // History
  history: HistoryState;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
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
  moveProductToNextPage: (sourcePageId: string, sourceSectionId: string, productId: string) => void;
  importCatalog: (state: CatalogState) => void;
  
  // Cover Page
  setCoverPage: (cover: Partial<CoverPage>) => void;
  removeCoverPage: () => void;
  
  // Selection State
  selectedId: string | null;
  selectedType: 'page' | 'section' | 'product' | 'global' | null;
  selectItem: (type: 'page' | 'section' | 'product' | 'global' | null, id: string | null) => void;
}

const MAX_HISTORY = 50;

export const useCatalogStore = create<CatalogStore>((set, get) => {
  
  const pushHistory = () => {
    set((state) => {
      const currentSnapshot: CatalogState = {
        pages: state.pages,
        globalSettings: state.globalSettings,
        coverPage: state.coverPage,
      };
      
      const newPast = [...state.history.past, currentSnapshot].slice(-MAX_HISTORY);
      
      return {
        history: {
          past: newPast,
          future: [],
        }
      };
    });
  };

  return {
    coverPage: {
      enabled: false,
      imageUrl: '',
    },
    globalSettings: {
      primaryColor: '#00AEEF',
      logoUrl: '',
      footerText: 'www.exemplo.com.br',
      companyName: 'Minha Loja',
      showHeader: true,
      headerTitle: 'Catálogo de Produtos',
      headerSubtitle: 'Ofertas Especiais',
      showDate: true,
      showPiecesPerBox: true,
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

    history: {
      past: [],
      future: [],
    },

    undo: () => set((state) => {
      if (state.history.past.length === 0) return state;

      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      
      const currentSnapshot: CatalogState = {
        pages: state.pages,
        globalSettings: state.globalSettings,
        coverPage: state.coverPage,
      };

      return {
        ...previous,
        history: {
          past: newPast,
          future: [currentSnapshot, ...state.history.future],
        }
      };
    }),

    redo: () => set((state) => {
      if (state.history.future.length === 0) return state;

      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);

      const currentSnapshot: CatalogState = {
        pages: state.pages,
        globalSettings: state.globalSettings,
        coverPage: state.coverPage,
      };

      return {
        ...next,
        history: {
          past: [...state.history.past, currentSnapshot],
          future: newFuture,
        }
      };
    }),

    canUndo: () => get().history.past.length > 0,
    canRedo: () => get().history.future.length > 0,

    setGlobalSettings: (settings) => {
      pushHistory();
      set((state) => ({
        globalSettings: { ...state.globalSettings, ...settings },
      }));
    },

    addPage: (pageId) => {
      pushHistory();
      set((state) => ({
        pages: [
          ...state.pages,
          {
            id: pageId || `page-${Date.now()}`,
            sections: [
              {
                id: `sec-${Date.now()}-1`,
                type: 'product-grid',
                columns: 3,
                products: [],
              },
            ],
          },
        ],
      }));
    },

    removePage: (pageId) => {
      pushHistory();
      set((state) => ({
        pages: state.pages.filter((p) => p.id !== pageId),
      }));
    },

    addSection: (pageId, section) => {
      pushHistory();
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
      }));
    },

    updateSection: (pageId, sectionId, updates) => {
      pushHistory();
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
      }));
    },

    removeSection: (pageId, sectionId) => {
      pushHistory();
      set((state) => ({
        pages: state.pages.map((p) =>
          p.id === pageId
            ? {
              ...p,
              sections: p.sections.filter((s) => s.id !== sectionId),
            }
            : p
        ),
      }));
    },

    addProduct: (pageId, sectionId, product) => {
      pushHistory();
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
      }));
    },

    updateProduct: (pageId, sectionId, productId, updates) => {
      // Note: We might want to debounce this for text inputs to avoid too many history entries
      // But for now, we'll just push history.
      pushHistory();
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
      }));
    },

    removeProduct: (pageId, sectionId, productId) => {
      pushHistory();
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
      }));
    },

    reorderSection: (pageId, sectionId, direction) => {
      pushHistory();
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
      });
    },

    reorderPages: (oldIndex, newIndex) => {
      pushHistory();
      set((state) => {
        const newPages = [...state.pages];
        const [movedPage] = newPages.splice(oldIndex, 1);
        newPages.splice(newIndex, 0, movedPage);
        return { pages: newPages };
      });
    },

    reorderProducts: (pageId, sectionId, oldIndex, newIndex) => {
      pushHistory();
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
      });
    },

    moveProduct: (sourcePageId, sourceSectionId, targetPageId, targetSectionId, productId, newIndex) => {
      pushHistory();
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
      });
    },

    importCatalog: (state) =>
      set(() => ({
        pages: state.pages,
        globalSettings: state.globalSettings,
        coverPage: state.coverPage,
        history: { past: [], future: [] } // Reset history on import
      })),

    moveProductToNextPage: (sourcePageId, sourceSectionId, productId) => {
      pushHistory();
      set((state) => {
        const newPages = JSON.parse(JSON.stringify(state.pages));
        
        // Find source
        const sourcePageIndex = newPages.findIndex((p: any) => p.id === sourcePageId);
        if (sourcePageIndex === -1) return state;
        
        const sourceSectionIndex = newPages[sourcePageIndex].sections.findIndex((s: any) => s.id === sourceSectionId);
        if (sourceSectionIndex === -1) return state;
        
        // Get product
        const sourceProducts = newPages[sourcePageIndex].sections[sourceSectionIndex].products || [];
        const productIndex = sourceProducts.findIndex((p: any) => p.id === productId);
        if (productIndex === -1) return state;
        
        const [movedProduct] = sourceProducts.splice(productIndex, 1);
        
        // Determine target page
        let targetPageIndex = sourcePageIndex + 1;
        
        // Create new page if it doesn't exist
        if (targetPageIndex >= newPages.length) {
          newPages.push({
            id: `page-${Date.now()}`,
            sections: [
              {
                id: `sec-${Date.now()}-1`,
                type: 'product-grid',
                columns: 3,
                products: [],
              },
            ],
          });
        }
        
        // Find first product-grid section in target page
        const targetPage = newPages[targetPageIndex];
        const targetSectionIndex = targetPage.sections.findIndex((s: any) => s.type === 'product-grid');
        
        if (targetSectionIndex !== -1) {
          if (!targetPage.sections[targetSectionIndex].products) {
            targetPage.sections[targetSectionIndex].products = [];
          }
          // Add to the beginning of the target section
          targetPage.sections[targetSectionIndex].products.unshift(movedProduct);
        } else {
          // Fallback
          return state;
        }
        
        return { pages: newPages };
      });
    },

    // Cover Page Actions
    setCoverPage: (cover) => {
      pushHistory();
      set((state) => ({
        coverPage: { ...state.coverPage, ...cover } as CoverPage,
      }));
    },

    removeCoverPage: () => {
      pushHistory();
      set(() => ({
        coverPage: { enabled: false, imageUrl: '' },
      }));
    },

    selectedId: null,
    selectedType: null,
    selectItem: (type, id) => set({ selectedType: type, selectedId: id }),
  };
});
