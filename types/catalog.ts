export interface Product {
  id: string;
  name: string;
  retailPrice: number;
  wholesalePrice: number;
  dropPrice: number;
  soldOut: boolean;
  piecesPerBox: number;
  image?: string;
}

export type SectionType = 'header' | 'product-grid' | 'footer';

export interface Section {
  id: string;
  type: SectionType;
  title?: string;
  columns?: 2 | 3 | 4;
  products?: Product[];
}

export interface Page {
  id: string;
  sections: Section[];
}

export interface GlobalSettings {
  primaryColor: string;
  logoUrl: string;
  footerText: string;
  companyName: string;
  showHeader: boolean;
  headerTitle: string;
  headerSubtitle: string;
  showDate: boolean;
}

export interface CatalogState {
  pages: Page[];
  globalSettings: GlobalSettings;
}
