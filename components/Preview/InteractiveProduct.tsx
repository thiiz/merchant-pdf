'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Product } from '@/types/catalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProductCard } from './ProductCard';

interface InteractiveProductProps {
  product: Product;
  pageId: string;
  sectionId: string;
}

export const InteractiveProduct: React.FC<InteractiveProductProps> = ({
  product,
  pageId,
  sectionId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { removeProduct } = useCatalogStore();

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

  const confirmDelete = () => {
    removeProduct(pageId, sectionId, product.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative h-full transition-all',
        isDragging && 'opacity-30'
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
          title="Remover produto"
        >
          <Trash2 className="w-4 h-4 text-red-500 group-hover/delete:text-red-600" />
        </button>
      </div>

      {/* Product Card with hover ring */}
      <div className={cn(
        'h-full transition-all duration-200',
        isHovered && 'ring-2 ring-blue-300 ring-offset-2 rounded-lg'
      )}>
        <ProductCard product={product} pageId={pageId} sectionId={sectionId} />
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
            <Button variant="destructive" onClick={confirmDelete}>
              Remover
            </Button>
          </>
        }
      >
        <p>Deseja realmente remover o produto <strong>{product.name}</strong>?</p>
      </Modal>
    </div >
  );
};
