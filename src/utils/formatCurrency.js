/**
 * Formats a numeric amount to Indian Rupee format (e.g., ₹38,00,000 or ₹38.00 Lakh)
 */
export const formatCurrency = (amount, compact = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';

  const num = Number(amount);

  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(num) >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatPercentage = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  return `${Number(val).toFixed(1)}%`;
};
