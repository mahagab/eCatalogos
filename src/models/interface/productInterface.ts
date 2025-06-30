

import { ProductGender, ProductType } from '@prisma/client';

export interface CreateSkuData {
  size: string;
  stock: number;
  price: number;
  code: string;
  min_quantity?: number;
  multiple_quantity: number;
  erpId?: string;
  cest?: string;
  height?: number;
  length?: number;
  ncm?: string;
  weight?: number;
  width?: number;
  price_tables_skus: {
    price: number;
    price_table_id: number;
  }[];
}

export interface CreateVariantData {
  name: string;
  hex_code?: string;
  skus: CreateSkuData[];
}

export interface CreateProductData {
  name: string;
  reference: string;
  type: ProductType; 
  gender: ProductGender; 
  prompt_delivery: boolean;
  description?: string;
  company_id: number;
  erp_id?: string;
  brand_id: number;
  deadline_id?: number;
  category_id: number;
  subcategory_id?: number;
  category_order?: number;
  composition_data?: string;
  technical_information?: string;
  open_grid?: boolean;
  ipi?: number;
  is_discontinued?: boolean;
  is_launch?: boolean;
  is_visible?: boolean;
  colection?: string;
  st?: number;
  variants: CreateVariantData[];
}


export interface UpdateProductData extends Partial<CreateProductData> {

}

export interface ProductListFilters {
  page?: number;
  limit?: number;
  brand?: string;
  category?: string;
  gender?: string;
  promptDelivery?: boolean | null; 
  type?: string;
}