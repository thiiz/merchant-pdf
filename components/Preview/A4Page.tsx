import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { cn } from '@/lib/utils';
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
          padding: `${DESIGN_TOKENS.components.page.padding.px}px`,
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
            {page.sections.map((section) => (
              <InteractiveSection key={section.id} section={section} pageId={page.id}>
                <div className="w-full">
                  {section.type === 'header' && (
                    <div style={{ marginBottom: `${DESIGN_TOKENS.components.section.marginBottom.px}px` }}>
                      <h2
                        className="font-black uppercase tracking-tight text-gray-900"
                        style={{
                          fontSize: `${DESIGN_TOKENS.components.section.title.fontSize.px}px`,
                          borderLeft: `${DESIGN_TOKENS.components.section.title.borderLeft.px}px solid ${primaryColor}`,
                          paddingLeft: `${DESIGN_TOKENS.components.section.title.paddingLeft.px}px`,
                          marginBottom: `${DESIGN_TOKENS.components.section.title.marginBottom.px}px`
                        }}
                      >
                        {section.title}
                      </h2>
                    </div>
                  )}

                  {section.type === 'product-grid' && (
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
                      </div>
                    </SortableContext>
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
