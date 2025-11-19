'use client';
import { useCatalogStore } from '@/store/catalogStore';
import { pdf } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CatalogDocument } from './CatalogDocument';

export const PDFDownloadButton = () => {
  const state = useCatalogStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Generate PDF blob on demand using the current state
      const blob = await pdf(<CatalogDocument state={state} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `catalogo-${state.globalSettings.companyName.replace(/\s+/g, '-').toLowerCase() || 'catalogo'}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowErrorModal(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Baixar PDF Vetorizado
          </>
        )}
      </button>
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erro ao gerar PDF"
        footer={
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            Fechar
          </Button>
        }
      >
        <p>Ocorreu um erro ao tentar gerar o PDF. Por favor, tente novamente.</p>
      </Modal>
    </>
  );
};
