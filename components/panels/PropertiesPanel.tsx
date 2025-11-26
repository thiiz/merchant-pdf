'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ImageIcon, Plus, Trash2, X } from 'lucide-react';

import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import { CatalogStateExport } from './data/CatalogStateExport';
import { CatalogStateImport } from './data/CatalogStateImport';
import { CSVExport } from './data/CSVExport';
import { CSVImport } from './data/CSVImport';

// --- Styled Components Helpers ---
const StyledInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input 
        className={cn(
            "w-full text-xs border border-gray-300 rounded-md px-3 py-2 transition-all",
            "focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
            "placeholder:text-gray-400",
            className
        )}
        {...props}
    />
);

const StyledLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <label className={cn("text-xs font-semibold text-gray-600 mb-1.5 block", className)}>
        {children}
    </label>
);

const SectionHeader = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3 mt-1">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">{title}</h4>
        {children}
    </div>
);

const GlobalSettingsForm = () => {
    const store = useCatalogStore();
    const [activeTab, setActiveTab] = useState<'settings' | 'data'>('settings');

    return (
        <div className="space-y-6">
            <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                    className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                        activeTab === 'settings' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab('settings')}
                >
                    Ajustes
                </button>
                <button
                    className={cn(
                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                        activeTab === 'data' ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => setActiveTab('data')}
                >
                    Dados
                </button>
            </div>

            {activeTab === 'settings' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                        <SectionHeader title="Identidade Visual" />
                        <div className="space-y-4">
                            <div>
                                <StyledLabel>Cor Primária</StyledLabel>
                                <div className="flex gap-2 items-center">
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200 shadow-sm shrink-0">
                                        <input 
                                            type="color" 
                                            value={store.globalSettings.primaryColor}
                                            onChange={(e) => store.setGlobalSettings({ primaryColor: e.target.value })}
                                            className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                    <StyledInput 
                                        type="text" 
                                        value={store.globalSettings.primaryColor}
                                        onChange={(e) => store.setGlobalSettings({ primaryColor: e.target.value })}
                                        className="font-mono uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="Capa">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">{store.coverPage?.enabled ? 'Ativada' : 'Desativada'}</span>
                                <input 
                                    type="checkbox" 
                                    checked={store.coverPage?.enabled || false}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            store.setCoverPage({ enabled: true });
                                        } else {
                                            store.removeCoverPage();
                                        }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </SectionHeader>
                        
                        {store.coverPage?.enabled && (
                            <div className="space-y-2">
                                <div className="flex flex-col items-center w-full gap-2">
                                    <div className="relative w-full aspect-210/297 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                                        {store.coverPage.imageUrl ? (
                                            <img src={store.coverPage.imageUrl} className="w-full h-full object-cover" alt="Capa" />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <ImageIcon className="w-8 h-8 mb-2" />
                                                <span className="text-xs font-medium">Clique para enviar imagem</span>
                                            </div>
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
                                                        store.setCoverPage({ imageUrl: reader.result as string });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {store.coverPage.imageUrl && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                        )}
                                    </div>
                                    
                                    {store.coverPage.imageUrl && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="w-full text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                            onClick={() => store.setCoverPage({ imageUrl: '' })}
                                        >
                                            <Trash2 className="w-3 h-3 mr-1.5" /> Remover Imagem
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                         <SectionHeader title="Rodapé" />
                         <div className="space-y-3">
                            <div>
                                <StyledLabel>Texto do Rodapé</StyledLabel>
                                <StyledInput 
                                    type="text" 
                                    value={store.globalSettings.footerText}
                                    onChange={(e) => store.setGlobalSettings({ footerText: e.target.value })}
                                    placeholder="Ex: www.minhaloja.com.br"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                         <SectionHeader title="Exibição" />
                         <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-100">
                                <label className="text-xs font-medium text-gray-700">Mostrar Peças por Caixa</label>
                                <input 
                                    type="checkbox" 
                                    checked={store.globalSettings.showPiecesPerBox ?? true}
                                    onChange={(e) => store.setGlobalSettings({ showPiecesPerBox: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-gray-800">Backup Completo</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                            Salve todo o seu catálogo (produtos, imagens, configurações) em um único arquivo.
                        </p>
                        <div className="space-y-3">
                          <CatalogStateExport />
                          <CatalogStateImport />
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-1 bg-green-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-gray-800">Produtos (CSV)</h3>
                        </div>
                         <p className="text-xs text-gray-500 mb-4">
                            Exporte ou importe apenas a lista de produtos para editar em planilhas.
                        </p>
                        <div className="space-y-3">
                            <CSVExport />
                            <CSVImport />
                        </div>
                      </div>
                </div>
            )}
        </div>
    );
};

const ProductForm = ({ productId }: { productId: string }) => {
    const store = useCatalogStore();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        basic: true,
        pricing: true,
        details: true,
        specs: false
    });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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

    if (!product) return <div className="p-8 text-center text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-300">Produto não encontrado.</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {product.image ? (
                        <img src={product.image} className="w-full h-full object-contain" alt="Product" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">{product.name || 'Sem nome'}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.sku || 'Sem SKU'}</p>
                    <div className="mt-2 flex gap-2">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded text-[10px] font-medium text-gray-600">
                            <input 
                                type="checkbox" 
                                id={`soldOut-${productId}`}
                                checked={product.soldOut}
                                onChange={(e) => store.updateProduct(pageId, sectionId, productId, { soldOut: e.target.checked })}
                                className="w-3 h-3 rounded border-gray-400 text-red-600 focus:ring-red-500"
                            />
                            <label htmlFor={`soldOut-${productId}`} className="cursor-pointer">Esgotado</label>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Basic Info */}
            <div className="space-y-4">
                <SectionHeader title="Informações Básicas" />
                <div className="space-y-3">
                    <div>
                        <StyledLabel>Nome do Produto</StyledLabel>
                        <StyledInput 
                            type="text" 
                            value={product.name}
                            onChange={(e) => store.updateProduct(pageId, sectionId, productId, { name: e.target.value })}
                            placeholder="Nome do produto"
                        />
                    </div>
                    <div>
                        <StyledLabel>SKU / Código</StyledLabel>
                        <StyledInput 
                            type="text" 
                            value={product.sku || ''}
                            onChange={(e) => store.updateProduct(pageId, sectionId, productId, { sku: e.target.value })}
                            placeholder="Ex: REF-001"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
                <SectionHeader title="Preços" />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <StyledLabel>Varejo</StyledLabel>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400 text-xs">R$</span>
                            <StyledInput 
                                type="number" 
                                step="0.01"
                                value={product.retailPrice}
                                onChange={(e) => store.updateProduct(pageId, sectionId, productId, { retailPrice: Number(e.target.value) })}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div>
                        <StyledLabel>Atacado</StyledLabel>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400 text-xs">R$</span>
                            <StyledInput 
                                type="number" 
                                step="0.01"
                                value={product.wholesalePrice}
                                onChange={(e) => store.updateProduct(pageId, sectionId, productId, { wholesalePrice: Number(e.target.value) })}
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <StyledLabel>Preço Drop</StyledLabel>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 text-xs">R$</span>
                        <StyledInput 
                            type="number" 
                            step="0.01"
                            value={product.dropPrice}
                            onChange={(e) => store.updateProduct(pageId, sectionId, productId, { dropPrice: Number(e.target.value) })}
                            className="pl-8"
                        />
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
                <SectionHeader title="Detalhes" />
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <StyledLabel>Peças / Caixa</StyledLabel>
                        <StyledInput 
                            type="number" 
                            value={product.piecesPerBox}
                            onChange={(e) => store.updateProduct(pageId, sectionId, productId, { piecesPerBox: Number(e.target.value) })}
                            min="1"
                        />
                    </div>
                </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
                <SectionHeader title="Imagem" />
                <div className="space-y-3">
                    <div className="flex flex-col items-center w-full gap-3">
                        <div className="relative w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center group cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                            {product.image ? (
                                <img src={product.image} className="w-full h-full object-contain" alt="Product" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-medium">Enviar Imagem</span>
                                </div>
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
                            {product.image && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            )}
                        </div>
                        
                        <div className="w-full">
                            <StyledLabel>Ou URL da imagem</StyledLabel>
                            <StyledInput
                                type="text"
                                placeholder="https://..."
                                value={product.image && product.image.startsWith('http') ? product.image : ''}
                                onChange={(e) => store.updateProduct(pageId, sectionId, productId, { image: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Specs Section */}
            <div className="space-y-2">
                <button 
                    className="flex items-center justify-between w-full pb-2 border-b border-gray-100 mt-1 group"
                    onClick={() => toggleSection('specs')}
                >
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Especificações</h4>
                    {openSections.specs ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </button>
                
                {openSections.specs && (
                    <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {product.specs && product.specs.length > 0 && (
                            <div className="space-y-2">
                                {product.specs.map((spec: string, specIndex: number) => (
                                    <div key={specIndex} className="flex gap-2">
                                        <StyledInput
                                            className="flex-1"
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
                                            size="icon"
                                            className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                const newSpecs = product.specs?.filter((_: any, i: number) => i !== specIndex);
                                                store.updateProduct(pageId, sectionId, productId, { specs: newSpecs });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs border-dashed border-gray-300 text-gray-500 hover:text-blue-600 hover:border-blue-300"
                            onClick={() => {
                                const newSpecs = [...(product.specs || []), ''];
                                store.updateProduct(pageId, sectionId, productId, { specs: newSpecs });
                            }}
                        >
                            <Plus className="w-3 h-3 mr-1" /> Adicionar Especificação
                        </Button>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-gray-100">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Remover Produto
                </Button>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remover Produto"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                store.removeProduct(pageId, sectionId, productId);
                                store.selectItem(null, null);
                                setShowDeleteModal(false);
                            }}
                        >
                            Remover
                        </Button>
                    </>
                }
            >
                <p>Tem certeza que deseja remover este produto?</p>
            </Modal>
        </div>
    );
};

interface SortableProductItemProps {
    product: any;
    index: number;
    pageId: string;
    sectionId: string;
    totalProducts: number;
}

const SortableProductItem = ({ product, index, pageId, sectionId, totalProducts }: SortableProductItemProps) => {
    const store = useCatalogStore();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <>
            <div 
                ref={setNodeRef} 
                style={style} 
                className={cn(
                    'flex items-center gap-3 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm group hover:border-blue-300 transition-all',
                    isDragging && 'opacity-50 shadow-lg scale-105 z-10'
                )}
            >
                <button
                    {...listeners}
                    {...attributes}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="5" r="1"/>
                        <circle cx="9" cy="12" r="1"/>
                        <circle cx="9" cy="19" r="1"/>
                        <circle cx="15" cy="5" r="1"/>
                        <circle cx="15" cy="12" r="1"/>
                        <circle cx="15" cy="19" r="1"/>
                    </svg>
                </button>
                <div className="w-10 h-10 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {product.image ? (
                        <img src={product.image} className="w-full h-full object-contain" alt="" />
                    ) : (
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{product.name || 'Sem nome'}</p>
                    <p className="text-[10px] text-gray-400 truncate">{product.sku || 'Sem SKU'}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col mr-1">
                        <button
                            className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                store.reorderProducts(pageId, sectionId, index, index - 1);
                            }}
                        >
                            <ArrowUp className="w-3 h-3 text-gray-500" />
                        </button>
                        <button
                            className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                            disabled={index === totalProducts - 1}
                            onClick={(e) => {
                                e.stopPropagation();
                                store.reorderProducts(pageId, sectionId, index, index + 1);
                            }}
                        >
                            <ArrowDown className="w-3 h-3 text-gray-500" />
                        </button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => store.selectItem('product', product.id)}
                        title="Editar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                        </svg>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setShowDeleteModal(true)}
                        title="Remover"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remover Produto"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                store.removeProduct(pageId, sectionId, product.id);
                                setShowDeleteModal(false);
                            }}
                        >
                            Remover
                        </Button>
                    </>
                }
            >
                <p>Tem certeza que deseja remover este produto?</p>
            </Modal>
        </>
    );
};

