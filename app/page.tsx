'use client';

import { EditorLayout } from '@/components/layouts/EditorLayout';
import { PropertiesPanel } from '@/components/panels/PropertiesPanel';
import { StructurePanel } from '@/components/panels/StructurePanel';
import { PDFDownloadButton } from '@/components/PDF/PDFDownloadButton';
import { CoverPagePreview } from '@/components/Preview/CoverPagePreview';
import { InteractivePage } from '@/components/Preview/InteractivePage';
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
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { useEffect } from 'react';

export default function Home() {
  const { pages, reorderProducts, moveProduct, selectedId, selectedType } = useCatalogStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    // Handle Product Drag
    if (activeData.type === 'product') {
      const sourcePageId = activeData.pageId;
      const sourceSectionId = activeData.sectionId;
      
      // Dropping over another product
      if (overData.type === 'product') {
        const targetPageId = overData.pageId;
        const targetSectionId = overData.sectionId;
        
        if (sourcePageId === targetPageId && sourceSectionId === targetSectionId) {
          // Same section reorder
          const oldIndex = pages
            .find(p => p.id === sourcePageId)
            ?.sections.find(s => s.id === sourceSectionId)
            ?.products?.findIndex(p => p.id === active.id);
            
          const newIndex = pages
            .find(p => p.id === targetPageId)
            ?.sections.find(s => s.id === targetSectionId)
            ?.products?.findIndex(p => p.id === over.id);

          if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
            reorderProducts(sourcePageId, sourceSectionId, oldIndex, newIndex);
          }
        } else {
          // Move to different section/page
          const newIndex = pages
            .find(p => p.id === targetPageId)
            ?.sections.find(s => s.id === targetSectionId)
            ?.products?.findIndex(p => p.id === over.id);
            
          if (newIndex !== undefined) {
             moveProduct(sourcePageId, sourceSectionId, targetPageId, targetSectionId, active.id as string, newIndex);
          }
        }
      }
      
      // Dropping over a section (e.g. empty section or just the container)
      if (overData.type === 'section') {
         const targetPageId = overData.pageId;
         const targetSectionId = overData.section.id;
         
         // Check if we are dropping onto the SAME section but maybe just on the container
         if (sourcePageId === targetPageId && sourceSectionId === targetSectionId) {
            // If dropping on own section, maybe move to end? 
            // Or just do nothing if we assume dropping on self means "cancel" or "no change" unless over a specific product
            return;
         }

         const targetSection = pages.find(p => p.id === targetPageId)?.sections.find(s => s.id === targetSectionId);
         const newIndex = targetSection?.products?.length || 0;
         
         moveProduct(sourcePageId, sourceSectionId, targetPageId, targetSectionId, active.id as string, newIndex);
      }
    }
  };

  useEffect(() => {
    if (selectedType === 'page' && selectedId) {
      const element = document.getElementById(selectedId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedId, selectedType]);

  return (
    <EditorLayout
      leftPanel={<StructurePanel />}
      rightPanel={<PropertiesPanel />}
      centerPanel={
        <div className="h-full overflow-y-auto bg-gray-200/50 p-8 relative flex flex-col items-center">
            {/* Toolbar */}
            <div className="sticky top-4 z-20 mb-8 flex gap-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20 print:hidden">
              <PDFDownloadButton />
            </div>

            {/* A4 Pages Container */}
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <div className="flex flex-col gap-8 print:gap-0">
                {/* Cover Page */}
                {useCatalogStore(state => state.coverPage?.enabled) && (
                  <CoverPagePreview />
                )}

                {pages.map((page, index) => (
                  <InteractivePage key={page.id} page={page} index={index} />
                ))}
              </div>
            </DndContext>

            <div className="h-20 print:hidden"></div>
        </div>
      }
    />
  );
}
