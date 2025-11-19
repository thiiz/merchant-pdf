'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Section } from '@/types/catalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface InteractiveSectionProps {
  section: Section;
  pageId: string;
  children: React.ReactNode;
}

export const InteractiveSection: React.FC<InteractiveSectionProps> = ({
  section,
  pageId,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { removeSection } = useCatalogStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const confirmDelete = () => {
    removeSection(pageId, section.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group transition-all',
        isDragging && 'opacity-30 cursor-grabbing'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Controls (appear on hover) */}
      <div
        className={cn(
          'absolute -top-2 -right-2 z-50 print:hidden transition-all duration-200 flex gap-1 bg-white shadow-lg rounded-md border border-gray-200 p-1',
          isHovered || isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        )}
      >
        <button
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="Arrastar para reordenar"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-1.5 hover:bg-red-50 rounded transition-colors group/delete"
          title="Remover seção"
        >
          <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
        </button>
      </div>

      {/* Section Content */}
      <div className={cn(
        'transition-all duration-200',
        isHovered && 'ring-2 ring-blue-200 ring-offset-2 rounded-lg'
      )}>
        {children}
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
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </>
        }
      >
        <p>Deseja realmente remover esta seção? Todos os produtos dentro dela também serão removidos.</p>
      </Modal>
    </div >
  );
};
