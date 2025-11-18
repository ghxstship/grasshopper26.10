/**
 * Wallet integration types
 */

export interface WalletConnectConfig {
  projectId: string;
  chains: number[];
  optionalChains?: number[];
}

export interface WalletConnectionResult {
  address: string;
  chainId: number;
  provider: any;  
}

export interface AppleWalletPass {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText?: string;
  foregroundColor?: string;
  backgroundColor?: string;
  labelColor?: string;
  barcode?: {
    message: string;
    format: 'PKBarcodeFormatQR' | 'PKBarcodeFormatPDF417' | 'PKBarcodeFormatAztec' | 'PKBarcodeFormatCode128';
    messageEncoding: string;
  };
  generic?: {
    primaryFields?: PassField[];
    secondaryFields?: PassField[];
    auxiliaryFields?: PassField[];
    backFields?: PassField[];
  };
  eventTicket?: {
    primaryFields?: PassField[];
    secondaryFields?: PassField[];
    auxiliaryFields?: PassField[];
    backFields?: PassField[];
  };
}

export interface PassField {
  key: string;
  label: string;
  value: string | number;
  textAlignment?: 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural';
}

export interface GoogleWalletPass {
  id: string;
  classId: string;
  state: 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'INACTIVE';
  barcode?: {
    type: 'QR_CODE' | 'PDF_417' | 'AZTEC' | 'CODE_128';
    value: string;
    alternateText?: string;
  };
  textModulesData?: Array<{
    header: string;
    body: string;
    id?: string;
  }>;
  linksModuleData?: {
    uris: Array<{
      uri: string;
      description: string;
      id?: string;
    }>;
  };
  imageModulesData?: Array<{
    mainImage: {
      sourceUri: {
        uri: string;
      };
    };
    id?: string;
  }>;
}

export interface EventTicketClass {
  id: string;
  issuerName: string;
  eventName: {
    defaultValue: {
      language: string;
      value: string;
    };
  };
  venue?: {
    name: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
    address: {
      defaultValue: {
        language: string;
        value: string;
      };
    };
  };
  dateTime?: {
    start: string;
    end?: string;
  };
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  animation_url?: string;
  background_color?: string;
}

export interface MintNFTParams {
  to: string;
  tokenUri: string;
  metadata: NFTMetadata;
  chainId?: number;
}
