/**
 * Form and input validation utilities
 */

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-+]/g, '');
  // Matches standard 10-digit Indian mobile or with country code 91
  return /^(?:91)?[6-9]\d{9}$/.test(cleaned);
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidIdentifier = (identifier: string): boolean => {
  const trimmed = identifier.trim();
  if (trimmed.length < 3) return false;
  return isValidPhone(trimmed) || isValidEmail(trimmed) || /^[A-Za-z0-9_-]{3,20}$/.test(trimmed);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};
