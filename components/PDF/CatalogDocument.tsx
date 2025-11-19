import { CatalogState } from '@/types/catalog';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Register fonts (optional, using default Helvetica for now to ensure speed, 
// but in a real app you'd register a custom font for better styling)
// Font.register({ family: 'Roboto', src: '...' });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  headerDecoration: {
    width: '100%',
    height: 20, // approx 4mm
  },
  contentContainer: {
    padding: 30,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingBottom: 10,
    marginBottom: 20,
  },
  logo: {
    height: 50,
    objectFit: 'contain',
  },
  companyInfo: {
    marginLeft: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  headerRight: {
    textAlign: 'right',
  },
  specialOffer: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 10,
    color: '#6b7280',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'black',
    textTransform: 'uppercase',
    borderLeftWidth: 8,
    paddingLeft: 10,
    marginBottom: 10,
  },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid3: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grid4: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderBottomWidth: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  productImageContainer: {
    height: 150,
    backgroundColor: '#f3f4f6',
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
    fontSize: 10,
    color: '#9ca3af',
  },
  soldOutBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000000',
    color: '#ffffff',
    fontSize: 8,
    padding: '2 4',
  },
  productContent: {
    padding: 8,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    height: 28, // Fixed height for 2 lines
    overflow: 'hidden',
  },
  specsList: {
    marginBottom: 6,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  specDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#9ca3af',
    marginRight: 4,
  },
  specText: {
    fontSize: 8,
    color: '#4b5563',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 4,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 8,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    padding: '10 30',
    backgroundColor: '#f3f4f6',
    borderTopWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#4b5563',
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
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {section.products?.map((product) => {
                      // Calculate width based on columns (approximate for A4 width minus padding)
                      // A4 width ~595pt. Padding 60pt total. Content ~535pt.
                      // Gaps need to be accounted for.
                      const cols = section.columns || 3;
                      const gapTotal = (cols - 1) * 10;
                      const width = (535 - gapTotal) / cols;

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
