// src/services/ProductService.ts
import prisma from '../database/prisma';
import { Product, Prisma } from '@prisma/client';
import { CreateProductData, UpdateProductData, ProductListFilters } from '../models/interface/productInterface';
import { ProductGender, ProductType } from '@prisma/client'; 


class ProductService {

  private filterVariantsByPriceTable(product: any): any | null {
    const filteredVariants = product.variants.filter((variant: any) => {
      if (!variant.skus || variant.skus.length === 0) {
        return false; 
      }


      const firstPriceTableId = variant.skus[0].price_tables_skus[0]?.price_table_id;

      if (firstPriceTableId === undefined) {
        return false; 
      }

      const allSkusHaveSamePriceTable = variant.skus.every((sku: any) =>
        sku.price_tables_skus.length > 0 &&
        sku.price_tables_skus[0].price_table_id === firstPriceTableId
      );

      return allSkusHaveSamePriceTable;
    });

    if (filteredVariants.length === 0) {
      return null;
    }

    return {
      ...product,
      variants: filteredVariants
    };
  }

  // GET /products
  async listProducts(filters: ProductListFilters): Promise<Product[]> {
    const { page, limit, brand, category, gender, promptDelivery, type } = filters;
    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit;

    const whereClause: Prisma.ProductWhereInput = {
      deleted_at: null, 
    };

    if (brand) {
      whereClause.brand = { name: brand };
    }
    if (category) {
      whereClause.category = { name: category };
    }
    if (gender) {
      const validGender = Object.values(ProductGender).find(g => g === gender.toUpperCase());
      if (validGender) {
        whereClause.gender = validGender as ProductGender;
      } else {
        console.warn(`Gênero inválido '${gender}' ignorado.`);
      }
    }
 if (promptDelivery !== undefined) {
      
      if (promptDelivery === true || promptDelivery === false) {
        whereClause.prompt_delivery = promptDelivery;
      } else {
      
        console.warn(`Valor inválido para promptDelivery: ${promptDelivery}. Ignorando filtro.`);
      }
    }
    if (type) {
      const validType = Object.values(ProductType).find(t => t === type.toUpperCase());
      if (validType) {
        whereClause.type = validType as ProductType; 
      } else {
        console.warn(`Tipo de produto inválido '${type}' ignorado.`);
      }
    }

    const products = await prisma.product.findMany({
      skip,
      take,
      where: whereClause,
      include: {
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: true 
              }
            }
          }
        },
        brand: true,
        category: true,
        subcategory: true,
      },
    });

   
    const filteredProducts = products
      .map(product => this.filterVariantsByPriceTable(product))
      .filter(Boolean) as Product[];

    return filteredProducts;
  }

  // GET /products/:id
  async getProductById(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id, deleted_at: null },
      include: {
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: true
              }
            }
          }
        },
        brand: true,
        category: true,
        subcategory: true,
      },
    });

    if (!product) {
      return null;
    }

   
    return this.filterVariantsByPriceTable(product);
  }

  // POST /products
    async createProduct(data: CreateProductData): Promise<Product> {
   
    const newProduct = await prisma.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          reference: data.reference,
          type: data.type,
          gender: data.gender,
          prompt_delivery: data.prompt_delivery,
          description: data.description,
          company_id: data.company_id,
          erp_id: data.erp_id,
          brand_id: data.brand_id,
          deadline_id: data.deadline_id,
          category_id: data.category_id,
          subcategory_id: data.subcategory_id,
          category_order: data.category_order,
          composition_data: data.composition_data,
          technical_information: data.technical_information,
          open_grid: data.open_grid,
          ipi: data.ipi,
          is_discontinued: data.is_discontinued,
          is_launch: data.is_launch,
          is_visible: data.is_visible,
          colection: data.colection,
          st: data.st,
          variants: {
            create: data.variants.map(variantData => ({
              name: variantData.name,
              hex_code: variantData.hex_code,
              skus: {
                create: variantData.skus.map(skuData => ({
                  size: skuData.size,
                  stock: skuData.stock,
                  price: skuData.price,
                  code: skuData.code,
                  min_quantity: skuData.min_quantity,
                  multiple_quantity: skuData.multiple_quantity,
                  erpId: skuData.erpId,
                  cest: skuData.cest,
                  height: skuData.height,
                  length: skuData.length,
                  ncm: skuData.ncm,
                  weight: skuData.weight,
                  width: skuData.width,
                  price_tables_skus: {
                    create: skuData.price_tables_skus.map(ptsData => ({
                      price: ptsData.price,
                      price_table_id: ptsData.price_table_id,
                    }))
                  }
                }))
              }
            }))
          }
        },
        include: {
          variants: {
            include: {
              skus: {
                include: {
                  price_tables_skus: true
                }
              }
            }
          }
        }
      });
      return product;
    });
    return newProduct;
  }

  // PUT /products/:id
  async updateProduct(id: number, data: Partial<CreateProductData>): Promise<Product> {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        reference: data.reference,
        updated_at: new Date(),
      },
      include: {
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: true,
              },
            },
          },
        },
      },
    });
    return updatedProduct;
  } catch (error) {
    throw error;
  }
}

  // DELETE /products/:id (Soft Delete)
  async deleteProduct(id: number): Promise<Product | null> {
    const product = await prisma.product.update({
      where: { id, deleted_at: null }, 
      data: {
        deleted_at: new Date(),
      },
    });
    return product;
  }


  // GET /products/filters
  async getProductFilters(): Promise<any> {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: {
              where: { deleted_at: null } 
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const categories = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            products: {
              where: { deleted_at: null }
            }
          }
        },
        subcategories: {
          select: {
            name: true,
            _count: {
              select: {
                products: {
                  where: { deleted_at: null }
                }
              }
            }
          },
          orderBy: { name: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    const genders = await prisma.product.groupBy({
      by: ['gender'],
      _count: {
        gender: true,
      },
      where: { deleted_at: null }
    });

    const types = await prisma.product.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
      where: { deleted_at: null }
    });

    const promptDeliveryCounts = await prisma.product.groupBy({
      by: ['prompt_delivery'],
      _count: {
        prompt_delivery: true,
      },
      where: { deleted_at: null }
    });


    return {
      brands: brands.map(b => ({ id: b.id, name: b.name, quantity: b._count.products })),
      types: types.map(t => ({ name: t.type, quantity: t._count.type })),
      genders: genders.map(g => ({ name: g.gender, quantity: g._count.gender })),
      categories: categories.map(c => ({
        name: c.name,
        quantity: c._count.products,
        subcategories: c.subcategories.map(sc => ({
          name: sc.name,
          quantity: sc._count.products
        }))
      })),
      promptDelivery: {
        true: promptDeliveryCounts.find(pd => pd.prompt_delivery === true)?._count.prompt_delivery || 0,
        false: promptDeliveryCounts.find(pd => pd.prompt_delivery === false)?._count.prompt_delivery || 0,
      }
    };
  }

  // GET /products/count
