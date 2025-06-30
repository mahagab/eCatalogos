// src/server.ts
import express from 'express';
import productRoutes from './routes/route'; // Supondo que você tenha um arquivo productRoutes.ts
import errorHandler from './middlewares/errorHandler'; // Importe o middleware de erro

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para parsear JSON no corpo da requisição

// Use suas rotas
app.use('/api', productRoutes); // Exemplo: todas as rotas de produto sob /api

// Middleware de tratamento de erros - DEVE SER O ÚLTIMO
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
