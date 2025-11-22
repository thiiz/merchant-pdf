'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '../ui/Modal';

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

export const CSVExport = () => {
  const store = useCatalogStore();
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  const handleExport = () => {
    // Coletar todos os produtos de todas as seções e páginas
    const products: any[] = [];
    store.pages.forEach(page => {
      page.sections.forEach(section => {
        if (section.products && section.products.length > 0) {
          products.push(...section.products);
        }
      });
    });

    if (products.length === 0) {
      setShowEmptyAlert(true);
      return;
    }

    // Definir cabeçalhos compatíveis com o importador
    const headers = ["Nome produto", "SKU", "Preço venda", "Imagem principal", "Estoque atual"];

    // Gerar conteúdo CSV
    const csvContent = [
      headers.join(';'),
      ...products.map(p => {
        const price = p.retailPrice.toFixed(2).replace('.', ',');

        // Estoque (0 = esgotado, 100 = disponível)
        const stock = p.soldOut ? '0' : '100';

        // Função para escapar aspas duplas
        const escape = (str: string) => {
          if (!str) return '';
          return `"${String(str).replace(/"/g, '""')}"`;
        };

        return [
          escape(p.name),
          escape(p.sku || ''),
          escape(price),
          escape(p.image || ''),
          stock
        ].join(';');
      })
    ].join('\n');

    // Criar Blob e link de download
    // Adicionar BOM para o Excel abrir corretamente com acentos
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `catalogo_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900">Exportar Catálogo</h3>
          <p className="text-xs text-gray-500">Baixe um arquivo .csv com todos os produtos atuais.</p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Modal
        isOpen={showEmptyAlert}
        onClose={() => setShowEmptyAlert(false)}
        title="Exportação Vazia"
        footer={
          <Button onClick={() => setShowEmptyAlert(false)} variant="primary">
            Entendi
          </Button>
        }
      >
        <p>Nenhum produto encontrado para exportar. Adicione produtos ao seu catálogo antes de exportar.</p>
      </Modal>
    </div>
  );
};
