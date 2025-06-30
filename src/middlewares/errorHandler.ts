// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Defina uma interface para erros personalizados, se necessário
interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("ERRO 💥", err); // Log do erro para depuração

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  // Erros específicos do Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') { // Erro de violação de unique constraint
      statusCode = 409; // Conflict
      message = `Recurso duplicado: ${err.meta?.target || 'campo(s) único(s)'} já existe.`;
    } else if (err.code === 'P2025') { // Erro de registro não encontrado para operação
      statusCode = 404; // Not Found
      message = `Recurso não encontrado: ${err.meta?.cause || 'registro não existe'}.`;
    }
    // Adicione outros códigos de erro do Prisma conforme necessário
  }

  // Erros de validação (ex: se você usar uma biblioteca de validação que lança erros específicos)
  // if (err.name === 'ValidationError') {
  //   statusCode = 400;
  //   message = err.message;
  // }

  // Em ambiente de produção, evite vazar detalhes internos do erro
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Algo deu muito errado!';
  }

  res.status(statusCode).json({
    status: 'error',
    message: message,
    // Opcional: Adicionar mais detalhes do erro em desenvolvimento
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
};

export default errorHandler;
