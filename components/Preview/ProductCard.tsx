import { useCatalogStore } from '@/store/catalogStore';
import { Product } from '@/types/catalog';
import React from 'react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { globalSettings } = useCatalogStore();
  const { primaryColor } = globalSettings;

  return (
    <div className="relative flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200" style={{ borderBottom: `4px solid ${primaryColor}` }}>
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400 text-xs">Sem Imagem</div>
        )}

        {/* Badges */}
        {product.soldOut && (
          <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1 transform rotate-0 shadow-md z-10">
            ESGOTADO
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-sm text-gray-900 leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>

          {product.specs && product.specs.length > 0 && (
            <ul className="text-[10px] text-gray-600 space-y-0.5 mb-2">
              {product.specs.map((spec, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mr-1.5"></span>
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-[10px] text-gray-500">À vista</span>
          <span className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};
