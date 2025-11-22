'use client';

import { CatalogStateExport } from './CatalogStateExport';
import { CatalogStateImport } from './CatalogStateImport';
import { CSVExport } from './CSVExport';
import { CSVImport } from './CSVImport';

export const DataPanel = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Gerenciamento de Dados</h2>
        <p className="text-sm text-gray-500">Importe ou exporte seus dados em diferentes formatos.</p>
      </div>

      {/* Estado Completo do Catálogo */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Backup Completo</h3>
        <div className="space-y-3">
          <CatalogStateExport />
          <CatalogStateImport />
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Produtos (CSV)</span>
        </div>
      </div>

      {/* CSV Import/Export */}
      <div className="space-y-3">
        <section>
          <CSVExport />
        </section>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Ou</span>
          </div>
        </div>

        <section>
          <CSVImport />
        </section>
      </div>
    </div>
  );
};
