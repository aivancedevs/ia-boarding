import { TOKEN_KEY, USER_KEY } from './constants';

// ============================================================================
// LOCAL STORAGE
// ============================================================================

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    // ✅ Verifica que no sea null, undefined o la cadena "undefined"
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },
  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================================================
// DATE FORMATTING
// ============================================================================

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ============================================================================
// VALIDATION
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone);
};

// ============================================================================
// STRING MANIPULATION
// ============================================================================

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

// ============================================================================
// ERROR HANDLING
// ============================================================================

export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado';
};

// ============================================================================
// DEBOUNCE
// ============================================================================

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: number; // ✅ Cambiar NodeJS.Timeout por number
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };