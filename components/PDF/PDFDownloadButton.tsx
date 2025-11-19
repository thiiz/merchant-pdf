'use client';

import { useCatalogStore } from '@/store/catalogStore';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CatalogDocument } from './CatalogDocument';

export const PDFDownloadButton = () => {
  const state = useCatalogStore();
  const [isClient, setIsClient] = useState(false);
  const [debouncedState, setDebouncedState] = useState(state);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debounce state updates to avoid excessive PDF regeneration and fix crash on removal
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedState(state);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  if (!isClient) {
    return (
      <button disabled className="flex items-center gap-2 bg-gray-300 text-white px-6 py-2 rounded-full font-medium cursor-not-allowed">
        <Loader2 className="w-4 h-4 animate-spin" />
        Carregando...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      key={JSON.stringify(debouncedState)}
      document={<CatalogDocument state={debouncedState} />}
      fileName={`catalogo-${debouncedState.globalSettings.companyName.replace(/\s+/g, '-').toLowerCase()}.pdf`}
      className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando PDF...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Baixar PDF Vetorizado
          </span>
        )
      }
    </PDFDownloadLink>
  );
};
