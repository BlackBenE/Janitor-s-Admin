/**
 * Utilitaires pour la manipulation et traitement des données
 */

/**
 * Groupe des éléments par une clé donnée
 */
export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Supprime les doublons d'un tableau basé sur une clé
 */
export const uniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

/**
 * Trie un tableau par plusieurs critères
 */
export const sortBy = <T>(
  array: T[],
  ...selectors: Array<(item: T) => any>
): T[] => {
  return [...array].sort((a, b) => {
    for (const selector of selectors) {
      const aValue = selector(a);
      const bValue = selector(b);

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    }
    return 0;
  });
};

/**
 * Filtre un tableau par recherche textuelle sur plusieurs champs
 */
export const searchInFields = <T>(
  items: T[],
  searchTerm: string,
  fields: Array<keyof T>
): T[] => {
  if (!searchTerm.trim()) return items;

  const term = searchTerm.toLowerCase();

  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value && String(value).toLowerCase().includes(term);
    })
  );
};

/**
 * Pagine un tableau
 */
export const paginate = <T>(
  array: T[],
  page: number,
  size: number
): { items: T[]; total: number; pages: number; currentPage: number } => {
  const total = array.length;
  const pages = Math.ceil(total / size);
  const currentPage = Math.max(1, Math.min(page, pages));

  const startIndex = (currentPage - 1) * size;
  const items = array.slice(startIndex, startIndex + size);

  return {
    items,
    total,
    pages,
    currentPage,
  };
};

/**
 * Calcule des statistiques sur un tableau numérique
 */
export const calculateStats = (numbers: number[]) => {
  if (numbers.length === 0) {
    return { sum: 0, average: 0, min: 0, max: 0, count: 0 };
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const average = sum / numbers.length;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return {
    sum,
    average,
    min,
    max,
    count: numbers.length,
  };
};

/**
 * Convertit un objet en paramètres d'URL
 */
export const objectToQueryParams = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value != null && value !== "") {
      params.append(key, String(value));
    }
  });

  return params.toString();
};

/**
 * Convertit des paramètres d'URL en objet
 */
export const queryParamsToObject = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
};

/**
 * Deep clone d'un objet
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array)
    return obj.map((item) => deepClone(item)) as unknown as T;

  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }

  return clonedObj;
};

/**
 * Debounce une fonction
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Throttle une fonction
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(null, args);
    }
  };
};

/**
 * Capitalise la première lettre d'une chaîne
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Tronque une chaîne à une longueur donnée
 */
export const truncate = (
  str: string,
  length: number,
  suffix: string = "..."
): string => {
  if (str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};
