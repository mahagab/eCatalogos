// src/controllers/ProductController.ts
import { Request, Response } from 'express';
import ProductService from '../services/ProductService';
import { isPositiveInteger, parseBoolean } from '../utils/validationUtils';
import { ProductListFilters } from '../models/interface/productInterface'; 
import { CreateProductData } from "../models/interface/productInterface";
class ProductController {
  private productService: typeof ProductService;
  
  constructor() {
    this.productService = ProductService;
  }
  
  
  // GET /products: Listar produtos com filtros, query params e paginação
  async listProducts(req: Request, res: Response): Promise<Response> {
    try {
      const { page, limit, brand, category, gender, promptDelivery, type } = req.query;

      const filters: ProductListFilters = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        brand: brand ? (brand as string) : undefined,
        category: category ? (category as string) : undefined,
        gender: gender ? (gender as string) : undefined, 
        promptDelivery: promptDelivery !== undefined ? parseBoolean(promptDelivery as string) : undefined, 
        type: type ? (type as string) : undefined, 
      };

      if (filters.page !== undefined && (!isPositiveInteger(filters.page) || filters.page < 1)) {
        return res.status(400).json({ status: 'error', message: 'O parâmetro page deve ser um número inteiro positivo.' });
      }
      if (filters.limit !== undefined && (!isPositiveInteger(filters.limit) || filters.limit < 1)) {
        return res.status(400).json({ status: 'error', message: 'O parâmetro limit deve ser um número inteiro positivo.' });
      }

      const products = await ProductService.listProducts(filters);
      return res.status(200).json(products);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error; 
    }
  }

  // GET /products/:id: Buscar detalhes de um produto
  async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const productId = parseInt(req.params.id, 10);

      if (!isPositiveInteger(productId)) {
        return res.status(400).json({ status: 'error', message: 'ID do produto inválido. Deve ser um número inteiro positivo.' });
      }

      const product = await ProductService.getProductById(productId);

      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Produto não encontrado.' });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(`Erro ao buscar produto com ID ${req.params.id}:`, error);
      throw error;
    }
  }

 // POST /products: Criar novo produto e suas variantes/skus
  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productData: CreateProductData = req.body; 
       console.log("Dados recebidos no Controller:", JSON.stringify(productData, null, 2));

      const newProduct = await ProductService.createProduct(productData);

      return res.status(201).json(newProduct); 
    } catch (error) {
      console.error(`Erro ao criar produto:`, error);
      throw error; 
    }
  }
  // PUT /products/:id: Atualizar produto
  async updateProduct(req: Request, res: Response): Promise<Response> {
 try {
    const id = Number(req.params.id);
    const data = req.body;

    const updatedProduct = await this.productService.updateProduct(id, data);

    return res.status(200).json(updatedProduct);
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);
    return res.status(500).json({ error: error.message });
  }
  }

  // DELETE /products/:id: 
 async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productId = parseInt(req.params.id, 10);

      if (!isPositiveInteger(productId)) {
        return res.status(400).json({ status: 'error', message: 'ID do produto inválido. Deve ser um número inteiro positivo.' });
      }

      const deletedProduct = await ProductService.deleteProduct(productId);

      if (!deletedProduct) {
        return res.status(404).json({ status: 'error', message: 'Produto não encontrado ou já deletado.' });
      }

      return res.status(200).json({ status: 'success', message: 'Produto deletado com sucesso.', product: deletedProduct });
    } catch (error) {
      console.error(`Erro ao deletar produto com ID ${req.params.id}:`, error);
      throw error; 
    }
  }

  // GET /products/filters
 async getProductFilters(req: Request, res: Response): Promise<Response> {
    try {
      const filtersData = await ProductService.getProductFilters();
      return res.status(200).json(filtersData);
    } catch (error) {
      console.error(`Erro ao obter dados de filtros:`, error);
      throw error;
    }
  }

  // GET /products/count
 async getProductCount(req: Request, res: Response): Promise<Response> {
    try {
      const { page, limit, brand, category, gender, promptDelivery, type } = req.query;

      const filters: ProductListFilters = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        brand: brand ? (brand as string) : undefined,
        category: category ? (category as string) : undefined,
        gender: gender ? (gender as string) : undefined,
        promptDelivery: promptDelivery !== undefined ? parseBoolean(promptDelivery as string) : undefined,
        type: type ? (type as string) : undefined,
      };

      if (filters.page !== undefined && (!isPositiveInteger(filters.page) || filters.page < 1)) {
        return res.status(400).json({ status: "error", message: "O parâmetro page deve ser um número inteiro positivo." });
      }
      if (filters.limit !== undefined && (!isPositiveInteger(filters.limit) || filters.limit < 1)) {
        return res.status(400).json({ status: "error", message: "O parâmetro limit deve ser um número inteiro positivo." });
      }

      const count = await ProductService.getProductCount(filters);
      return res.status(200).json(count); 
    } catch (error) {
      console.error(`Erro ao obter contagem de produtos:`, error);
      throw error; 
    }
  }

async listDeletedProducts(req: Request, res: Response): Promise<Response> {
  const deletedProducts = await this.productService.listDeletedProducts();
  return res.status(200).json(deletedProducts);
}

async getDeletedProductById(req: Request, res: Response): Promise<Response> {
  const id = Number(req.params.id);
  const product = await this.productService.getDeletedProductById(id);
  if (!product) {
    const error = new Error("Produto deletado não encontrado.");
    (error as any).statusCode = 404;
    throw error;
  }
  return res.status(200).json(product);
}

}

export default new ProductController();
