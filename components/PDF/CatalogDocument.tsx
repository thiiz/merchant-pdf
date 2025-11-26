import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { darkenColor } from '@/lib/utils';
import { CatalogState } from '@/types/catalog';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { PDFNoStockPlaceholder } from './PDFNoStockPlaceholder';

// Register Inter font from local files
Font.register({
  family: 'Inter',
  fonts: [
    { src: '/inter/Inter_18pt-Regular.ttf' },
    { src: '/inter/Inter_18pt-Bold.ttf', fontWeight: 'bold' },
    { src: '/inter/Inter_18pt-Black.ttf', fontWeight: 'heavy' }
  ]
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: DESIGN_TOKENS.colors.white,
    padding: 0,
    fontFamily: 'Inter',
  },
  headerDecoration: {
    width: '100%',
    height: DESIGN_TOKENS.components.header.decoration.height.pt,
  },
  contentContainer: {
    // Padding removed to allow full-width sections
    flexGrow: 1,
    gap: DESIGN_TOKENS.components.header.contentGap.pt,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: DESIGN_TOKENS.components.header.borderBottom.pt,
    paddingBottom: DESIGN_TOKENS.components.header.paddingBottom.pt,
    marginBottom: DESIGN_TOKENS.components.header.marginBottom.pt,
  },
  logo: {
    height: DESIGN_TOKENS.components.header.logo.height.pt,
    objectFit: 'contain',
  },
  companyInfo: {
    marginLeft: DESIGN_TOKENS.components.header.logoCompanyGap.pt,
  },
  companyName: {
    fontSize: DESIGN_TOKENS.components.header.companyName.fontSize.pt,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: DESIGN_TOKENS.components.header.subtitle.fontSize.pt,
    color: DESIGN_TOKENS.components.header.subtitle.color,
  },
  headerRight: {
    textAlign: 'right',
  },
  specialOffer: {
    fontSize: DESIGN_TOKENS.components.header.specialOffer.fontSize.pt,
    fontWeight: 'bold',
  },
  date: {
    fontSize: DESIGN_TOKENS.components.header.subtitle.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[500],
  },
  section: {
    marginBottom: DESIGN_TOKENS.components.section.marginBottom.pt,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Added space-between
    paddingLeft: DESIGN_TOKENS.components.section.title.paddingLeft.pt,
    paddingRight: DESIGN_TOKENS.components.page.padding.pt, // Match page padding
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: DESIGN_TOKENS.components.section.title.marginBottom.pt,
    minHeight: 45,
  },
  sectionTitle: {
    fontSize: DESIGN_TOKENS.components.section.title.fontSize.pt,
    fontWeight: 'heavy',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    lineHeight: 1,
  },
  sectionLogo: {
    height: 24,
    objectFit: 'contain',
    marginLeft: 12, // Changed from marginRight to marginLeft
  },
  sectionDivider: {
    width: 3,
    height: 18,
    marginRight: 9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DESIGN_TOKENS.components.grid.gap.pt
  },

  productCard: {
    backgroundColor: DESIGN_TOKENS.colors.gray[100],
    borderRadius: DESIGN_TOKENS.components.productCard.borderRadius.pt,
    borderWidth: DESIGN_TOKENS.components.productCard.border.pt,
    borderColor: DESIGN_TOKENS.colors.gray[200],
    borderBottomWidth: DESIGN_TOKENS.components.productCard.borderBottom.pt,
    overflow: 'hidden',
    marginBottom: DESIGN_TOKENS.components.grid.gap.pt,
  },
  productImageContainer: {
    height: DESIGN_TOKENS.components.productCard.image.height.pt,
    backgroundColor: DESIGN_TOKENS.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  noImageText: {
    fontSize: DESIGN_TOKENS.components.productCard.spec.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[600],
  },
  soldOutBadge: {
    position: 'absolute',
    top: DESIGN_TOKENS.components.productCard.soldOutBadge.top.pt,
    right: DESIGN_TOKENS.components.productCard.soldOutBadge.right.pt,
    backgroundColor: DESIGN_TOKENS.colors.black,
    color: DESIGN_TOKENS.colors.white,
    fontSize: DESIGN_TOKENS.components.productCard.soldOutBadge.fontSize.pt,
    fontWeight: 'bold',
    paddingTop: DESIGN_TOKENS.components.productCard.soldOutBadge.paddingY.pt,
    paddingBottom: DESIGN_TOKENS.components.productCard.soldOutBadge.paddingY.pt,
    paddingLeft: DESIGN_TOKENS.components.productCard.soldOutBadge.paddingX.pt,
    paddingRight: DESIGN_TOKENS.components.productCard.soldOutBadge.paddingX.pt,
  },
  productContent: {
    padding: DESIGN_TOKENS.components.productCard.padding.pt,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: DESIGN_TOKENS.components.productCard.name.fontSize.pt,
    fontWeight: 'bold',
    color: DESIGN_TOKENS.colors.gray[900],
    lineHeight: 1.25,
    marginBottom: DESIGN_TOKENS.components.productCard.name.marginBottom.pt,
  },
  specsList: {
    marginBottom: DESIGN_TOKENS.components.productCard.price.marginTop.pt,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DESIGN_TOKENS.components.productCard.spec.marginBottom.pt,
  },
  specDot: {
    width: DESIGN_TOKENS.components.productCard.spec.dot.size.pt,
    height: DESIGN_TOKENS.components.productCard.spec.dot.size.pt,
    borderRadius: DESIGN_TOKENS.components.productCard.spec.dot.size.pt / 2,
    backgroundColor: DESIGN_TOKENS.colors.gray[400],
    marginRight: DESIGN_TOKENS.components.productCard.spec.dot.marginRight.pt,
  },
  specText: {
    fontSize: DESIGN_TOKENS.components.productCard.spec.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[800],
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: DESIGN_TOKENS.components.productCard.price.borderTop.pt,
    borderTopColor: DESIGN_TOKENS.colors.gray[200],
    paddingTop: DESIGN_TOKENS.components.productCard.price.paddingTop.pt,
    marginTop: DESIGN_TOKENS.components.productCard.price.marginTop.pt,
  },
  priceLabel: {
    fontSize: DESIGN_TOKENS.components.productCard.price.label.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[700],
  },
  priceValue: {
    fontSize: DESIGN_TOKENS.components.productCard.price.value.fontSize.pt,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: DESIGN_TOKENS.components.footer.padding.pt,
    paddingBottom: DESIGN_TOKENS.components.footer.padding.pt,
    paddingLeft: DESIGN_TOKENS.components.footer.paddingX.pt,
    paddingRight: DESIGN_TOKENS.components.footer.paddingX.pt,
    backgroundColor: DESIGN_TOKENS.colors.gray[100],
    borderTopWidth: DESIGN_TOKENS.components.footer.borderTop.pt,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: DESIGN_TOKENS.components.footer.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[600],
  },
});

