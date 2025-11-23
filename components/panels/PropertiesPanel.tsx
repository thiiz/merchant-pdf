'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { ImageIcon, Plus, Trash2, X } from 'lucide-react';

// Placeholder sub-components (will be implemented fully in next steps)
import { useState } from 'react';
import { CatalogStateExport } from './data/CatalogStateExport';
import { CatalogStateImport } from './data/CatalogStateImport';
import { CSVExport } from './data/CSVExport';
import { CSVImport } from './data/CSVImport';

const GlobalSettingsForm = () => {
    const store = useCatalogStore();
    const [activeTab, setActiveTab] = useState<'settings' | 'data'>('settings');

    return (
        <div className="space-y-4">
            <div className="flex border-b border-gray-200">
                <button
                    className={cn(
                        "flex-1 pb-2 text-xs font-medium transition-colors",
                        activeTab === 'settings' ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab('settings')}
                >
                    Ajustes
                </button>
                <button
                    className={cn(
                        "flex-1 pb-2 text-xs font-medium transition-colors",
                        activeTab === 'data' ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab('data')}
                >
                    Dados
                </button>
            </div>

            {activeTab === 'settings' ? (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500">Cor Primária</label>
                        <div className="flex gap-2">
                            <input 
                                type="color" 
                                value={store.globalSettings.primaryColor}
                                onChange={(e) => store.setGlobalSettings({ primaryColor: e.target.value })}
                                className="h-8 w-10 p-0 border-0"
                            />
                            <input 
                                type="text" 
                                value={store.globalSettings.primaryColor}
                                onChange={(e) => store.setGlobalSettings({ primaryColor: e.target.value })}
                                className="flex-1 text-xs border rounded px-2"
                            />
                        </div>
                    </div>
                     <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500">Texto do Rodapé</label>
                        <input 
                            type="text" 
                            value={store.globalSettings.footerText}
                            onChange={(e) => store.setGlobalSettings({ footerText: e.target.value })}
                            className="w-full text-xs border rounded px-2 py-1.5"
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6 pt-2">
                     <div className="space-y-3">
                        <h3 className="text-xs font-medium text-gray-700 uppercase tracking-wider">Backup Completo</h3>
                        <div className="space-y-2">
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

                      <div className="space-y-2">
                          <CSVExport />
                          <CSVImport />
                      </div>
                </div>
            )}
        </div>
    );
};

const ProductForm = ({ productId }: { productId: string }) => {
    const store = useCatalogStore();
    // Helper to find product
    let product: any = null;
    let pageId = '';
    let sectionId = '';

    for (const p of store.pages) {
        for (const s of p.sections) {
            const found = s.products?.find(prod => prod.id === productId);
            if (found) {
                product = found;
                pageId = p.id;
                sectionId = s.id;
                break;
            }
        }
        if (product) break;
    }

    if (!product) return <div className="p-4 text-gray-500 text-sm">Produto não encontrado.</div>;

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900 border-b pb-2">Editar Produto</h3>
            
            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">Nome</label>
                <input 
                    type="text" 
                    value={product.name}
                    onChange={(e) => store.updateProduct(pageId, sectionId, productId, { name: e.target.value })}
                    className="w-full text-xs border rounded px-2 py-1.5"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">SKU</label>
                <input 
                    type="text" 
                    value={product.sku || ''}
                    onChange={(e) => store.updateProduct(pageId, sectionId, productId, { sku: e.target.value })}
                    className="w-full text-xs border rounded px-2 py-1.5"
                    placeholder="Código do produto"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs font-medium text-gray-500">Preço Varejo</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={product.retailPrice}
                        onChange={(e) => store.updateProduct(pageId, sectionId, productId, { retailPrice: Number(e.target.value) })}
                        className="w-full text-xs border rounded px-2 py-1.5"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500">Preço Atacado</label>
                    <input 
                        type="number" 
                        step="0.01"
                        value={product.wholesalePrice}
                        onChange={(e) => store.updateProduct(pageId, sectionId, productId, { wholesalePrice: Number(e.target.value) })}
                        className="w-full text-xs border rounded px-2 py-1.5"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">Preço Drop</label>
                <input 
                    type="number" 
                    step="0.01"
                    value={product.dropPrice}
                    onChange={(e) => store.updateProduct(pageId, sectionId, productId, { dropPrice: Number(e.target.value) })}
                    className="w-full text-xs border rounded px-2 py-1.5"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">Peças por Caixa</label>
                <input 
                    type="number" 
                    value={product.piecesPerBox}
                    onChange={(e) => store.updateProduct(pageId, sectionId, productId, { piecesPerBox: Number(e.target.value) })}
                    className="w-full text-xs border rounded px-2 py-1.5"
                    min="1"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">Imagem do Produto</label>
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 bg-white rounded border border-gray-300 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-gray-400 transition-colors">
                        {product.image ? (
                            <img src={product.image} className="w-full h-full object-contain" alt="Product" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        store.updateProduct(pageId, sectionId, productId, { image: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <button
                        type="button"
                        className="text-[10px] text-blue-600 hover:underline text-center mt-2"
                        onClick={() => {
                            const url = window.prompt("URL da imagem:", product.image || '');
                            if (url !== null) store.updateProduct(pageId, sectionId, productId, { image: url });
                        }}
                    >
                        Link URL
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    id={`soldOut-${productId}`}
                    checked={product.soldOut}
                    onChange={(e) => store.updateProduct(pageId, sectionId, productId, { soldOut: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor={`soldOut-${productId}`} className="text-xs font-medium text-gray-500">
                    Produto Esgotado
                </label>
            </div>

            {/* Specs Section */}
            <div className="bg-white p-3 rounded border border-gray-200 space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Especificações</label>
                
                {/* Specs List */}
                {product.specs && product.specs.length > 0 && (
                    <div className="space-y-1.5">
                        {product.specs.map((spec: string, specIndex: number) => (
                            <div key={specIndex} className="flex gap-1.5">
                                <input
                                    className="flex-1 h-7 text-xs border rounded px-2"
                                    placeholder="Ex: Cor azul"
                                    value={spec}
                                    onChange={(e) => {
                                        const newSpecs = [...(product.specs || [])];
                                        newSpecs[specIndex] = e.target.value;
                                        store.updateProduct(pageId, sectionId, productId, { specs: newSpecs });
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        const newSpecs = product.specs?.filter((_: any, i: number) => i !== specIndex);
                                        store.updateProduct(pageId, sectionId, productId, { specs: newSpecs });
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Add Spec Button */}
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-xs"
                    onClick={() => {
                        const newSpecs = [...(product.specs || []), ''];
                        store.updateProduct(pageId, sectionId, productId, { specs: newSpecs });
                    }}
                >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar Especificação
                </Button>
            </div>

            <div className="pt-4">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                        if(confirm('Remover produto?')) {
                            store.removeProduct(pageId, sectionId, productId);
                            store.selectItem(null, null);
                        }
                    }}
                >
                    Remover Produto
                </Button>
            </div>
        </div>
    );
};

const SectionForm = ({ sectionId }: { sectionId: string }) => {
     const store = useCatalogStore();
    // Helper to find section
    let section: any = null;
    let pageId = '';

    for (const p of store.pages) {
        const found = p.sections.find(s => s.id === sectionId);
        if (found) {
            section = found;
            pageId = p.id;
            break;
        }
    }

    if (!section) return <div className="p-4 text-gray-500 text-sm">Seção não encontrada.</div>;

    return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900 border-b pb-2">Editar Seção</h3>
            
            <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500">Título</label>
                <input 
                    type="text" 
                    value={section.title || ''}
                    onChange={(e) => store.updateSection(pageId, sectionId, { title: e.target.value })}
                    className="w-full text-xs border rounded px-2 py-1.5"
                    placeholder="Sem título"
                />
            </div>

            {section.type === 'product-grid' && (
                 <div className="space-y-3">
                    <label className="text-xs font-medium text-gray-500">Colunas</label>
                    <select 
                        value={section.columns}
                        onChange={(e) => store.updateSection(pageId, sectionId, { columns: Number(e.target.value) as any })}
                        className="w-full text-xs border rounded px-2 py-1.5"
                    >
                        <option value={2}>2 Colunas</option>
                        <option value={3}>3 Colunas</option>
                        <option value={4}>4 Colunas</option>
                    </select>
                </div>
            )}

             <div className="pt-4">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                        if(confirm('Remover seção?')) {
                            store.removeSection(pageId, sectionId);
                            store.selectItem(null, null);
                        }
                    }}
                >
                    Remover Seção
                </Button>
            </div>
        </div>
    );
}

const PageForm = ({ pageId }: { pageId: string }) => {
     const store = useCatalogStore();
     const pageIndex = store.pages.findIndex(p => p.id === pageId);

     if (pageIndex === -1) return <div className="p-4 text-gray-500 text-sm">Página não encontrada.</div>;

     return (
        <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-900 border-b pb-2">Editar Página {pageIndex + 1}</h3>
            
             <div className="pt-4">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                        if(confirm('Remover página?')) {
                            store.removePage(pageId);
                            store.selectItem(null, null);
                        }
                    }}
                >
                    Remover Página
                </Button>
            </div>
        </div>
    );
}

export const PropertiesPanel = () => {
  const store = useCatalogStore();

  const renderContent = () => {
    switch (store.selectedType) {
        case 'product':
            return <ProductForm productId={store.selectedId!} />;
        case 'section':
            return <SectionForm sectionId={store.selectedId!} />;
        case 'page':
            return <PageForm pageId={store.selectedId!} />;
        default:
            return <GlobalSettingsForm />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <h2 className="font-semibold text-sm text-gray-700">Propriedades</h2>
        {store.selectedType && (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => store.selectItem(null, null)}>
                <X className="w-4 h-4" />
            </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
};
