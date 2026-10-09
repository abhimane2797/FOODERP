import type { MenuCategory, MenuItem, MenuAddon, MenuVariant } from '../types'

export const menuCategories: MenuCategory[] = [
  { id: 'cat-starters', name: 'Starters', description: 'Appetizers & snacks', isActive: true, sortOrder: 1 },
  { id: 'cat-main', name: 'Main Course', description: 'Entrées & curries', isActive: true, sortOrder: 2 },
  { id: 'cat-pizza', name: 'Pizza', description: 'Wood-fired pizzas', isActive: true, sortOrder: 3 },
  { id: 'cat-burgers', name: 'Burgers', description: 'Gourmet burgers', isActive: true, sortOrder: 4 },
  { id: 'cat-beverages', name: 'Beverages', description: 'Drinks & juices', isActive: true, sortOrder: 5 },
  { id: 'cat-desserts', name: 'Desserts', description: 'Sweet endings', isActive: true, sortOrder: 6 },
]

export const commonAddons: MenuAddon[] = [
  { id: 'ad-1', name: 'Extra Cheese', price: 30, isAvailable: true },
  { id: 'ad-2', name: 'Extra Sauce', price: 20, isAvailable: true },
  { id: 'ad-3', name: 'Extra Patty', price: 50, isAvailable: true },
  { id: 'ad-4', name: 'Extra Butter', price: 15, isAvailable: true },
]

export const commonVariants: MenuVariant[] = [
  { id: 'var-regular', name: 'Regular', priceModifier: 0 },
  { id: 'var-large', name: 'Large', priceModifier: 80 },
  { id: 'var-half', name: 'Half', priceModifier: -40 },
  { id: 'var-full', name: 'Full', priceModifier: 60 },
]