const SectionForm = ({ sectionId }: { sectionId: string }) => {
     const store = useCatalogStore();
     const [showDeleteModal, setShowDeleteModal] = useState(false);
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over || active.id === over.id) return;

        const oldIndex = section.products?.findIndex((p: any) => p.id === active.id);
        const newIndex = section.products?.findIndex((p: any) => p.id === over.id);

        if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== -1 && newIndex !== -1) {
            store.reorderProducts(pageId, sectionId, oldIndex, newIndex);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-sm text-gray-900">Editar Seção</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {section.type === 'header' ? 'Cabeçalho' : 'Grade'}
                </span>
            </div>
            
            {section.type === 'header' && (
                <div className="space-y-3">
                    <StyledLabel>Título da Seção</StyledLabel>
                    <StyledInput 
                        type="text" 
                        value={section.title || ''}
                        onChange={(e) => store.updateSection(pageId, sectionId, { title: e.target.value })}
                        placeholder="Ex: LANÇAMENTOS"
                    />
                </div>
            )}

            {section.type === 'product-grid' && (
                 <div className="space-y-3">
                    <StyledLabel>Layout da Grade</StyledLabel>
                    <select 
                        value={section.columns}
                        onChange={(e) => store.updateSection(pageId, sectionId, { columns: Number(e.target.value) as any })}
                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                        <option value={2}>2 Colunas (Imagens Grandes)</option>
                        <option value={3}>3 Colunas (Padrão)</option>
                        <option value={4}>4 Colunas (Compacto)</option>
                    </select>
                </div>
            )}

            {section.type === 'product-grid' && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Produtos</span>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">
                                {section.products?.length || 0}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600"
                            onClick={() => {
                                store.addProduct(pageId, sectionId, {
                                    id: `prod-${Date.now()}`,
                                    name: 'Novo Produto',
                                    retailPrice: 0,
                                    wholesalePrice: 0,
                                    dropPrice: 0,
                                    soldOut: false,
                                    piecesPerBox: 1,
                                });
                            }}
                        >
                            <Plus className="w-3 h-3 mr-1" /> Adicionar
                        </Button>
                    </div>

                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter} 
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={section.products?.map((p: any) => p.id) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                                {section.products?.map((product: any, index: number) => (
                                    <SortableProductItem 
                                        key={product.id} 
                                        product={product} 
                                        index={index} 
                                        pageId={pageId} 
                                        sectionId={sectionId}
                                        totalProducts={section.products?.length || 0}
                                    />
                                ))}
                                
                                {(!section.products || section.products.length === 0) && (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p className="text-gray-400 text-xs italic mb-2">Nenhum produto nesta seção</p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700"
                                            onClick={() => {
                                                store.addProduct(pageId, sectionId, {
                                                    id: `prod-${Date.now()}`,
                                                    name: 'Novo Produto',
                                                    retailPrice: 0,
                                                    wholesalePrice: 0,
                                                    dropPrice: 0,
                                                    soldOut: false,
                                                    piecesPerBox: 1,
                                                });
                                            }}
                                        >
                                            Adicionar o primeiro produto
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}

            <div className="pt-6 border-t border-gray-100 mt-4">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Remover Seção
                </Button>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remover Seção"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                store.removeSection(pageId, sectionId);
                                store.selectItem(null, null);
                                setShowDeleteModal(false);
                            }}
                        >
                            Remover
                        </Button>
                    </>
                }
            >
                <p>Tem certeza que deseja remover esta seção? Todos os produtos nela serão perdidos.</p>
            </Modal>

        </div>
    );
}

