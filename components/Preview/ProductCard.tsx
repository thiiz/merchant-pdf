import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { useCatalogStore } from '@/store/catalogStore';
import { Product } from '@/types/catalog';
import React from 'react';
import { NoStockPlaceholder } from './NoStockPlaceholder';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { globalSettings } = useCatalogStore();
  const { primaryColor } = globalSettings;

  return (
    <div
      className="relative flex flex-col h-full bg-gray-100 overflow-hidden shadow-sm"
      style={{
        borderRadius: `${DESIGN_TOKENS.components.productCard.borderRadius.px}px`,
        border: `${DESIGN_TOKENS.components.productCard.border.px}px solid ${DESIGN_TOKENS.colors.gray[200]}`,
        borderBottom: `${DESIGN_TOKENS.components.productCard.borderBottom.px}px solid ${primaryColor}`
      }}
    >
      {/* Image Area */}
      <div
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          backgroundColor: DESIGN_TOKENS.colors.white,
          height: `${DESIGN_TOKENS.components.productCard.image.height.px}px`
        }}
      >
        {product.soldOut ? (
          <NoStockPlaceholder />
        ) : product.image ? (
          <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
        ) : (
          <div
            className="text-gray-600"
            style={{ fontSize: `${DESIGN_TOKENS.components.productCard.spec.fontSize.px}px` }}
          >
            Sem Imagem
          </div>
        )}

        {/* Badges */}
        {product.soldOut && (
          <div
            className="absolute bg-black text-white font-bold shadow-md z-10"
            style={{
              top: `${DESIGN_TOKENS.components.productCard.soldOutBadge.top.px}px`,
              right: `${DESIGN_TOKENS.components.productCard.soldOutBadge.right.px}px`,
              fontSize: `${DESIGN_TOKENS.components.productCard.soldOutBadge.fontSize.px}px`,
              padding: `${DESIGN_TOKENS.components.productCard.soldOutBadge.paddingY.px}px ${DESIGN_TOKENS.components.productCard.soldOutBadge.paddingX.px}px`
            }}
          >
            ESGOTADO
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex flex-col flex-grow justify-between"
        style={{ padding: `${DESIGN_TOKENS.components.productCard.padding.px}px` }}
      >
        <div>
          <h3
            className="font-bold text-gray-900 leading-tight line-clamp-2"
            style={{
              fontSize: `${DESIGN_TOKENS.components.productCard.name.fontSize.px}px`,
              marginBottom: `${DESIGN_TOKENS.components.productCard.name.marginBottom.px}px`
            }}
          >
            {product.name}
          </h3>
          {product.sku && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
              SKU: {product.sku}
            </p>
          )}
        </div>

        <div
          className="flex flex-col gap-2"
          style={{
            borderTop: `${DESIGN_TOKENS.components.productCard.price.borderTop.px}px solid ${DESIGN_TOKENS.colors.gray[200]}`,
            paddingTop: `${DESIGN_TOKENS.components.productCard.price.paddingTop.px}px`,
            marginTop: `${DESIGN_TOKENS.components.productCard.price.marginTop.px}px`
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 text-[10px] font-medium uppercase tracking-wider">
              PCS/CX: {product.piecesPerBox || 1}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {/* Varejo */}
            {product.retailPrice > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Varejo</span>
                <span className="font-medium text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.retailPrice)}
                </span>
              </div>
            )}

            {/* Drop */}
            {product.dropPrice > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Drop</span>
                <span className="font-medium text-gray-700">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.dropPrice)}
                </span>
              </div>
            )}

            {/* Atacado - Destaque */}
            {product.wholesalePrice > 0 && (
              <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded mt-1">
                <span className="text-xs font-bold text-gray-900">Atacado</span>
                <span className="font-bold text-gray-900 text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.wholesalePrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