export const menuItems: MenuItem[] = [
  // Starters
  {
    id: 'mi-001', name: 'Paneer Tikka', description: 'Char-grilled cottage cheese with mint chutney',
    categoryId: 'cat-starters', price: 220, taxPercent: 5, sku: 'ST-001', foodType: 'veg',
    prepTimeMinutes: 15, imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.8, variants: [commonVariants[0], commonVariants[2]], addons: commonAddons,
  },
  {
    id: 'mi-002', name: 'Chicken Tikka', description: 'Succulent chicken chunks in tandoori spices',
    categoryId: 'cat-starters', price: 260, taxPercent: 5, sku: 'ST-002', foodType: 'non-veg',
    prepTimeMinutes: 18, imageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.7, variants: [commonVariants[0], commonVariants[1]], addons: commonAddons,
  },
  {
    id: 'mi-003', name: 'Veg Spring Rolls', description: 'Crispy rolls with sweet chili dip',
    categoryId: 'cat-starters', price: 160, taxPercent: 5, sku: 'ST-003', foodType: 'veg',
    prepTimeMinutes: 12, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.3, variants: [commonVariants[0]], addons: commonAddons.slice(0, 2),
  },
  {
    id: 'mi-004', name: 'Tandoori Mushroom', description: 'Marinated mushrooms grilled to perfection',
    categoryId: 'cat-starters', price: 190, taxPercent: 5, sku: 'ST-004', foodType: 'veg',
    prepTimeMinutes: 14, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.4, variants: [commonVariants[0]], addons: commonAddons,
  },
  {
    id: 'mi-005', name: 'Chicken Lollipop', description: 'Crispy fried chicken drumettes',
    categoryId: 'cat-starters', price: 240, taxPercent: 5, sku: 'ST-005', foodType: 'non-veg',
    prepTimeMinutes: 16, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
    isAvailable: false, rating: 4.6, variants: [commonVariants[0]], addons: commonAddons.slice(0, 2),
  },
  // Main Course
  {
    id: 'mi-010', name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato-butter gravy',
    categoryId: 'cat-main', price: 280, taxPercent: 5, sku: 'MC-001', foodType: 'veg',
    prepTimeMinutes: 20, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.9, variants: [commonVariants[0], commonVariants[2]], addons: commonAddons,
  },
  {
    id: 'mi-011', name: 'Chicken Biryani', description: 'Fragrant basmati rice with tender chicken',
    categoryId: 'cat-main', price: 300, taxPercent: 5, sku: 'MC-002', foodType: 'non-veg',
    prepTimeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.8, variants: [commonVariants[0], commonVariants[1]], addons: commonAddons,
  },
  {
    id: 'mi-012', name: 'Butter Chicken', description: 'Creamy tomato gravy with tandoori chicken',
    categoryId: 'cat-main', price: 320, taxPercent: 5, sku: 'MC-003', foodType: 'non-veg',
    prepTimeMinutes: 22, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.9, variants: [commonVariants[0]], addons: commonAddons,
  },
  {
    id: 'mi-013', name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream',
    categoryId: 'cat-main', price: 220, taxPercent: 5, sku: 'MC-004', foodType: 'veg',
    prepTimeMinutes: 15, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.6, variants: [commonVariants[0]], addons: commonAddons,
  },
  {
    id: 'mi-014', name: 'Fish Curry', description: 'Coastal style fish in coconut gravy',
    categoryId: 'cat-main', price: 340, taxPercent: 5, sku: 'MC-005', foodType: 'non-veg',
    prepTimeMinutes: 25, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.5, variants: [commonVariants[0]], addons: commonAddons.slice(0, 2),
  },
  {
    id: 'mi-015', name: 'Palak Paneer', description: 'Cottage cheese in spiced spinach gravy',
    categoryId: 'cat-main', price: 260, taxPercent: 5, sku: 'MC-006', foodType: 'veg',
    prepTimeMinutes: 18, imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.5, variants: [commonVariants[0]], addons: commonAddons,
  },
  // Pizza
  {
    id: 'mi-020', name: 'Margherita Pizza', description: 'Classic tomato, mozzarella & basil',
    categoryId: 'cat-pizza', price: 299, taxPercent: 5, sku: 'PZ-001', foodType: 'veg',
    prepTimeMinutes: 20, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.7, variants: [commonVariants[0], commonVariants[1]], addons: commonAddons,
  },
  {
    id: 'mi-021', name: 'Pepperoni Pizza', description: 'Loaded with pepperoni & extra cheese',
    categoryId: 'cat-pizza', price: 399, taxPercent: 5, sku: 'PZ-002', foodType: 'non-veg',
    prepTimeMinutes: 22, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.8, variants: [commonVariants[0], commonVariants[1]], addons: commonAddons,
  },
  {
    id: 'mi-022', name: 'Veggie Supreme Pizza', description: 'Loaded with fresh vegetables',
    categoryId: 'cat-pizza', price: 349, taxPercent: 5, sku: 'PZ-003', foodType: 'veg',
    prepTimeMinutes: 22, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.5, variants: [commonVariants[0], commonVariants[1]], addons: commonAddons,
  },
  // Burgers
  {
    id: 'mi-030', name: 'Classic Cheese Burger', description: 'Beef patty, cheddar, lettuce & tomato',
    categoryId: 'cat-burgers', price: 249, taxPercent: 5, sku: 'BG-001', foodType: 'non-veg',
    prepTimeMinutes: 15, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.6, variants: [commonVariants[0]], addons: commonAddons,
  },
  {
    id: 'mi-031', name: 'Veggie Burger', description: 'Crispy veggie patty with special sauce',
    categoryId: 'cat-burgers', price: 199, taxPercent: 5, sku: 'BG-002', foodType: 'veg',
    prepTimeMinutes: 12, imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.3, variants: [commonVariants[0]], addons: commonAddons,
  },
  {
    id: 'mi-032', name: 'Crispy Chicken Burger', description: 'Crispy fried chicken fillet burger',
    categoryId: 'cat-burgers', price: 229, taxPercent: 5, sku: 'BG-003', foodType: 'non-veg',
    prepTimeMinutes: 14, imageUrl: 'https://images.unsplash.com/photo-1615297928064-24977384d0da?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.5, variants: [commonVariants[0]], addons: commonAddons,
  },
  // Beverages
  {
    id: 'mi-040', name: 'Mango Lassi', description: 'Creamy yogurt smoothie with mango',
    categoryId: 'cat-beverages', price: 120, taxPercent: 5, sku: 'BV-001', foodType: 'veg',
    prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.7, variants: [commonVariants[0], commonVariants[2]], addons: [],
  },
  {
    id: 'mi-041', name: 'Masala Chai', description: 'Spiced Indian tea with milk',
    categoryId: 'cat-beverages', price: 60, taxPercent: 5, sku: 'BV-002', foodType: 'veg',
    prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.8, variants: [commonVariants[0]], addons: [],
  },
  {
    id: 'mi-042', name: 'Fresh Lime Soda', description: 'Refreshing mint lime soda',
    categoryId: 'cat-beverages', price: 90, taxPercent: 5, sku: 'BV-003', foodType: 'veg',
    prepTimeMinutes: 3, imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.4, variants: [commonVariants[0]], addons: [],
  },
  {
    id: 'mi-043', name: 'Cold Coffee', description: 'Blended iced coffee with ice cream',
    categoryId: 'cat-beverages', price: 150, taxPercent: 5, sku: 'BV-004', foodType: 'veg',
    prepTimeMinutes: 6, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.6, variants: [commonVariants[0]], addons: [],
  },
  // Desserts
  {
    id: 'mi-050', name: 'Gulab Jamun', description: 'Warm milk dumplings in rose syrup',
    categoryId: 'cat-desserts', price: 120, taxPercent: 5, sku: 'DS-001', foodType: 'veg',
    prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1601303516534-bf0b1eb70dd0?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.8, variants: [commonVariants[0]], addons: [],
  },
  {
    id: 'mi-051', name: 'Chocolate Brownie', description: 'Warm brownie with vanilla ice cream',
    categoryId: 'cat-desserts', price: 180, taxPercent: 5, sku: 'DS-002', foodType: 'veg',
    prepTimeMinutes: 8, imageUrl: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    isAvailable: true, isBestSeller: true, rating: 4.9, variants: [commonVariants[0]], addons: commonAddons.slice(0, 1),
  },
  {
    id: 'mi-052', name: 'Rasmalai', description: 'Soft cheese patties in saffron milk',
    categoryId: 'cat-desserts', price: 140, taxPercent: 5, sku: 'DS-003', foodType: 'veg',
    prepTimeMinutes: 5, imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=300&fit=crop',
    isAvailable: true, rating: 4.7, variants: [commonVariants[0]], addons: [],
  },
]
