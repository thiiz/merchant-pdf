'use client';

import { Button as UiButton } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { CatalogState } from '@/types/catalog';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const Button = ({ className, variant = 'primary', size = 'md', ...props }: any) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-black text-white hover:bg-black/90 shadow",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 shadow-sm"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2 text-sm",
    icon: "h-8 w-8",
  };
  return <button className={cn(base, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)} {...props} />;
};

interface ImportedData {
  version?: string;
  exportDate?: string;
  pages: CatalogState['pages'];
  globalSettings: CatalogState['globalSettings'];
}

export const CatalogStateImport = () => {
  const store = useCatalogStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pendingData, setPendingData] = useState<ImportedData | null>(null);

  const validateImportedData = (data: any): data is ImportedData => {
    // Validação básica da estrutura
    if (!data || typeof data !== 'object') return false;
    if (!Array.isArray(data.pages)) return false;
    if (!data.globalSettings || typeof data.globalSettings !== 'object') return false;
    
    // Validar estrutura das páginas
    for (const page of data.pages) {
      if (!page.id || !Array.isArray(page.sections)) return false;
    }
    
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        if (!validateImportedData(data)) {
          setErrorMessage('O arquivo selecionado não possui o formato correto de catálogo.');
          setShowErrorModal(true);
          return;
        }
        
        // Armazenar dados e mostrar confirmação
        setPendingData(data);
        setShowConfirmModal(true);
        
      } catch (error) {
        setErrorMessage('Erro ao ler o arquivo. Certifique-se de que é um arquivo JSON válido.');
        setShowErrorModal(true);
      }
    };
    
    reader.onerror = () => {
      setErrorMessage('Erro ao ler o arquivo.');
      setShowErrorModal(true);
    };
    
    reader.readAsText(file);
    
    // Resetar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmImport = () => {
    if (!pendingData) return;
    
    // Usar a nova função importCatalog do store
    store.importCatalog({
      pages: pendingData.pages,
      globalSettings: pendingData.globalSettings,
    });
    
    setShowConfirmModal(false);
    setPendingData(null);
  };

  const cancelImport = () => {
    setShowConfirmModal(false);
    setPendingData(null);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900">Importar Estado Completo</h3>
            <p className="text-xs text-gray-500">
              Carregue um arquivo .json para restaurar todo o catálogo.
            </p>
          </div>
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="primary" 
            size="sm" 
            className="shrink-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            Importar JSON
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={cancelImport}
        title="Confirmar Importação"
        footer={
          <>
            <UiButton variant="outline" onClick={cancelImport}>
              Cancelar
            </UiButton>
            <UiButton variant="destructive" onClick={confirmImport}>
              Substituir Tudo
            </UiButton>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong className="text-red-600">Atenção:</strong> Esta ação irá{' '}
            <strong>substituir completamente</strong> todo o conteúdo atual do catálogo.
          </p>
          
          {pendingData && (
            <div className="bg-gray-50 rounded-md p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Páginas:</span>
                <span className="font-medium">{pendingData.pages.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Produtos:</span>
                <span className="font-medium">
                  {pendingData.pages.reduce((total, page) => 
                    total + page.sections.reduce((sectionTotal, section) => 
                      sectionTotal + (section.products?.length || 0), 0
                    ), 0
                  )}
                </span>
              </div>
              {pendingData.exportDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Exportado em:</span>
                  <span className="font-medium">
                    {new Date(pendingData.exportDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-sm text-gray-600">
            Certifique-se de ter feito backup do catálogo atual antes de continuar.
          </p>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Erro na Importação"
        footer={
          <UiButton onClick={() => setShowErrorModal(false)} variant="primary">
            Entendi
          </UiButton>
        }
      >
        <p className="text-sm text-gray-700">{errorMessage}</p>
      </Modal>
    </>
  );
};
