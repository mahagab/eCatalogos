// src/routes/productRoutes.ts
import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const router = Router();

// Rotas Obrigatórias

// GET /products: Listar produtos com filtros, query params e paginação
router.get('/products', (req, res) => ProductController.listProducts(req, res));

// Rotas de Filtros e Contador (MOVIDAS PARA CIMA)
// GET /products/filters: Retornar filtros (brands, types, genders, categories, promptDelivery)
router.get('/products/filters', (req, res) => ProductController.getProductFilters(req, res));

// GET /products/count: Retornar apenas a contagem de produtos com base nos mesmos filtros
router.get('/products/count', (req, res) => ProductController.getProductCount(req, res));

// GET /products/:id: Buscar detalhes de um produto (AGORA DEPOIS DAS ESPECÍFICAS)
router.get('/products/:id', (req, res) => ProductController.getProductById(req, res));

// POST /products: Criar novo produto e suas variantes/skus
router.post('/products', (req, res) => ProductController.createProduct(req, res));

// PUT /products/:id: Atualizar produto (inclusive variantes/skus)
router.put('/products/:id', (req, res) => ProductController.updateProduct(req, res));

// DELETE /products/:id: Soft delete → setar campo `deleted_at` com a data atual
router.delete('/products/:id', (req, res) => ProductController.deleteProduct(req, res));

// Rotas Opcionais (Soft Deleted Products)
// GET /products/deleted: Listagem de produtos deletados (soft deleted)
router.get('/products/deleted', (req, res) => ProductController.listDeletedProducts(req, res));

// GET /products/deleted/:id: Buscar um único produto deletado pelo ID (soft deleted)
router.get('/products/deleted/:id', (req, res) => ProductController.getDeletedProductById(req, res));

export default router;
