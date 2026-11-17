/**
 * Format currency into Nigerian Naira (₦)
 */
export function formatNaira(amount?: number | null, fallback = 'Price on enquiry'): string {
  if (amount === undefined || amount === null || isNaN(amount) || amount <= 0) {
    return fallback;
  }
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount).replace('NGN', '₦');
}

/**
 * Generate a unique tracking reference code
 */
export function generateReference(prefix = 'KZE-REQ'): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

export const generateReferenceCode = generateReference;

/**
 * Format date for human reading
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Clean phone number for WhatsApp link
 */
export function createWhatsAppLink(phone: string, text: string): string {
  if (!phone) return '#';
  // Remove non-digit characters except leading +
  const cleanNumber = phone.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
