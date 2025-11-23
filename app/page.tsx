'use client';

import { EditorLayout } from '@/components/layouts/EditorLayout';
import { PropertiesPanel } from '@/components/panels/PropertiesPanel';
import { StructurePanel } from '@/components/panels/StructurePanel';
import { PDFDownloadButton } from '@/components/PDF/PDFDownloadButton';
import { PageOverlay, SectionOverlay } from '@/components/Preview/DragOverlays';
import { InteractivePage } from '@/components/Preview/InteractivePage';
import { ProductCard } from '@/components/Preview/ProductCard';
import { useCatalogStore } from '@/store/catalogStore';
import {
    closestCenter,
    defaultDropAnimationSideEffects,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    DropAnimation,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export default function Home() {
  const { pages, reorderPages, reorderSection, reorderProducts, moveProduct } = useCatalogStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<any>(null);
  const [activeType, setActiveType] = useState<'page' | 'section' | 'product' | null>(null);

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

  const findProductLocation = (productId: string) => {
    for (const page of pages) {
      for (const section of page.sections) {
        if (section.products?.some(p => p.id === productId)) {
          return { pageId: page.id, sectionId: section.id, index: section.products.findIndex(p => p.id === productId) };
        }
      }
    }
    return null;
  };

  const findSectionLocation = (sectionId: string) => {
    for (const page of pages) {
      const index = page.sections.findIndex(s => s.id === sectionId);
      if (index !== -1) {
        return { pageId: page.id, index };
      }
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = active.id.toString();
    setActiveId(id);

    if (id.startsWith('page-')) {
      setActiveType('page');
      setActiveItem(pages.find(p => p.id === id));
    } else if (id.startsWith('section-')) {
      setActiveType('section');
      for (const page of pages) {
        const section = page.sections.find(s => s.id === id);
        if (section) {
          setActiveItem(section);
          break;
        }
      }
    } else if (id.startsWith('prod-')) {
      setActiveType('product');
      for (const page of pages) {
        for (const section of page.sections) {
          const product = section.products?.find(p => p.id === id);
          if (product) {
            setActiveItem(product);
            break;
          }
        }
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Only handle product movement between sections here
    if (activeId.startsWith('prod-')) {
      const activeLoc = findProductLocation(activeId);
      const overLoc = findProductLocation(overId);

      // If dragging over another product
      if (activeLoc && overLoc) {
        if (activeLoc.sectionId !== overLoc.sectionId || activeLoc.pageId !== overLoc.pageId) {
          moveProduct(
            activeLoc.pageId,
            activeLoc.sectionId,
            overLoc.pageId,
            overLoc.sectionId,
            activeId,
            overLoc.index
          );
        }
      }
      // If dragging over a section (empty or not)
      else if (activeLoc && overId.startsWith('section-')) {
        const sectionLoc = findSectionLocation(overId);
        if (sectionLoc) {
          if (activeLoc.sectionId !== overId) {
            moveProduct(
              activeLoc.pageId,
              activeLoc.sectionId,
              sectionLoc.pageId,
              overId,
              activeId,
              0
            );
          }
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveItem(null);
    setActiveType(null);

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    // Handle Page Reorder
    if (activeId.startsWith('page-') && overId.startsWith('page-')) {
      const oldIndex = pages.findIndex((p) => p.id === activeId);
      const newIndex = pages.findIndex((p) => p.id === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderPages(oldIndex, newIndex);
      }
    }

    // Handle Section Reorder
    else if (activeId.startsWith('section-') && overId.startsWith('section-')) {
      const activeLoc = findSectionLocation(activeId);
      const overLoc = findSectionLocation(overId);

      if (activeLoc && overLoc && activeLoc.pageId === overLoc.pageId) {
        const direction = overLoc.index > activeLoc.index ? 'down' : 'up';
        const steps = Math.abs(overLoc.index - activeLoc.index);
        for (let i = 0; i < steps; i++) {
          reorderSection(activeLoc.pageId, activeId, direction);
        }
      }
    }

    // Handle Product Reorder (within same section)
    else if (activeId.startsWith('prod-') && overId.startsWith('prod-')) {
      const activeLoc = findProductLocation(activeId);
      const overLoc = findProductLocation(overId);

      if (activeLoc && overLoc && activeLoc.sectionId === overLoc.sectionId) {
        reorderProducts(activeLoc.pageId, activeLoc.sectionId, activeLoc.index, overLoc.index);
      }
    }
  };

  return (
    <EditorLayout
      leftPanel={<StructurePanel />}
      rightPanel={<PropertiesPanel />}
      centerPanel={
        <div className="h-full overflow-y-auto bg-gray-200/50 p-8 relative flex flex-col items-center" onClick={() => setActiveId(null)}>
            {/* Toolbar */}
            <div className="sticky top-4 z-20 mb-8 flex gap-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/20 print:hidden">
              <PDFDownloadButton />
            </div>

            {/* A4 Pages Container with Drag and Drop */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={pages.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-8 print:gap-0">
                  {pages.map((page, index) => (
                    <InteractivePage key={page.id} page={page} index={index} />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay dropAnimation={dropAnimation}>
                {activeType === 'page' && activeItem && (
                  <PageOverlay page={activeItem} index={pages.findIndex(p => p.id === activeItem.id)} />
                )}
                {activeType === 'section' && activeItem && (
                  <SectionOverlay section={activeItem} />
                )}
                {activeType === 'product' && activeItem && (
                  <div className="w-[200px] h-[300px] cursor-grabbing">
                    <ProductCard product={activeItem} />
                  </div>
                )}
              </DragOverlay>
            </DndContext>

            <div className="h-20 print:hidden"></div>
        </div>
      }
    />
  );
}
