'use client';

import { cn } from '@/lib/utils';
import { useCatalogStore } from '@/store/catalogStore';
import { Section } from '@/types/catalog';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  } = useSortable({ 
    id: section.id,
    data: {
      type: 'section',
      section,
      pageId
    }
  });

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
      onClick={(e) => {
        e.stopPropagation();
        useCatalogStore.getState().selectItem('section', section.id);
      }}
    >
      {/* Interactive Controls (appear on hover) */}


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