const PageForm = ({ pageId }: { pageId: string }) => {
     const store = useCatalogStore();
     const [showDeleteModal, setShowDeleteModal] = useState(false);
     const pageIndex = store.pages.findIndex(p => p.id === pageId);

     if (pageIndex === -1) return <div className="p-4 text-gray-500 text-sm">Página não encontrada.</div>;

     return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-sm text-gray-900">Editar Página {pageIndex + 1}</h3>
            </div>
            
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <h4 className="text-xs font-bold text-blue-800 mb-2">Estrutura da Página</h4>
                    <p className="text-xs text-blue-600 mb-4">
                        Adicione seções para organizar seus produtos. Você pode ter cabeçalhos e grades de produtos.
                    </p>
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        onClick={() => {
                            store.addSection(pageId, {
                                id: `sec-${Date.now()}`,
                                type: 'header',
                                title: 'NOVO TÍTULO'
                            });
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Cabeçalho
                    </Button>
                </div>
            </div>

             <div className="pt-6 border-t border-gray-100">
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="w-full bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Remover Página
                </Button>
            </div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Remover Página"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                            Cancelar
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={() => {
                                store.removePage(pageId);
                                store.selectItem(null, null);
                                setShowDeleteModal(false);
                            }}
                        >
                            Remover
                        </Button>
                    </>
                }
            >
                <p>Tem certeza que deseja remover esta página? Todo o conteúdo dela será perdido.</p>
            </Modal>
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
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl shadow-gray-200/50">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
        <h2 className="font-bold text-sm text-gray-800 tracking-tight">
            {store.selectedType === 'product' && 'Editar Produto'}
            {store.selectedType === 'section' && 'Editar Seção'}
            {store.selectedType === 'page' && 'Editar Página'}
            {!store.selectedType && 'Configurações'}
        </h2>
        {store.selectedType && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 hover:bg-gray-100 rounded-full" 
                onClick={() => store.selectItem(null, null)}
                title="Fechar"
            >
                <X className="w-4 h-4 text-gray-500" />
            </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {renderContent()}
      </div>
    </div>
  );
};
