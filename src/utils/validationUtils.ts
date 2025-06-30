// src/utils/validationUtils.ts


export const isPositiveInteger = (value: any): boolean => {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
};


export const isNonEmptyString = (value: any): boolean => {
  return typeof value === 'string' && value.trim().length > 0;
};


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
