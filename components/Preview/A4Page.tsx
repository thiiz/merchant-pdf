import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Page } from '@/types/catalog';
import React from 'react';
import { ProductCard } from './ProductCard';

interface A4PageProps {
  page: Page;
}

export const A4Page: React.FC<A4PageProps> = ({ page }) => {
  const { globalSettings } = useCatalogStore();
  const { primaryColor, footerText, companyName, logoUrl } = globalSettings;

  return (
    <div className="w-[210mm] h-[297mm] bg-white shadow-lg mx-auto relative flex flex-col overflow-hidden print:shadow-none print:m-0 print:w-full print:h-full">
      {/* Header Background Decoration */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          backgroundColor: primaryColor,
          height: `${DESIGN_TOKENS.components.header.decoration.height.px}px`
        }}
      ></div>

      {/* Content Area */}
      <div
        className="flex-grow flex flex-col"
        style={{
          padding: `${DESIGN_TOKENS.components.page.padding.px}px`,
          gap: `${DESIGN_TOKENS.components.header.contentGap.px}px`
        }}
      >

        {/* Page Header (Optional, usually on first page or repeated) */}
        <div
          className="flex items-center justify-between"
          style={{
            borderBottom: `${DESIGN_TOKENS.components.header.borderBottom.px}px solid ${primaryColor}`,
            paddingBottom: `${DESIGN_TOKENS.components.header.paddingBottom.px}px`
          }}
        >
          <div className="flex items-center" style={{ gap: `${DESIGN_TOKENS.components.header.logoCompanyGap.px}px` }}>
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Logo"
                className="object-contain"
                style={{ height: `${DESIGN_TOKENS.components.header.logo.height.px}px` }}
              />
            )}
            <div>
              <h1
                className="font-bold text-gray-900 uppercase tracking-wider"
                style={{ fontSize: `${DESIGN_TOKENS.components.header.companyName.fontSize.px}px` }}
              >
                {companyName}
              </h1>
              <p style={{
                fontSize: `${DESIGN_TOKENS.components.header.subtitle.fontSize.px}px`,
                color: DESIGN_TOKENS.components.header.subtitle.color
              }}>
                Catálogo de Produtos
              </p>
            </div>
          </div>
          <div className="text-right">
            <p
              className="font-bold"
              style={{
                color: primaryColor,
                fontSize: `${DESIGN_TOKENS.components.header.specialOffer.fontSize.px}px`
              }}
            >
              Ofertas Especiais
            </p>
            <p style={{
              fontSize: `${DESIGN_TOKENS.components.header.subtitle.fontSize.px}px`,
              color: DESIGN_TOKENS.components.header.subtitle.color
            }}>
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div
          className="flex flex-col"
          style={{ gap: `${DESIGN_TOKENS.components.header.contentGap.px}px` }}
        >
          {page.sections.map((section) => (
            <div key={section.id} className="w-full">
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
                    <div key={product.id} className="h-full">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
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
