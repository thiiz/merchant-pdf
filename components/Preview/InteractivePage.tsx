
'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Page } from '@/types/catalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { A4Page } from './A4Page';

interface InteractivePageProps {
  page: Page;
  index: number;
}

export const InteractivePage: React.FC<InteractivePageProps> = ({ page, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const { removePage, pages } = useCatalogStore();

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

  const handleDeleteClick = () => {
    if (pages.length > 1) {
      setShowDeleteModal(true);
    } else {
      setShowWarningModal(true);
    }
  };

  const confirmDelete = () => {
    removePage(page.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group print:break-after-page transition-opacity',
        isDragging && 'opacity-50 cursor-grabbing'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Interactive Controls (Hidden on Print) */}
      <div
        className={cn(
          'absolute -top-12 left-0 right-0 z-30 print:hidden transition-all duration-200',
          isHovered || isDragging ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div className="w-[210mm] mx-auto bg-white/95 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200 px-4 py-2 flex items-center justify-between">
          {/* Left: Drag Handle + Page Number */}
          <div className="flex items-center gap-3">
            <button
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Arrastar para reordenar"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </button>
            <span className="font-semibold text-sm text-gray-700">
              Página {index + 1}
            </span>
          </div>

          {/* Right: Delete Button */}
          {pages.length > 1 && (
            <button
              onClick={handleDeleteClick}
              className="p-2 hover:bg-red-50 rounded-md transition-colors group/delete"
              title="Remover página"
            >
              <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
            </button>
          )}
        </div>
      </div>

      <A4Page page={page} />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remover Página"
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
        <p>Deseja realmente remover a <strong>Página {index + 1}</strong>? Esta ação não pode ser desfeita.</p>
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
