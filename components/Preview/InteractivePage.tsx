
'use client';

import { useCatalogStore } from '@/store/catalogStore';
import { Page } from '@/types/catalog';
import React from 'react';
import { A4Page } from './A4Page';

interface InteractivePageProps {
  page: Page;
  index: number;
}

export const InteractivePage: React.FC<InteractivePageProps> = ({ page, index }) => {
  return (
    <div 
      id={page.id} 
      className="relative print:break-after-page"
      onClick={(e) => {
        e.stopPropagation();
        useCatalogStore.getState().selectItem('page', page.id);
      }}
    >
      <A4Page page={page} />
    </div>
  );
};
