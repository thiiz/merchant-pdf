'use client';

import { EditorLayout } from '@/components/layouts/EditorLayout';
import { PropertiesPanel } from '@/components/panels/PropertiesPanel';
import { StructurePanel } from '@/components/panels/StructurePanel';
import { PDFDownloadButton } from '@/components/PDF/PDFDownloadButton';
import { InteractivePage } from '@/components/Preview/InteractivePage';
import { useCatalogStore } from '@/store/catalogStore';

export default function Home() {
  const { pages } = useCatalogStore();

  return (
    <EditorLayout
      leftPanel={<StructurePanel />}
      rightPanel={<PropertiesPanel />}
      centerPanel={
        <div className="h-full overflow-y-auto bg-gray-200/50 p-8 relative flex flex-col items-center">
            {/* Toolbar */}
            <div className="sticky top-4 z-20 mb-8 flex gap-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20 print:hidden">
              <PDFDownloadButton />
            </div>

            {/* A4 Pages Container */}
            <div className="flex flex-col gap-8 print:gap-0">
              {pages.map((page, index) => (
                <InteractivePage key={page.id} page={page} index={index} />
              ))}
            </div>

            <div className="h-20 print:hidden"></div>
        </div>
      }
    />
  );
}
