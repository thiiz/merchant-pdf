'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
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
import { ChevronDown, ChevronRight, FileText, GripVertical, Layers, Layout, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface SortablePageItemProps {
  page: any;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (e: React.MouseEvent) => void;
  onSelect: () => void;
  onAddSection: () => void;
  onDelete: () => void;
  selectedId: string | null;
  handleSectionSelect: (id: string) => void;
  totalPages: number;
}

const SortablePageItem = ({ 
  page, 
  index, 
  isExpanded, 
  isSelected, 
  onToggle, 
  onSelect,
  onAddSection,
  onDelete,
  selectedId,
  handleSectionSelect,
  totalPages
}: SortablePageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('space-y-1', isDragging && 'opacity-50')}>
      {/* Page Item */}
      <div 
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors group",
          isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
        )}
      >
        <button 
          {...listeners}
          {...attributes}
          className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3 h-3" />
        </button>
        <button 
          onClick={onToggle}
          className="p-0.5 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
        >
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
        <FileText className="w-4 h-4 opacity-70" />
        <span 
          className="text-sm font-medium truncate flex-1 cursor-pointer"
          onClick={onSelect}
        >
          Página {index + 1}
        </span>
        {totalPages > 1 && (
          <button
            onClick={onDelete}
            className="p-0.5 hover:bg-red-50 rounded text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover página"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Sections List */}
      {isExpanded && (
        <div className="pl-6 space-y-0.5 border-l border-gray-100 ml-3">
          {page.sections.map((section: any) => (
            <div 
              key={section.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs",
                selectedId === section.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-600"
              )}
              onClick={() => handleSectionSelect(section.id)}
            >
              {section.type === 'header' ? <Layers className="w-3 h-3 opacity-70" /> : <Layout className="w-3 h-3 opacity-70" />}
              <span className="truncate flex-1">{section.title || (section.type === 'header' ? 'Título' : 'Grade de Produtos')}</span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export const StructurePanel = () => {
  const store = useCatalogStore();
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const togglePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const handleSelect = (type: 'page' | 'section', id: string) => {
    store.selectItem(type, id);
  };

  const handleDeleteClick = (pageId: string) => {
    if (store.pages.length > 1) {
      setDeletePageId(pageId);
    } else {
      setShowWarningModal(true);
    }
  };

  const confirmDelete = () => {
    if (deletePageId) {
      store.removePage(deletePageId);
      setDeletePageId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = store.pages.findIndex((p) => p.id === active.id);
    const newIndex = store.pages.findIndex((p) => p.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      store.reorderPages(oldIndex, newIndex);
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={store.pages.map(p => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {store.pages.map((page, index) => (
              <SortablePageItem
                key={page.id}
                page={page}
                index={index}
                isExpanded={!!expandedPages[page.id]}
                isSelected={store.selectedId === page.id}
                onToggle={(e) => togglePage(page.id, e)}
                onSelect={() => handleSelect('page', page.id)}
                onAddSection={() => store.addSection(page.id, {
                  id: `sec-${Date.now()}`,
                  type: 'header',
                  title: 'NOVA SEÇÃO'
                })}
                onDelete={() => handleDeleteClick(page.id)}
                selectedId={store.selectedId}
                handleSectionSelect={(id) => handleSelect('section', id)}
                totalPages={store.pages.length}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletePageId}
        onClose={() => setDeletePageId(null)}
        title="Remover Página"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletePageId(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </>
        }
      >
        <p>Deseja realmente remover a <strong>Página {store.pages.findIndex(p => p.id === deletePageId) + 1}</strong>? Esta ação não pode ser desfeita.</p>
      </Modal>

      {/* Warning Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        title="Ação não permitida"
        footer={
          <Button variant="primary" onClick={() => setShowWarningModal(false)}>
            Entendi
          </Button>
        }
      >
        <p>Não é possível remover a última página do catálogo.</p>
      </Modal>
    </div>
  );
};
