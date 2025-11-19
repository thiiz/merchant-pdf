'use client';

import { ConfigurationPanel } from '@/components/Editor/ConfigurationPanel';
import { PDFDownloadButton } from '@/components/PDF/PDFDownloadButton';
import { A4Page } from '@/components/Preview/A4Page';
import { useCatalogStore } from '@/store/catalogStore';

export default function Home() {
  const { pages } = useCatalogStore();

  return (
    <main className="flex h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-900">
      {/* Left Panel: Editor */}
      <div className="w-[400px] h-full flex-shrink-0 z-10 shadow-xl print:hidden">
        <ConfigurationPanel />
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 h-full overflow-y-auto bg-gray-200/50 p-8 relative flex flex-col items-center">

        {/* Toolbar */}
        <div className="sticky top-4 z-20 mb-8 flex gap-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20 print:hidden">
          <PDFDownloadButton />
        </div>

        {/* A4 Pages Container */}
        <div className="flex flex-col gap-8 print:gap-0">
          {pages.map((page) => (
            <div key={page.id} className="print:break-after-page">
              <A4Page page={page} />
            </div>
          ))}
        </div>

        <div className="h-20 print:hidden"></div>
      </div>
    </main>
  );
}
