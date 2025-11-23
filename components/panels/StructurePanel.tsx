'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { ChevronDown, ChevronRight, FileText, Layers, Layout, Plus } from 'lucide-react';
import { useState } from 'react';

export const StructurePanel = () => {
  const store = useCatalogStore();
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});

  const togglePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const handleSelect = (type: 'page' | 'section', id: string) => {
    store.selectItem(type, id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <h2 className="font-semibold text-sm text-gray-700">Estrutura</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={() => store.addPage()}
          title="Nova Página"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {store.pages.map((page, index) => (
          <div key={page.id} className="space-y-1">
            {/* Page Item */}
            <div 
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors group",
                store.selectedId === page.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
              )}
              onClick={() => handleSelect('page', page.id)}
            >
              <button 
                onClick={(e) => togglePage(page.id, e)}
                className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
              >
                {expandedPages[page.id] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              <FileText className="w-4 h-4 opacity-70" />
              <span className="text-sm font-medium truncate flex-1">Página {index + 1}</span>
            </div>

            {/* Sections List */}
            {expandedPages[page.id] && (
              <div className="pl-6 space-y-0.5 border-l border-gray-100 ml-3">
                {page.sections.map((section) => (
                  <div 
                    key={section.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs",
                      store.selectedId === section.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-600"
                    )}
                    onClick={() => handleSelect('section', section.id)}
                  >
                    {section.type === 'header' ? <Layers className="w-3 h-3 opacity-70" /> : <Layout className="w-3 h-3 opacity-70" />}
                    <span className="truncate flex-1">{section.title || (section.type === 'header' ? 'Título' : 'Grade de Produtos')}</span>
                  </div>
                ))}
                <div className="pt-1">
                   <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-[10px] h-6 text-gray-400 hover:text-gray-600 px-2"
                    onClick={() => store.addSection(page.id, {
                        id: `sec-${Date.now()}`,
                        type: 'header',
                        title: 'NOVA SEÇÃO'
                    })}
                   >
                     <Plus className="w-3 h-3 mr-1" /> Add Seção
                   </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
