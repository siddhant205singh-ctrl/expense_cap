/**
 * Format a number amount (stored as integer cents) to a currency string.
 * @param {number} amount - The amount in integer (e.g., 1000 for $10.00)
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '';
  
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount / 100);
};
