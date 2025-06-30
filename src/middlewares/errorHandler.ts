// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("ERRO 💥", err); 
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { 
      statusCode = 409; 
      message = `Recurso duplicado: ${err.meta?.target || 'campo(s) único(s)'} já existe.`;
    } else if (err.code === 'P2025') { 
      statusCode = 404; 
      message = `Recurso não encontrado: ${err.meta?.cause || 'registro não existe'}.`;
    }
   
  }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Algo deu muito errado!';
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
};

export default errorHandler;
