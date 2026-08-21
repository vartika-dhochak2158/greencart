import { assets, categories as storeCategories } from '../assets/assets';

const CLOUDINARY_BASE =
    import.meta.env.VITE_CLOUDINARY_URL ||
    'https://res.cloudinary.com/e4nkrgxd/image/upload';

export const fallbackImage = assets?.apple_image || assets?.fresh_fruits_image || '/placeholder.png';

export const normalizeCategory = (value) =>
    String(value || '').toLowerCase().replace(/\s+/g, '');

export const matchesCategory = (productCategory, selectedCategory) => {
  if (!selectedCategory || selectedCategory === 'All') return true;
  const product = normalizeCategory(productCategory);
  const selected = normalizeCategory(selectedCategory);
  return product === selected || product.includes(selected) || selected.includes(product);
};

export const resolveImageUrl = (img) => {
  if (!img) return null;
  const target = Array.isArray(img) ? img[0] : img;
  if (!target) return null;

  if (typeof target !== 'string') return target;

  if (
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('data:') ||
      target.startsWith('blob:') ||
      target.startsWith('/src/') ||
      target.startsWith('/assets/')
  ) {
    return target;
  }

  let cleanId = target.replace(/^\/+/, '');

  if (!/\.(png|jpe?g|webp|svg|avif)$/i.test(cleanId)) {
    cleanId = `${cleanId}.jpg`;
  }

  return `${CLOUDINARY_BASE}/${cleanId}`;
};

export const getProductImage = (product, fallback = fallbackImage) => {
  const rawImage = Array.isArray(product?.image) ? product.image[0] : product?.image;
  const resolved = resolveImageUrl(rawImage);
  if (resolved) return resolved;

  const category = String(product?.category || '').toLowerCase();
  if (category.includes('drink') || category.includes('bottle') || category.includes('beverage')) return assets?.bottles_image || fallback;
  if (category.includes('dairy') || category.includes('milk')) return assets?.amul_milk_image || fallback;
  if (category.includes('bakery') || category.includes('bread') || category.includes('cake')) return assets?.bakery_image || fallback;
  if (category.includes('grain') || category.includes('rice') || category.includes('nut')) return assets?.grain_image || fallback;
  if (category.includes('instant') || category.includes('snack') || category.includes('noodle')) return assets?.maggi_image || fallback;
  if (category.includes('veget')) return assets?.organic_vegitable_image || fallback;
  if (category.includes('fruit')) return assets?.fresh_fruits_image || fallback;

  return fallback;
};

// Safe category mapping supporting id, path, name, or text
export const lovableCategories = (storeCategories || []).map((category, index) => {
  const rawId = category?.id || category?.path || category?.name || `cat-${index}`;
  const rawLabel = category?.name || category?.text || category?.label || 'Category';

  return {
    id: String(rawId).toLowerCase(),
    label: String(rawLabel),
    image: category?.image || fallbackImage,
  };
});

// Safe product mapping with null-checks
export const toLovableProduct = (product, index = 0) => {
  if (!product) {
    return {
      id: `fallback-${index}`,
      name: 'Unknown Product',
      image: fallbackImage,
      price: 0,
      oldPrice: undefined,
      unit: 'Fresh pack',
      calories: 'Fresh & delicious',
      rating: 4.8,
      eta: '15-20 min',
      category: 'general',
      tags: ['Fresh'],
      source: {},
    };
  }

  const pName = String(product.name || 'Grocery Item');
  const price = Number(product.offerPrice ?? product.price ?? 0);
  const oldPrice =
      product.price && product.offerPrice && Number(product.offerPrice) < Number(product.price)
          ? Number(product.price)
          : undefined;

  return {
    id: String(product._id || product.id || `prod-${index}`),
    name: pName,
    image: getProductImage(product),
    price: price,
    oldPrice: oldPrice,
    unit: product.weight || product.unit || (pName.toLowerCase().includes('1 kg') ? '1 kg' : '500g'),
    calories: 'Fresh & delicious',
    rating: Number(product.rating || 4.8),
    eta: product.deliveryTime || '15-20 min',
    category: String(product.category || '').toLowerCase(),
    tags: Array.isArray(product.tags) ? product.tags : ['Fresh'],
    source: product,
  };
};