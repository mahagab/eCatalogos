// src/routes/productRoutes.ts
import { Router } from 'express';
import ProductController from '../controllers/ProductController';

const router = Router();

// Rotas Obrigatórias

// Filtros e contadores (mais específicos)
router.get('/products/filters', (req, res) => ProductController.getProductFilters(req, res));
router.get('/products/count', (req, res) => ProductController.getProductCount(req, res));

// Produtos deletados (soft deleted) - colocar antes de rotas com :id
router.get('/products/deleted', (req, res) => ProductController.listDeletedProducts(req, res));
router.get('/products/deleted/:id', (req, res) => ProductController.getDeletedProductById(req, res));

// Rota com id dinâmico - deve vir depois
router.get('/products/:id', (req, res) => ProductController.getProductById(req, res));

// Listagem geral
router.get('/products', (req, res) => ProductController.listProducts(req, res));

// Criação, atualização e deleção
router.post('/products', (req, res) => ProductController.createProduct(req, res));
router.put('/products/:id', (req, res) => ProductController.updateProduct(req, res));
router.delete('/products/:id', (req, res) => ProductController.deleteProduct(req, res));
export default router;
