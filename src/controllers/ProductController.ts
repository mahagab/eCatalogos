// src/controllers/ProductController.ts
import { Request, Response } from 'express';
import ProductService from '../services/ProductService';
import { isPositiveInteger, parseBoolean } from '../utils/validationUtils'; // Importe as funções utilitárias
import { ProductListFilters } from '../models/interface/productInterface'; // Importe a interface de filtros
import { CreateProductData } from "../models/interface/productInterface";
class ProductController {
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

      // Validação básica dos filtros (exemplo)
      if (filters.page !== undefined && (!isPositiveInteger(filters.page) || filters.page < 1)) {
        return res.status(400).json({ status: 'error', message: 'O parâmetro page deve ser um número inteiro positivo.' });
      }
      if (filters.limit !== undefined && (!isPositiveInteger(filters.limit) || filters.limit < 1)) {
        return res.status(400).json({ status: 'error', message: 'O parâmetro limit deve ser um número inteiro positivo.' });
      }

      const products = await ProductService.listProducts(filters);
      return res.status(200).json(products);
    } catch (error) {
      // O errorHandler.ts vai capturar isso, mas é bom ter um log aqui para depuração
      console.error('Erro ao listar produtos:', error);
      // Não envie a resposta aqui, deixe o middleware de erro lidar com isso
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

  // ... (mantenha os outros métodos como estão, por enquanto)

 // POST /products: Criar novo produto e suas variantes/skus
  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productData: CreateProductData = req.body; // Assume que o corpo da requisição corresponde à interface
       console.log("Dados recebidos no Controller:", JSON.stringify(productData, null, 2));

      const newProduct = await ProductService.createProduct(productData);

      return res.status(201).json(newProduct); // Retorna 201 Created
    } catch (error) {
      console.error(`Erro ao criar produto:`, error);
      throw error; // Deixe o middleware de erro lidar com isso
    }
  }
  // PUT /products/:id: Atualizar produto (inclusive variantes/skus)
  async updateProduct(req: Request, res: Response): Promise<Response> {
    // Lógica de validação e chamada ao service
    return res.status(501).json({ message: 'Not Implemented' }); // <--- Adicione 'return'
  }

  // DELETE /products/:id: Soft delete → setar campo `deleted_at` com a data atual
 async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const productId = parseInt(req.params.id, 10);

      if (!isPositiveInteger(productId)) {
        return res.status(400).json({ status: 'error', message: 'ID do produto inválido. Deve ser um número inteiro positivo.' });
      }

      const deletedProduct = await ProductService.deleteProduct(productId);

      if (!deletedProduct) {
        // Se o produto não foi encontrado ou já estava deletado
        return res.status(404).json({ status: 'error', message: 'Produto não encontrado ou já deletado.' });
      }

      return res.status(200).json({ status: 'success', message: 'Produto deletado com sucesso.', product: deletedProduct });
    } catch (error) {
      console.error(`Erro ao deletar produto com ID ${req.params.id}:`, error);
      throw error; // Deixe o middleware de erro lidar com isso
    }
  }

  // GET /products/filters: Retornar filtros (brands, types, genders, categories, promptDelivery)
 async getProductFilters(req: Request, res: Response): Promise<Response> {
    try {
      const filtersData = await ProductService.getProductFilters();
      return res.status(200).json(filtersData);
    } catch (error) {
      console.error(`Erro ao obter dados de filtros:`, error);
      throw error; // Deixe o middleware de erro lidar com isso
    }
  }

  // GET /products/count: Retornar apenas a contagem de produtos com base nos mesmos filtros
 async getProductCount(req: Request, res: Response): Promise<Response> {
    try {
      const { page, limit, brand, category, gender, promptDelivery, type } = req.query;

      // Reutiliza a lógica de parse e validação de filtros do listProducts
      const filters: ProductListFilters = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        brand: brand ? (brand as string) : undefined,
        category: category ? (category as string) : undefined,
        gender: gender ? (gender as string) : undefined,
        promptDelivery: promptDelivery !== undefined ? parseBoolean(promptDelivery as string) : undefined,
        type: type ? (type as string) : undefined,
      };

      // Validação básica dos filtros (exemplo, pode ser mais robusta)
      if (filters.page !== undefined && (!isPositiveInteger(filters.page) || filters.page < 1)) {
        return res.status(400).json({ status: "error", message: "O parâmetro page deve ser um número inteiro positivo." });
      }
      if (filters.limit !== undefined && (!isPositiveInteger(filters.limit) || filters.limit < 1)) {
        return res.status(400).json({ status: "error", message: "O parâmetro limit deve ser um número inteiro positivo." });
      }

      const count = await ProductService.getProductCount(filters);
      return res.status(200).json(count); // Retorna apenas o número da contagem
    } catch (error) {
      console.error(`Erro ao obter contagem de produtos:`, error);
      throw error; // Deixe o middleware de erro lidar com isso
    }
  }

  // GET /products/deleted: Listagem de produtos deletados (soft deleted)
  async listDeletedProducts(req: Request, res: Response): Promise<Response> {
    // Lógica de validação e chamada ao service
    return res.status(501).json({ message: 'Not Implemented' }); // <--- Adicione 'return'
  }

  // GET /products/deleted/:id: Buscar um único produto deletado pelo ID (soft deleted)
  async getDeletedProductById(req: Request, res: Response): Promise<Response> {
    // Lógica de validação e chamada ao service
    return res.status(501).json({ message: 'Not Implemented' }); // <--- Adicione 'return'
  }
}

export default new ProductController();
