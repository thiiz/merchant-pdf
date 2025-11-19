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
      <div className="absolute top-0 left-0 w-full h-4" style={{ backgroundColor: primaryColor }}></div>

      {/* Content Area */}
      <div className="flex-grow px-8 py-8 flex flex-col gap-6">

        {/* Page Header (Optional, usually on first page or repeated) */}
        <div className="flex items-center justify-between border-b-2 pb-4" style={{ borderColor: primaryColor }}>
          <div className="flex items-center gap-4">
            {logoUrl && <img src={logoUrl} alt="Logo" className="h-12 object-contain" />}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">{companyName}</h1>
              <p className="text-xs text-gray-500">Catálogo de Produtos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: primaryColor }}>Ofertas Especiais</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {page.sections.map((section) => (
            <div key={section.id} className="w-full">
              {section.type === 'header' && (
                <div className="mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 border-l-8 pl-3" style={{ borderColor: primaryColor }}>
                    {section.title}
                  </h2>
                </div>
              )}

              {section.type === 'product-grid' && (
                <div className={cn(
                  "grid gap-4",
                  section.columns === 2 && "grid-cols-2",
                  section.columns === 3 && "grid-cols-3",
                  section.columns === 4 && "grid-cols-4"
                )}>
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
      <div className="mt-auto bg-gray-100 py-3 px-8 flex items-center justify-between border-t-4" style={{ borderColor: primaryColor }}>
        <p className="text-[10px] text-gray-600 font-medium">{footerText}</p>
        <p className="text-[10px] text-gray-400">Página {page.id.split('-')[1]}</p>
      </div>
    </div>
  );
};
