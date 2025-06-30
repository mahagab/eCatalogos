// src/utils/validationUtils.ts

/**
 * Verifica se um valor é um número inteiro positivo.
 * @param value O valor a ser verificado.
 * @returns true se for um número inteiro positivo, false caso contrário.
 */
export const isPositiveInteger = (value: any): boolean => {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
};

/**
 * Verifica se uma string não é vazia ou composta apenas por espaços em branco.
 * @param value A string a ser verificada.
 * @returns true se a string não for vazia, false caso contrário.
 */
export const isNonEmptyString = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Converte uma string para um booleano. Retorna null se a string não for 'true' ou 'false'.
 * @param value A string a ser convertida.
 * @returns true, false ou null.
 */
export const parseBoolean = (value: any): boolean | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const lowerCaseValue = value.toLowerCase();
  if (lowerCaseValue === 'true') {
    return true;
  } else if (lowerCaseValue === 'false') {
    return false;
  }
  return null;
};
