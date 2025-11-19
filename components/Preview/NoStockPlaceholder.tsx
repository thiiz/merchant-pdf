import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { PackageX } from 'lucide-react';
import React from 'react';

export const NoStockPlaceholder: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full bg-gray-50"
      style={{ color: DESIGN_TOKENS.colors.gray[400] }}
    >
      <PackageX
        size={32}
        className="mb-2 opacity-50"
        strokeWidth={1.5}
      />
      <span
        className="font-medium uppercase tracking-wider"
        style={{ fontSize: '10px' }}
      >
        Indisponível
      </span>
    </div>
  );
};
