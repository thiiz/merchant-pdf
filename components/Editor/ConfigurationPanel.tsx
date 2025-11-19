'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { AlertCircle, Image as ImageIcon, Layout, MoveDown, MoveUp, Plus, Trash2, Type } from 'lucide-react';
import { useState } from 'react';

// Simple UI Components (since we don't have full shadcn setup yet, implementing basics)
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


import { CSVImport } from './CSVImport';

export const ConfigurationPanel = () => {
  const store = useCatalogStore();
  const [activeTab, setActiveTab] = useState<'content' | 'settings' | 'import'>('content');

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
            onClick={() => setActiveTab('import')}
            className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", activeTab === 'import' ? "bg-white shadow text-black" : "text-gray-500 hover:text-gray-900")}
          >
            Importar
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cabeçalho</h3>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={store.globalSettings.showHeader}
                  onChange={(e: any) => store.setGlobalSettings({ showHeader: e.target.checked })}
                  id="show-header"
                />
                <Label htmlFor="show-header">Mostrar Cabeçalho</Label>
              </div>

              {store.globalSettings.showHeader && (
                <div className="space-y-4 pl-4 border-l-2 border-gray-100 ml-1">
                  <div className="grid gap-2">
                    <Label>Título Principal</Label>
                    <Input
                      value={store.globalSettings.companyName}
                      onChange={(e: any) => store.setGlobalSettings({ companyName: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Subtítulo 1</Label>
                    <Input
                      value={store.globalSettings.headerTitle}
                      onChange={(e: any) => store.setGlobalSettings({ headerTitle: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Subtítulo 2</Label>
                    <Input
                      value={store.globalSettings.headerSubtitle}
                      onChange={(e: any) => store.setGlobalSettings({ headerSubtitle: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={store.globalSettings.showDate}
                      onChange={(e: any) => store.setGlobalSettings({ showDate: e.target.checked })}
                      id="show-date"
                    />
                    <Label htmlFor="show-date">Mostrar Data</Label>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Identidade Visual</h3>



              <div className="grid gap-2">
                <Label>Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    className="w-12 p-1 h-9"
                    value={store.globalSettings.primaryColor}
                    onChange={(e: any) => store.setGlobalSettings({ primaryColor: e.target.value })}
                  />
                  <Input
                    value={store.globalSettings.primaryColor}
                    onChange={(e: any) => store.setGlobalSettings({ primaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>URL do Logo</Label>
                <Input
                  placeholder="https://..."
                  value={store.globalSettings.logoUrl}
                  onChange={(e: any) => store.setGlobalSettings({ logoUrl: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Texto do Rodapé</Label>
                <Input
                  value={store.globalSettings.footerText}
                  onChange={(e: any) => store.setGlobalSettings({ footerText: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {store.pages.map((page, pageIndex) => (
              <div key={page.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    Página {pageIndex + 1}
                  </h3>
                  <Button variant="destructive" size="sm" onClick={() => store.removePage(page.id)} disabled={store.pages.length === 1}>
                    <Trash2 className="w-3 h-3 mr-1" /> Remover Página
                  </Button>
                </div>

                <div className="space-y-4 pl-2 border-l-2 border-gray-100 ml-2">
                  {page.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm group hover:border-gray-300 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-500 text-[10px] font-mono px-1.5 py-0.5 rounded uppercase">
                            {section.type}
                          </span>
                          <div className="flex gap-1">
                            <button onClick={() => store.reorderSection(page.id, section.id, 'up')} className="text-gray-400 hover:text-gray-900"><MoveUp className="w-3 h-3" /></button>
                            <button onClick={() => store.reorderSection(page.id, section.id, 'down')} className="text-gray-400 hover:text-gray-900"><MoveDown className="w-3 h-3" /></button>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => store.removeSection(page.id, section.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {section.type === 'header' && (
                        <div className="grid gap-2">
                          <Label>Título da Seção</Label>
                          <Input
                            value={section.title}
                            onChange={(e: any) => store.updateSection(page.id, section.id, { title: e.target.value })}
                          />
                        </div>
                      )}

                      {section.type === 'product-grid' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Colunas</Label>
                            <div className="flex bg-gray-100 rounded p-0.5">
                              {[2, 3, 4].map((cols) => (
                                <button
                                  key={cols}
                                  onClick={() => store.updateSection(page.id, section.id, { columns: cols as any })}
                                  className={cn(
                                    "px-2 py-0.5 text-xs rounded transition-all",
                                    section.columns === cols ? "bg-white shadow text-black font-bold" : "text-gray-500 hover:text-gray-900"
                                  )}
                                >
                                  {cols}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Produtos ({section.products?.length || 0})</Label>
                            <div className="grid gap-2">
                              {section.products?.map((product) => (
                                <div key={product.id} className="flex items-start gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                                  {/* Image Control */}
                                  <div className="flex flex-col gap-1 items-center">
                                    <div className="relative w-10 h-10 bg-gray-200 rounded border border-gray-300 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-gray-400 transition-colors">
                                      {product.image ? (
                                        <img src={product.image} className="w-full h-full object-cover" alt="Product" />
                                      ) : (
                                        <ImageIcon className="w-4 h-4 text-gray-400" />
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
                                    </div>
                                    <button
                                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                                      onClick={() => {
                                        const url = window.prompt("URL da imagem:", product.image || '');
                                        if (url !== null) store.updateProduct(page.id, section.id, product.id, { image: url });
                                      }}
                                    >
                                      Link
                                    </button>
                                  </div>

                                  <div className="flex-1 grid gap-1">
                                    <Input
                                      className="h-7 text-xs bg-white"
                                      placeholder="Nome"
                                      value={product.name}
                                      onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { name: e.target.value })}
                                    />
                                    <div className="flex gap-1">
                                      <Input
                                        className="h-7 text-xs bg-white w-20"
                                        placeholder="Preço"
                                        type="number"
                                        value={product.price}
                                        onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { price: Number(e.target.value) })}
                                      />
                                      <Input
                                        className="h-7 text-xs bg-white w-16"
                                        placeholder="Pcs/Cx"
                                        type="number"
                                        value={product.piecesPerBox || 1}
                                        onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { piecesPerBox: Number(e.target.value) })}
                                      />
                                      <Input
                                        className="h-7 text-xs bg-white flex-1"
                                        placeholder="Specs (sep. por vírgula)"
                                        value={product.specs.join(', ')}
                                        onChange={(e: any) => store.updateProduct(page.id, section.id, product.id, { specs: e.target.value.split(',').map((s: string) => s.trim()) })}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <button
                                      onClick={() => store.updateProduct(page.id, section.id, product.id, { soldOut: !product.soldOut })}
                                      className={cn("p-1 rounded", product.soldOut ? "bg-red-100 text-red-600" : "bg-gray-200 text-gray-400")}
                                      title="Esgotado"
                                    >
                                      <AlertCircle className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => store.removeProduct(page.id, section.id, product.id)}
                                      className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() => store.addProduct(page.id, section.id, {
                                  id: `prod-${Date.now()}`,
                                  name: 'Novo Produto',
                                  price: 0,
                                  specs: [],
                                  soldOut: false,
                                  piecesPerBox: 1
                                })}
                              >
                                <Plus className="w-3 h-3 mr-1" /> Adicionar Produto
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => store.addSection(page.id, { id: `sec-${Date.now()}`, type: 'header', title: 'NOVA SEÇÃO' })}>
                      <Type className="w-3 h-3 mr-1" /> Add Título
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => store.addSection(page.id, { id: `sec-${Date.now()}`, type: 'product-grid', columns: 3, products: [] })}>
                      <Layout className="w-3 h-3 mr-1" /> Add Grid
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <Button className="w-full" onClick={store.addPage}>
                <Plus className="w-4 h-4 mr-2" /> Adicionar Nova Página
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'import' && (
          <CSVImport />
        )}
      </div>
    </div>
  );
};
