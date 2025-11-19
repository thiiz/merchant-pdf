import { DESIGN_TOKENS } from '@/constants/design-tokens';
import { CatalogState } from '@/types/catalog';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Register fonts (optional, using default Helvetica for now to ensure speed, 
// but in a real app you'd register a custom font for better styling)
// Font.register({ family: 'Roboto', src: '...' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: DESIGN_TOKENS.colors.white,
    padding: 0,
  },
  headerDecoration: {
    width: '100%',
    height: DESIGN_TOKENS.components.header.decoration.height.pt,
  },
  contentContainer: {
    padding: DESIGN_TOKENS.components.page.padding.pt,
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
  sectionTitle: {
    fontSize: DESIGN_TOKENS.components.section.title.fontSize.pt,
    fontWeight: 'heavy', // 'black' equivalent in PDF
    textTransform: 'uppercase',
    borderLeftWidth: DESIGN_TOKENS.components.section.title.borderLeft.pt,
    paddingLeft: DESIGN_TOKENS.components.section.title.paddingLeft.pt,
    marginBottom: DESIGN_TOKENS.components.section.title.marginBottom.pt,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: DESIGN_TOKENS.components.grid.gap.pt
  },

  productCard: {
    backgroundColor: DESIGN_TOKENS.colors.white,
    borderRadius: DESIGN_TOKENS.components.productCard.borderRadius.pt,
    borderWidth: DESIGN_TOKENS.components.productCard.border.pt,
    borderColor: DESIGN_TOKENS.colors.gray[200],
    borderBottomWidth: DESIGN_TOKENS.components.productCard.borderBottom.pt,
    overflow: 'hidden',
    marginBottom: 10,
  },
  productImageContainer: {
    height: DESIGN_TOKENS.components.productCard.image.height.pt,
    backgroundColor: DESIGN_TOKENS.colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImageText: {
    fontSize: DESIGN_TOKENS.components.productCard.spec.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[400],
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
    marginBottom: DESIGN_TOKENS.components.productCard.name.marginBottom.pt,
    height: DESIGN_TOKENS.components.productCard.name.lineHeight.pt, // Fixed height for 2 lines
    overflow: 'hidden',
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
    color: DESIGN_TOKENS.colors.gray[600],
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: DESIGN_TOKENS.components.productCard.price.borderTop.pt,
    borderTopColor: DESIGN_TOKENS.colors.gray[100],
    paddingTop: DESIGN_TOKENS.components.productCard.price.paddingTop.pt,
    marginTop: DESIGN_TOKENS.components.productCard.price.marginTop.pt,
  },
  priceLabel: {
    fontSize: DESIGN_TOKENS.components.productCard.price.label.fontSize.pt,
    color: DESIGN_TOKENS.colors.gray[500],
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
  const { primaryColor, logoUrl, companyName, footerText } = globalSettings;

  return (
    <Document>
      {pages.map((page, pageIndex) => (
        <Page key={page.id} size="A4" style={styles.page}>
          {/* Header Decoration */}
          <View style={[styles.headerDecoration, { backgroundColor: primaryColor }]} />

          <View style={styles.contentContainer}>
            {/* Page Header */}
            <View style={[styles.header, { borderBottomColor: primaryColor }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {logoUrl ? (
                  <Image src={logoUrl} style={styles.logo} />
                ) : null}
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{companyName}</Text>
                  <Text style={styles.subTitle}>Catálogo de Produtos</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <Text style={[styles.specialOffer, { color: primaryColor }]}>Ofertas Especiais</Text>
                <Text style={styles.date}>{new Date().toLocaleDateString('pt-BR')}</Text>
              </View>
            </View>

            {/* Sections */}
            {page.sections.map((section) => (
              <View key={section.id} style={styles.section}>
                {section.type === 'header' && (
                  <Text style={[styles.sectionTitle, { borderColor: primaryColor }]}>
                    {section.title}
                  </Text>
                )}

                {section.type === 'product-grid' && (
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
                            {product.image ? (
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
                              <Text style={styles.productName}>{product.name}</Text>
                              <View style={styles.specsList}>
                                {product.specs.map((spec, idx) => (
                                  <View key={idx} style={styles.specItem}>
                                    <View style={styles.specDot} />
                                    <Text style={styles.specText}>{spec}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>

                            <View style={styles.priceContainer}>
                              <Text style={styles.priceLabel}>À vista</Text>
                              <Text style={styles.priceValue}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    })}
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
