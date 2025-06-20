export type InvitePreviewResponse = string;

export interface IRoles {
  isAdmin: boolean;
  isCustomer: boolean;
  isPerformer: boolean;
  isModeratorCustomer: boolean;
  isModeratorPerformer: boolean;
}

export type errorsType = string[];

export interface errorsObjectType {
  [key: string]: string[];
  non_field_errors: string[];
}

export interface IErrorModalData {
  title: string;
  text: string;
}

export type TokenType = string;

export type snackbarType = {
  showSnackbar?: boolean;
  message: string;
  color?: string;
};

export type messageType = {
  message: string;
};

export type Response<T> = {
  data: T;
  statusText: string;
  status: number;
  headers: object;
  config: object;
  request: object;
  errors?: Record<string, string>;
  message?: string;
};

export type ApiResponse<T> = Promise<Response<T>>;

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export type userType = {
  id: number;
  email: string;
  is_active: boolean;
  newbie?: boolean;
};

export interface ISearchDocument {
  filename: string;
  page_number: number;
  lines: string[];
  document_info: {
    document_types: number[];
    order_numbers: string[];
  };
}
export enum EDocumentTypes {
  act = 1,
  act_warehouse = 2,
  act_acceptance_of_goods = 3,
  invoice_form_4 = 4,
  invoice_form_5 = 5,
  invoice_form_6 = 6,
  invoice_form_7 = 7,
  packing_list = 8,
  invoice_form_9 = 9,
  appendix_invoice_10 = 10,
  appendix_invoice_11 = 11,
}

export interface IUserDocument {
  id: number;
  user_id: number;
  filename: string;
  page_number: number;
  success: boolean;
  error: null | string;
  document_types: number[];
  order_numbers: string[];
}

export type UserDocumentsResponse = IUserDocument[];

export type UserDocumentTypesResponse = { document_types: IDocumentType[] };

export interface IDocumentType {
  code: number;
  contract_numbers: string[];
  document_type: string;
  additional_parameters: string[];
}
export interface IDocumentTypes {
  [key: string]: EDocumentTypes;
}

export interface IUpload {
  id: number;
  user_id: number | null;
  filename: string;
  page_number: number;
  success: boolean;
  error: string;
  document_types: [];
  order_numbers: [];
  additional_info: {};
}
export interface IUploadResponse {
  pages: IUpload[];
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export interface INomenclature {
  id: number;
  article: string;
  width: number; // Ширина
  height: number; // Высота
  depth: number; // глубина
  weight: number;
  barcode: string; // Штрихкод
  fragility: number; //Хрупкость
  max_layer_height: number; //количество слоёв
  max_in_layer: number; //количество в слое
}

export interface IPagination {
  page: number;
  page_size: number;
  total: number;
  query: string;
}
