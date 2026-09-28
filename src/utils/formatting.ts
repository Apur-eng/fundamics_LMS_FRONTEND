/**
 * Formatting utilities for Fundemics LMS
 */

export const formatPercentage = (val: number, decimals: number = 1): string => {
  return `${val.toFixed(decimals)}%`;
};

export const formatAdmissionNo = (id: string): string => {
  if (!id) return '';
  return id.toUpperCase();
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};
