import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { cn, darkenColor } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Page } from '@/types/catalog';
import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import React from 'react';
import { InteractiveProduct } from './InteractiveProduct';
import { InteractiveSection } from './InteractiveSection';

interface A4PageProps {
  page: Page;
}

export const A4Page: React.FC<A4PageProps> = ({ page }) => {
  const { globalSettings } = useCatalogStore();
  const { primaryColor, footerText, companyName, logoUrl, showHeader, headerTitle, headerSubtitle, showDate } = globalSettings;
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg mx-auto relative flex flex-col overflow-hidden print:shadow-none print:m-0 print:w-full print:h-full">
      {/* Content Area */}
      <div
        className="flex-grow flex flex-col"
        style={{
          // Padding removed to allow full-width sections
          gap: `${DESIGN_TOKENS.components.header.contentGap.px}px`
        }}
      >
        {/* Sections with Drag and Drop */}
        <SortableContext
          items={page.sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className="flex flex-col"
            style={{ gap: `${DESIGN_TOKENS.components.header.contentGap.px}px` }}
          >
            {page.sections.map((section, index) => (
              <InteractiveSection key={section.id} section={section} pageId={page.id}>
                <div className="w-full">
                  {section.type === 'header' && (
                    <div
                      className="flex items-center justify-between w-full"
                      style={{
                        marginBottom: `${DESIGN_TOKENS.components.section.marginBottom.px}px`,
                        backgroundColor: darkenColor(primaryColor, 85), // Dark background
                        padding: `${DESIGN_TOKENS.components.section.title.paddingLeft.px}px ${DESIGN_TOKENS.components.page.padding.px}px`, // Horizontal padding matches page padding
                        minHeight: '60px'
                      }}
                    >
                      {/* Left Side: Line + Title */}
                      <div className="flex items-center">
                        {/* Red vertical line */}
                        <div
                          style={{
                            width: '4px',
                            height: '24px',
                            backgroundColor: primaryColor,
                            marginRight: '12px'
                          }}
                        />

                        <h2
                          className="font-black uppercase tracking-tight"
                          style={{
                            fontSize: `${DESIGN_TOKENS.components.section.title.fontSize.px}px`,
                            color: '#FFFFFF', // White text
                            margin: 0,
                            lineHeight: 1
                          }}
                        >
                          {section.title}
                        </h2>
                      </div>

                      {/* Right Side: Logo */}
                      {logoUrl && (
                        <div className="ml-4 h-8 w-auto relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={logoUrl}
                            alt="Logo"
                            className="h-full w-auto object-contain"
                            style={{ maxHeight: '32px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {section.type === 'product-grid' && (
                    <div style={{
                      paddingLeft: `${DESIGN_TOKENS.components.page.padding.px}px`,
                      paddingRight: `${DESIGN_TOKENS.components.page.padding.px}px`,
                      paddingTop: index === 0 ? `${DESIGN_TOKENS.components.page.padding.px}px` : '0px'
                    }}>
                      <SortableContext
                        items={section.products?.map(p => p.id) || []}
                        strategy={rectSortingStrategy}
                      >
                        <div
                          className={cn(
                            "grid",
                            section.columns === 2 && "grid-cols-2",
                            section.columns === 3 && "grid-cols-3",
                            section.columns === 4 && "grid-cols-4"
                          )}
                          style={{ gap: `${DESIGN_TOKENS.components.grid.gap.px}px` }}
                        >
                          {section.products?.map((product) => (
                            <InteractiveProduct
                              key={product.id}
                              product={product}
                              pageId={page.id}
                              sectionId={section.id}
                            />
                          ))}
                          
                          {/* Add Product Button */}
                          {(() => {
                            const maxProducts = {
                              2: 4,
                              3: 6,
                              4: 8
                            }[section.columns || 3] || 6;
                            
                            const currentCount = section.products?.length || 0;
                            
                            if (currentCount < maxProducts) {
                              return (
                                <button
                                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 transition-all group h-full min-h-[150px]"
                                  onClick={() => {
                                    const { addProduct } = useCatalogStore.getState();
                                    addProduct(page.id, section.id, {
                                      id: `prod-${Date.now()}`,
                                      name: 'Novo Produto',
                                      retailPrice: 0,
                                      wholesalePrice: 0,
                                      dropPrice: 0,
                                      soldOut: false,
                                      piecesPerBox: 1,
                                    });
                                  }}
                                >
                                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-blue-500">
                                      <path d="M5 12h14" />
                                      <path d="M12 5v14" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-medium text-gray-400 group-hover:text-blue-600">
                                    Adicionar Produto
                                  </span>
                                </button>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </SortableContext>
                    </div>
                  )}
                </div>
              </InteractiveSection>
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Footer */}
      <div
        className="mt-auto bg-gray-100 flex items-center justify-between"
        style={{
          padding: `${DESIGN_TOKENS.components.footer.padding.px}px ${DESIGN_TOKENS.components.footer.paddingX.px}px`,
          borderTop: `${DESIGN_TOKENS.components.footer.borderTop.px}px solid ${primaryColor}`
        }}
      >
        <p
          className="font-medium"
          style={{
            fontSize: `${DESIGN_TOKENS.components.footer.fontSize.px}px`,
            color: DESIGN_TOKENS.colors.gray[600]
          }}
        >
          {footerText}
        </p>
        <p
          style={{
            fontSize: `${DESIGN_TOKENS.components.footer.fontSize.px}px`,
            color: DESIGN_TOKENS.colors.gray[400]
          }}
        >
          Página {page.id.split('-')[1]}
        </p>
      </div>
    </div>
  );
};
