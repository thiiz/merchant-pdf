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
      className="relative flex flex-col h-full bg-white overflow-hidden shadow-sm"
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
          backgroundColor: DESIGN_TOKENS.colors.gray[100],
          height: `${DESIGN_TOKENS.components.productCard.image.height.px}px`
        }}
      >
        {product.soldOut ? (
          <NoStockPlaceholder />
        ) : product.image ? (
          <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
        ) : (
          <div
            className="text-gray-400"
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

          {product.specs && product.specs.length > 0 && (
            <ul
              className="text-gray-600"
              style={{
                fontSize: `${DESIGN_TOKENS.components.productCard.spec.fontSize.px}px`,
                marginBottom: `${DESIGN_TOKENS.components.productCard.price.marginTop.px}px`
              }}
            >
              {product.specs.map((spec, idx) => (
                <li
                  key={idx}
                  className="flex items-center"
                  style={{ marginBottom: `${DESIGN_TOKENS.components.productCard.spec.marginBottom.px}px` }}
                >
                  <span
                    className="bg-gray-400 rounded-full"
                    style={{
                      width: `${DESIGN_TOKENS.components.productCard.spec.dot.size.px}px`,
                      height: `${DESIGN_TOKENS.components.productCard.spec.dot.size.px}px`,
                      marginRight: `${DESIGN_TOKENS.components.productCard.spec.dot.marginRight.px}px`
                    }}
                  ></span>
                  {spec}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="flex flex-col"
          style={{
            borderTop: `${DESIGN_TOKENS.components.productCard.price.borderTop.px}px solid ${DESIGN_TOKENS.colors.gray[100]}`,
            paddingTop: `${DESIGN_TOKENS.components.productCard.price.paddingTop.px}px`,
            marginTop: `${DESIGN_TOKENS.components.productCard.price.marginTop.px}px`
          }}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-400 text-[10px] font-medium">
              PCS/CX: {product.piecesPerBox || 1}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span
              className="text-gray-500"
              style={{ fontSize: `${DESIGN_TOKENS.components.productCard.price.label.fontSize.px}px` }}
            >
              Unidade
            </span>
            <span
              className="font-bold text-gray-900"
              style={{ fontSize: `${DESIGN_TOKENS.components.productCard.price.value.fontSize.px}px` }}
            >
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / (product.piecesPerBox || 1))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
