/**
 * Centralized product field helpers for backward compatibility and lot tracking
 * Supports both legacy (product_*) and standard field naming
 */

// Normalized getters with fallback to legacy field names
export const getProductId = (product) => product?.product_id ?? product?.id ?? '';

export const getProductReference = (product) => product?.product_reference ?? product?.reference ?? '';

export const getProductName = (product) => product?.product_name ?? product?.name ?? '';

export const getProductPurchasePrice = (product) => product?.product_purchase_price ?? product?.purchase_price ?? 0;

export const getProductSalePrice = (product) => product?.product_sale_price ?? product?.sale_price ?? 0;

export const getProductQuantity = (product) => product?.product_quantity ?? product?.quantity ?? 0;

export const getProductBatchNumber = (product) => product?.product_batch_number ?? product?.batch_number ?? '';

export const getProductExpiryDate = (product) => product?.product_expiry_date ?? product?.expiry_date ?? '';

export const getProductManufactureDate = (product) => product?.product_manufacture_date ?? product?.manufacture_date ?? '';

export const getProductPicture = (product) => product?.picture ?? product?.product_picture ?? '';

export const getProductCategory = (product) => product?.category ?? null;

export const getProductCategoryName = (product) => {
  const category = getProductCategory(product);
  return category?.category_name ?? (!category && product?.category_id ? `Catégorie ${product.category_id}` : '-');
};

/**
 * Get product lots array from product object
 * Returns product_lots if available (from API), otherwise empty array
 */
export const getProductLots = (product) => {
  if (!product) return [];
  return Array.isArray(product.product_lots) ? product.product_lots : 
         Array.isArray(product.lots) ? product.lots : [];
};

/**
 * Calculate total available quantity from all lots
 */
export const getTotalAvailableQuantity = (product) => {
  const lots = getProductLots(product);
  return lots.reduce((sum, lot) => sum + (lot.available_quantity || 0), 0);
};

/**
 * Check if product is expired
 */
export const isProductExpired = (expiryDate) => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  return expiry < today;
};

/**
 * Check if product is expiring soon (within 30 days)
 */
export const isExpiringSoon = (expiryDate, daysThreshold = 30) => {
  if (!expiryDate) return false;
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= daysThreshold;
};

/**
 * Format date for display
 */
export const formatDateDisplay = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};

/**
 * Get stock status label with styling
 */
export const getStockStatus = (quantity) => {
  const qty = Number(quantity) || 0;
  if (qty <= 0) {
    return {
      label: 'Rupture',
      color: '#b42318',
      bgColor: '#fee4e2',
    };
  }
  if (qty <= 5) {
    return {
      label: 'Stock faible',
      color: '#b54708',
      bgColor: '#fffaeb',
    };
  }
  return {
    label: 'Disponible',
    color: '#067647',
    bgColor: '#ecfdf3',
  };
};

/**
 * Get lot's expiry status
 */
export const getLotExpiryStatus = (expiryDate) => {
  if (!expiryDate) {
    return {
      label: 'Non renseignée',
      color: '#344054',
      bgColor: '#f2f4f7',
    };
  }
  
  if (isProductExpired(expiryDate)) {
    return {
      label: 'Expiré',
      color: '#b42318',
      bgColor: '#fee4e2',
    };
  }
  
  if (isExpiringSoon(expiryDate)) {
    return {
      label: 'Expire bientôt',
      color: '#b54708',
      bgColor: '#fffaeb',
    };
  }
  
  return {
    label: 'Valide',
    color: '#067647',
    bgColor: '#ecfdf3',
  };
};

/**
 * Build product display label from reference and name
 */
export const buildProductLabel = (product) => {
  const ref = getProductReference(product);
  const name = getProductName(product);
  return `${ref} - ${name}`;
};

/**
 * Sort lots by expiry date (FIFO - earliest first)
 */
export const sortLotsByExpiry = (lots) => {
  if (!Array.isArray(lots)) return [];
  return [...lots].sort((a, b) => {
    const dateA = new Date(a.expiry_date || '9999-12-31');
    const dateB = new Date(b.expiry_date || '9999-12-31');
    return dateA - dateB;
  });
};

/**
 * Filter available lots (quantity > 0, not expired)
 */
export const getAvailableLots = (lots) => {
  if (!Array.isArray(lots)) return [];
  return lots.filter(lot => 
    (lot.available_quantity || 0) > 0 && 
    !isProductExpired(lot.expiry_date)
  );
};

/**
 * Get lot display string: "Batch#2024-001 (Exp: 2026-12-31, Qte: 50)"
 */
export const formatLotDisplay = (lot) => {
  if (!lot) return '-';
  const batch = lot.batch_number || 'N/A';
  const expiry = lot.expiry_date ? formatDateDisplay(lot.expiry_date) : 'N/A';
  const qty = lot.available_quantity || 0;
  return `${batch} (Exp: ${expiry}, Qte: ${qty})`;
};
