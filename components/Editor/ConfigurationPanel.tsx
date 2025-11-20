'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Image as ImageIcon, Layout, Plus, Trash2, Type } from 'lucide-react';
import { useState } from 'react';
import { Button as UiButton } from '../ui/Button'; // Using the shared Button component for the Modal footer
import { Modal } from '../ui/Modal';
import { DataPanel } from './DataPanel';

// Simple UI Components
const Button = ({ className, variant = 'primary', size = 'md', ...props }: any) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    primary: "bg-black text-white hover:bg-black/90 shadow",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900"
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2 text-sm",
    icon: "h-8 w-8",
  };
  return <button className={cn(base, variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)} {...props} />;
};

const Input = ({ className, ...props }: any) => (
  <input className={cn("flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
);

const Label = ({ className, ...props }: any) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
);

const Checkbox = ({ className, ...props }: any) => (
  <input type="checkbox" className={cn("h-4 w-4 rounded border-gray-300 text-black focus:ring-black", className)} {...props} />
);

export const ConfigurationPanel = () => {
  const store = useCatalogStore();
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'data'>('content');
  const [productToDelete, setProductToDelete] = useState<{ pageId: string, sectionId: string, productId: string, productName: string } | null>(null);
  const [sectionToDelete, setSectionToDelete] = useState<{ pageId: string, sectionId: string, sectionTitle: string } | null>(null);

  const confirmProductDelete = () => {
    if (productToDelete) {
      store.removeProduct(productToDelete.pageId, productToDelete.sectionId, productToDelete.productId);
      setProductToDelete(null);
    }
  };

  const confirmSectionDelete = () => {
    if (sectionToDelete) {
      store.removeSection(sectionToDelete.pageId, sectionToDelete.sectionId);
      setSectionToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="font-semibold text-lg">Editor do Catálogo</h2>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('content')}
            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === 'content' ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
          >
            Conteúdo
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === 'settings' ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
          >
            Ajustes
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === 'data' ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
          >
            Dados
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'content' && (
          <div className="h-full flex flex-col">
            {/* Pages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {store.pages.map((page, pageIndex) => (
                <div key={page.id} className="space-y-4 mb-8">
                  <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                    <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                      Página {pageIndex + 1}
                    </h3>
                  </div>

                  {/* Sections */}
                  <div className="space-y-6">
                    {page.sections.map((section, sectionIndex) => (
                      <div key={section.id} className="relative border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">

                        {/* Header Section Editor */}
                        {section.type === 'header' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium">Título da Seção</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setSectionToDelete({
                                  pageId: page.id,
                                  sectionId: section.id,
                                  sectionTitle: section.title || 'Seção sem título'
                                })}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <Input
                              value={section.title}
                              onChange={(e: any) => store.updateSection(page.id, section.id, { title: e.target.value })}
                              placeholder="Ex: Promoções"
                            />
                          </div>
                        )}

                        {/* Product Grid Editor */}
                        {section.type === 'product-grid' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Layout className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium">Grade de Produtos</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={section.columns}
                                  onChange={(e) => store.updateSection(page.id, section.id, { columns: Number(e.target.value) as 2 | 3 | 4 })}
                                  className="text-xs border border-gray-200 rounded px-2 py-1"
                                >
                                  <option value={2}>2 Colunas</option>
                                  <option value={3}>3 Colunas</option>
                                  <option value={4}>4 Colunas</option>
                                </select>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setSectionToDelete({
                                    pageId: page.id,
                                    sectionId: section.id,
                                    sectionTitle: 'Grade de Produtos'
                                  })}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>

                            {/* Products List */}
                            <div className="space-y-3 pl-2 border-l-2 border-gray-100">
                              {section.products?.map((product) => (
                                <div key={product.id} className="bg-gray-50 rounded-md p-3 border border-gray-200 space-y-3">
                                  {/* Top Row: Image & Name */}
                                  <div className="flex gap-3">
                                    {/* Image Upload/Preview */}
                                    <div className="shrink-0">
                                      <div className="relative w-16 h-16 bg-white rounded border border-gray-300 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-gray-400 transition-colors">
                                        {product.image ? (
                                          <img src={product.image} className="w-full h-full object-contain" alt="Product" />
                                        ) : (
                                          <ImageIcon className="w-6 h-6 text-gray-300" />
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
                                                store.updateProduct(page.id, section.id, product.id, { image: reader.result as string });
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                      </div>
                                      <button
                                        className="text-[10px] text-blue-600 hover:underline w-full text-center mt-1"
                                        onClick={() => {
                                          const url = window.prompt("URL da imagem:", product.image || '');
                                          if (url !== null) store.updateProduct(page.id, section.id, product.id, { image: url });
                                        }}
                                      >
                                        Link URL
                                      </button>
                                    </div>

                                    {/* Name & Controls */}
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <Label className="text-xs text-gray-500 mb-1 block">Nome do Produto / Código</Label>
                                        <Input
                                          className="bg-white font-medium"
                                          placeholder="Ex: 1008 - Kit Ferramentas"
                                          value={product.name}
                                          onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { name: e.target.value })}
                                        />
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            checked={product.soldOut}
                                            onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { soldOut: e.target.checked })}
                                            id={`sold-${product.id}`}
                                          />
                                          <Label htmlFor={`sold-${product.id}`} className="text-xs cursor-pointer select-none">Esgotado</Label>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                          onClick={() => setProductToDelete({
                                            pageId: page.id,
                                            sectionId: section.id,
                                            productId: product.id,
                                            productName: product.name
                                          })}
                                        >
                                          <Trash2 className="w-3 h-3 mr-1" /> Remover
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Middle Row: Prices */}
                                  <div className="grid grid-cols-3 gap-3 bg-white p-2 rounded border border-gray-100">
                                    <div>
                                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider">Preço (Caixa)</Label>
                                      <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">R$</span>
                                        <Input
                                          className="pl-6 h-7 text-sm"
                                          type="number"
                                          step="0.01"
                                          value={product.price}
                                          onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { price: Number(e.target.value) })}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider">Pcs/Cx</Label>
                                      <Input
                                        className="h-7 text-sm text-center"
                                        type="number"
                                        min="1"
                                        value={product.piecesPerBox || 1}
                                        onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { piecesPerBox: Number(e.target.value) })}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-[10px] text-gray-500 uppercase tracking-wider">Unitário (Calc)</Label>
                                      <div className="h-7 flex items-center text-sm font-medium text-gray-700">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / (product.piecesPerBox || 1))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bottom Row: Specs */}
                                  <div>
                                    <Label className="text-xs text-gray-500 mb-1 block">Características (Marca, Modelo, etc) - Separe por vírgula</Label>
                                    <Input
                                      className="bg-white text-sm"
                                      placeholder="Ex: Marca X, Modelo Y, 220V"
                                      value={product.specs.join(', ')}
                                      onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { specs: e.target.value.split(',').map((s: string) => s.trim()) })}
                                    />
                                  </div>
                                </div>
                              ))}

                              <Button
                                variant="secondary"
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => store.addProduct(page.id, section.id, {
                                  id: `prod-${Date.now()}`,
                                  name: 'Novo Produto',
                                  price: 0,
                                  specs: ['Marca', 'Modelo'],
                                  soldOut: false,
                                  piecesPerBox: 1
                                })}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Adicionar Produto
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add Section Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => store.addSection(page.id, {
                          id: `sec-${Date.now()}`,
                          type: 'header',
                          title: 'NOVA SEÇÃO'
                        })}
                      >
                        <Type className="w-4 h-4 mr-2" /> Título
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => store.addSection(page.id, {
                          id: `sec-${Date.now()}`,
                          type: 'product-grid',
                          columns: 3,
                          products: []
                        })}
                      >
                        <Layout className="w-4 h-4 mr-2" /> Grade
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full" onClick={() => store.addPage()}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Nova Página
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4 space-y-6 overflow-y-auto h-full">
            {/* Global Settings Content */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Identidade Visual</h3>

              <div className="space-y-2">
                <Label>Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-10 h-9 p-1 cursor-pointer"
                    value={store.globalSettings.primaryColor}
                    onChange={(e: any) => store.setGlobalSettings({ primaryColor: e.target.value })}
                  />
                  <Input
                    value={store.globalSettings.primaryColor}
                    onChange={(e: any) => store.setGlobalSettings({ primaryColor: e.target.value })}
                    className="font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={store.globalSettings.logoUrl}
                  onChange={(e: any) => store.setGlobalSettings({ logoUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-900">Rodapé</h3>
              <div className="space-y-2">
                <Label>Texto do Rodapé</Label>
                <Input
                  value={store.globalSettings.footerText}
                  onChange={(e: any) => store.setGlobalSettings({ footerText: e.target.value })}
                  placeholder="Ex: www.minhaloja.com.br"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <DataPanel />
        )}
      </div>
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Remover Produto"
        footer={
          <>
            <UiButton variant="outline" onClick={() => setProductToDelete(null)}>
              Cancelar
            </UiButton>
            <UiButton variant="destructive" onClick={confirmProductDelete}>
              Remover
            </UiButton>
          </>
        }
      >
        <p>Deseja realmente remover o produto <strong>{productToDelete?.productName}</strong>?</p>
      </Modal>

      <Modal
        isOpen={!!sectionToDelete}
        onClose={() => setSectionToDelete(null)}
        title="Remover Seção"
        footer={
          <>
            <UiButton variant="outline" onClick={() => setSectionToDelete(null)}>
              Cancelar
            </UiButton>
            <UiButton variant="destructive" onClick={confirmSectionDelete}>
              Remover
            </UiButton>
          </>
        }
      >
        <p>Deseja realmente remover a seção <strong>{sectionToDelete?.sectionTitle}</strong>? Todos os itens dentro dela serão removidos.</p>
      </Modal>
    </div>
  );
};
