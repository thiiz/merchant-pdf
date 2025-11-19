import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Page, Section } from '@/types/catalog';
import { ProductCard } from './ProductCard';

export const SectionOverlay = ({ section }: { section: Section }) => {
  const { globalSettings } = useCatalogStore();
  const { primaryColor } = globalSettings;

  return (
    <div className="bg-white p-4 rounded-lg shadow-2xl border-2 border-blue-500 opacity-90 cursor-grabbing w-[210mm] max-w-full">
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
            <div key={product.id} className="h-full pointer-events-none">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PageOverlay = ({ page, index }: { page: Page; index: number }) => {
  return (
    <div className="bg-white w-[200px] h-[280px] shadow-2xl rounded-lg border-4 border-blue-500 flex flex-col items-center justify-center gap-4 cursor-grabbing relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
      <div className="text-center p-4">
        <h3 className="font-bold text-xl text-gray-900">Página {index + 1}</h3>
        <p className="text-sm text-gray-500 mt-2">{page.sections.length} seções</p>
      </div>
      <div className="w-full px-4 space-y-2 opacity-30">
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};