interface CatalogDocumentProps {
  state: CatalogState;
}

export const CatalogDocument: React.FC<CatalogDocumentProps> = ({ state }) => {
  const { globalSettings, pages } = state;
  const { primaryColor, logoUrl, companyName, footerText, showHeader, headerTitle, headerSubtitle, showDate } = globalSettings;
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <Document>
      {/* Cover Page */}
      {state.coverPage?.enabled && state.coverPage.imageUrl && (
        <Page size="A4" style={{ padding: 0 }}>
          <Image 
            src={state.coverPage.imageUrl} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Page>
      )}

      {pages.map((page, pageIndex) => (
        <Page key={page.id} size="A4" style={styles.page}>
          <View style={styles.contentContainer}>
            {/* Sections */}
            {page.sections.map((section, index) => (
              <View key={section.id} style={styles.section}>
                {section.type === 'header' && (
                  <View style={[
                    styles.sectionTitleContainer,
                    { backgroundColor: darkenColor(primaryColor, 85) }
                  ]}>
                    {/* Left Side: Divider + Title */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      {/* Divider */}
                      <View style={[styles.sectionDivider, { backgroundColor: primaryColor }]} />

                      {/* Title */}
                      <Text style={styles.sectionTitle}>
                        {section.title}
                      </Text>
                    </View>

                    {/* Right Side: Logo */}
                    {logoUrl && (
                      <Image src={logoUrl} style={styles.sectionLogo} />
                    )}
                  </View>
                )}

                {section.type === 'product-grid' && (
                  <View style={{
                    paddingLeft: DESIGN_TOKENS.components.page.padding.pt,
                    paddingRight: DESIGN_TOKENS.components.page.padding.pt,
                    paddingTop: index === 0 ? DESIGN_TOKENS.components.page.padding.pt : 0
                  }}>
                    <View style={styles.grid}>
                      {section.products?.map((product) => {
                        // Calculate width based on columns (approximate for A4 width minus padding)
                        // A4 width ~595pt. Padding 48pt total (24pt * 2). Content ~547pt.
                        // Gaps need to be accounted for.
                        const cols = section.columns || 3;
                        const gapTotal = (cols - 1) * DESIGN_TOKENS.components.grid.gap.pt;
                        const availableWidth = 595 - (DESIGN_TOKENS.components.page.padding.pt * 2);
                        const width = (availableWidth - gapTotal) / cols;

                        return (
                          <View key={product.id} style={[styles.productCard, { width, borderBottomColor: primaryColor }]}>
                            <View style={styles.productImageContainer}>
                              {product.soldOut ? (
                                <PDFNoStockPlaceholder />
                              ) : product.image ? (
                                <Image src={product.image} style={styles.productImage} />
                              ) : (
                                <Text style={styles.noImageText}>Sem Imagem</Text>
                              )}
                              {product.soldOut && (
                                <View style={styles.soldOutBadge}>
                                  <Text>ESGOTADO</Text>
                                </View>
                              )}
                            </View>

                            <View style={styles.productContent}>
                              <View>
                                {/* @ts-ignore */}
                                <Text style={styles.productName} maxLines={2} hyphenationCallback={(word) => [word]}>{product.name}</Text>
                                {product.sku && (
                                  <Text style={{ fontSize: 7, color: DESIGN_TOKENS.colors.gray[500], textTransform: 'uppercase', marginTop: 2 }}>
                                    {product.sku}
                                  </Text>
                                )}
                              </View>

                              {/* Specs List */}
                              {product.specs && product.specs.length > 0 && (
                                <View style={styles.specsList}>
                                  {product.specs.map((spec, index) => (
                                    <View key={index} style={styles.specItem}>
                                      <View style={styles.specDot} />
                                      <Text style={styles.specText}>{spec}</Text>
                                    </View>
                                  ))}
                                </View>
                              )}

                              <View style={[styles.priceContainer, { flexDirection: 'column', alignItems: 'stretch', gap: 4 }]}>
                                {globalSettings.showPiecesPerBox && (
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <Text style={[styles.specText, { fontSize: 8, color: DESIGN_TOKENS.colors.gray[600], textTransform: 'uppercase' }]}>PCS/CX: {product.piecesPerBox || 1}</Text>
                                  </View>
                                )}

                                {/* Varejo */}
                                {product.retailPrice > 0 && (
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={[styles.priceLabel, { fontSize: 9 }]}>Varejo</Text>
                                    <Text style={[styles.priceValue, { fontSize: 9, fontWeight: 'normal' }]}>
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.retailPrice)}
                                    </Text>
                                  </View>
                                )}

                                {/* Drop */}
                                {product.dropPrice > 0 && (
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={[styles.priceLabel, { fontSize: 9 }]}>Drop</Text>
                                    <Text style={[styles.priceValue, { fontSize: 9, fontWeight: 'normal' }]}>
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.dropPrice)}
                                    </Text>
                                  </View>
                                )}

                                {/* Atacado */}
                                {product.wholesalePrice > 0 && (
                                  <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    backgroundColor: '#F3F4F6', // gray-100
                                    padding: 4,
                                    borderRadius: 4,
                                    marginTop: 2
                                  }}>
                                    <Text style={[styles.priceLabel, { fontSize: 9, fontWeight: 'bold', color: DESIGN_TOKENS.colors.black }]}>Atacado</Text>
                                    <Text style={[styles.priceValue, { fontSize: 11, color: DESIGN_TOKENS.colors.black }]}>
                                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.wholesalePrice)}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: primaryColor }]}>
            <Text style={styles.footerText}>{footerText}</Text>
            <Text style={styles.footerText}>Página {pageIndex + 1}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};
