// src/server.ts
import express from 'express';
import productRoutes from './routes/route'; 
import errorHandler from './middlewares/errorHandler'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 


app.use('/api', productRoutes); 


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