async getProductCount(filters: ProductListFilters): Promise<number> {
    const { brand, category, gender, promptDelivery, type } = filters;

    const whereClause: Prisma.ProductWhereInput = {
      deleted_at: null, 
    };

    if (brand) {
      whereClause.brand = { name: brand };
    }
    if (category) {
      whereClause.category = { name: category };
    }
    if (gender) {
      const validGender = Object.values(ProductGender).find(g => g === gender.toUpperCase());
      if (validGender) {
        whereClause.gender = validGender as ProductGender;
      } else {
        console.warn(`Gênero inválido '${gender}' ignorado para contagem.`);
      }
    }
    if (promptDelivery !== undefined) {
      if (promptDelivery === true || promptDelivery === false) {
        whereClause.prompt_delivery = promptDelivery;
      } else {
        console.warn(`Valor inválido para promptDelivery: ${promptDelivery}. Ignorando filtro para contagem.`);
      }
    }
    if (type) {
      const validType = Object.values(ProductType).find(t => t === type.toUpperCase());
      if (validType) {
        whereClause.type = validType as ProductType;
      } else {
        console.warn(`Tipo de produto inválido '${type}' ignorado para contagem.`);
      }
    }

    const count = await prisma.product.count({
      where: whereClause,
    });

    return count;
  }

  // GET /products/deleted
  async listDeletedProducts(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        deleted_at: {
          not: null, 
        },
      },
      include: {
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: true
              }
            }
          }
        },
        brand: true,
        category: true,
        subcategory: true,
      },
    });
    return products;
  }

  // GET /products/deleted/:id
  async getDeletedProductById(id: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
        deleted_at: {
          not: null, 
        },
      },
      include: {
        variants: {
          include: {
            skus: {
              include: {
                price_tables_skus: true
              }
            }
          }
        },
        brand: true,
        category: true,
        subcategory: true,
      },
    });
    return product;
  }
}

export default new ProductService(); 




