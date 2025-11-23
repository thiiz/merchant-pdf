'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Download } from 'lucide-react';

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

export const CatalogStateExport = () => {
  const store = useCatalogStore();

  const handleExport = () => {
    // Criar objeto com todo o estado do catálogo
    const catalogState = {
      version: "1.0.0", // Para versionamento futuro
      exportDate: new Date().toISOString(),
      pages: store.pages,
      globalSettings: store.globalSettings,
    };

    // Converter para JSON
    const jsonString = JSON.stringify(catalogState, null, 2);

    // Criar Blob e link de download
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = `catalogo_completo_${new Date().toISOString().split('T')[0]}.json`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-900">Exportar Estado Completo</h3>
          <p className="text-xs text-gray-500">
            Baixe um arquivo .json com todo o catálogo (páginas, produtos e configurações).
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" size="sm" className="shrink-0">
          <Download className="w-4 h-4 mr-2" />
          Exportar JSON
        </Button>
      </div>
    </div>
  );
};
