/**
 * Utilitaires de validation centralisés
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valide un email
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: "Email requis" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Format d'email invalide" };
  }

  return { isValid: true };
};

/**
 * Valide un mot de passe
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Mot de passe requis" };
  }

  if (password.length < 8) {
    return { isValid: false, error: "Minimum 8 caractères" };
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return {
      isValid: false,
      error: "Doit contenir majuscule, minuscule et chiffre",
    };
  }

  return { isValid: true };
};

/**
 * Valide un numéro de téléphone français
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;

  if (!phone) {
    return { isValid: false, error: "Téléphone requis" };
  }

  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return { isValid: false, error: "Format de téléphone invalide" };
  }

  return { isValid: true };
};

/**
 * Valide un montant
 */
export const validateAmount = (amount: string | number): ValidationResult => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return { isValid: false, error: "Montant invalide" };
  }

  if (numAmount < 0) {
    return { isValid: false, error: "Le montant doit être positif" };
  }

  return { isValid: true };
};

/**
 * Valide une URL
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: "URL requise" };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: "Format d'URL invalide" };
  }
};

/**
 * Valide un code postal français
 */
export const validatePostalCode = (postalCode: string): ValidationResult => {
  const postalRegex = /^[0-9]{5}$/;

  if (!postalCode) {
    return { isValid: false, error: "Code postal requis" };
  }

  if (!postalRegex.test(postalCode)) {
    return { isValid: false, error: "Code postal invalide (5 chiffres)" };
  }

  return { isValid: true };
};

/**
 * Validation groupée pour formulaires
 */
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => ValidationResult>
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const [field, validator] of Object.entries(rules) as Array<
    [keyof T, (value: any) => ValidationResult]
  >) {
    const result = validator(data[field]);
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
};
