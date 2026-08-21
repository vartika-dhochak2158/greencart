import croissant from "@/assets/p-croissant.jpg";
import strawberries from "@/assets/p-strawberries.jpg";
import avocado from "@/assets/p-avocado.jpg";
import sourdough from "@/assets/p-sourdough.jpg";
import coffee from "@/assets/p-coffee.jpg";
import burger from "@/assets/p-burger.jpg";
import milk from "@/assets/p-milk.jpg";
import broccoli from "@/assets/p-broccoli.jpg";
import salmon from "@/assets/p-salmon.jpg";

export type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  unit: string;
  calories: string;
  rating: number;
  eta: string;
  category: string;
  tags: string[];
  store: string;
  description: string;
  ingredients: string[];
  nutrition: { label: string; value: string }[];
};

export const categories = [
  { id: "fruits", label: "Fresh Fruits", emoji: "🍎" },
  { id: "veggies", label: "Organic Veggies", emoji: "🥦" },
  { id: "dairy", label: "Dairy & Milk", emoji: "🥛" },
  { id: "bakery", label: "Bakery & Pastry", emoji: "🍞" },
  { id: "meat", label: "Meat & Seafood", emoji: "🥩" },
  { id: "drinks", label: "Cold Drinks", emoji: "🥤" },
  { id: "meals", label: "Hot Meals", emoji: "🍲" },
];

export const dietaryTags = ["Vegan", "Gluten-free", "Organic", "Halal"];

export const products: Product[] = [
  {
    id: "croissant",
    name: "Butter Croissant",
    image: croissant,
    price: 3.49,
    oldPrice: 4.29,
    unit: "2 pcs · 90g",
    calories: "231 kcal",
    rating: 4.9,
    eta: "15-20 min",
    category: "bakery",
    tags: ["Bakery"],
    store: "Maison Bakehouse",
    description:
      "Flaky, all-butter croissants laminated over 24 hours and baked fresh every morning.",
    ingredients: ["French butter", "Wheat flour", "Sea salt", "Cane sugar", "Fresh yeast"],
    nutrition: [
      { label: "Calories", value: "231" },
      { label: "Protein", value: "5g" },
      { label: "Carbs", value: "26g" },
      { label: "Fat", value: "12g" },
    ],
  },
  {
    id: "strawberries",
    name: "Organic Strawberries",
    image: strawberries,
    price: 4.99,
    oldPrice: 6.25,
    unit: "500g punnet",
    calories: "32 kcal / 100g",
    rating: 4.8,
    eta: "15-20 min",
    category: "fruits",
    tags: ["Organic", "Vegan", "Gluten-free"],
    store: "Green Street Farms",
    description:
      "Hand-picked sun-ripened strawberries from local organic farms, packed within 12 hours of harvest.",
    ingredients: ["100% organic strawberries"],
    nutrition: [
      { label: "Calories", value: "32" },
      { label: "Protein", value: "0.7g" },
      { label: "Carbs", value: "7.7g" },
      { label: "Fiber", value: "2g" },
    ],
  },
  {
    id: "avocado",
    name: "Ripe Hass Avocados",
    image: avocado,
    price: 5.49,
    unit: "Pack of 3",
    calories: "160 kcal / 100g",
    rating: 4.7,
    eta: "20-25 min",
    category: "fruits",
    tags: ["Organic", "Vegan", "Gluten-free"],
    store: "Green Street Farms",
    description: "Creamy, perfectly ripe Hass avocados — ready to eat the day they arrive.",
    ingredients: ["Hass avocado"],
    nutrition: [
      { label: "Calories", value: "160" },
      { label: "Protein", value: "2g" },
      { label: "Carbs", value: "9g" },
      { label: "Fat", value: "15g" },
    ],
  },
  {
    id: "sourdough",
    name: "Artisanal Sourdough",
    image: sourdough,
    price: 6.2,
    oldPrice: 7.75,
    unit: "800g loaf",
    calories: "289 kcal / 100g",
    rating: 4.9,
    eta: "15-20 min",
    category: "bakery",
    tags: ["Organic"],
    store: "Maison Bakehouse",
    description: "Naturally leavened 36-hour sourdough with a crackling crust and open crumb.",
    ingredients: ["Stone-milled flour", "Water", "Sourdough starter", "Sea salt"],
    nutrition: [
      { label: "Calories", value: "289" },
      { label: "Protein", value: "9g" },
      { label: "Carbs", value: "56g" },
      { label: "Fat", value: "2g" },
    ],
  },
  {
    id: "coffee",
    name: "Artisan Coffee Latte",
    image: coffee,
    price: 4.25,
    unit: "12 oz cup",
    calories: "140 kcal",
    rating: 4.8,
    eta: "10-15 min",
    category: "drinks",
    tags: ["Halal"],
    store: "Ember Coffee Co.",
    description: "Single-origin espresso pulled fresh, poured over silky steamed milk.",
    ingredients: ["Espresso", "Whole milk", "Optional syrup"],
    nutrition: [
      { label: "Calories", value: "140" },
      { label: "Protein", value: "8g" },
      { label: "Carbs", value: "13g" },
      { label: "Fat", value: "6g" },
    ],
  },
  {
    id: "burger",
    name: "Classic Cheese Burger",
    image: burger,
    price: 9.9,
    oldPrice: 12.4,
    unit: "220g · single patty",
    calories: "620 kcal",
    rating: 4.6,
    eta: "25-30 min",
    category: "meals",
    tags: ["Halal"],
    store: "Patty & Bun",
    description: "Smashed grass-fed beef, aged cheddar, house pickles and secret sauce.",
    ingredients: ["Beef patty", "Aged cheddar", "Brioche bun", "Pickles", "House sauce"],
    nutrition: [
      { label: "Calories", value: "620" },
      { label: "Protein", value: "34g" },
      { label: "Carbs", value: "41g" },
      { label: "Fat", value: "35g" },
    ],
  },
  {
    id: "milk",
    name: "Fresh Dairy Milk",
    image: milk,
    price: 2.79,
    unit: "1 L bottle",
    calories: "61 kcal / 100ml",
    rating: 4.7,
    eta: "15-20 min",
    category: "dairy",
    tags: ["Organic", "Halal"],
    store: "Meadow Dairy",
    description: "Non-homogenised whole milk from pasture-raised cows, bottled daily in glass.",
    ingredients: ["Whole cow's milk"],
    nutrition: [
      { label: "Calories", value: "61" },
      { label: "Protein", value: "3.2g" },
      { label: "Carbs", value: "4.8g" },
      { label: "Fat", value: "3.3g" },
    ],
  },
  {
    id: "broccoli",
    name: "Organic Broccoli",
    image: broccoli,
    price: 3.15,
    oldPrice: 3.95,
    unit: "400g bunch",
    calories: "34 kcal / 100g",
    rating: 4.5,
    eta: "20-25 min",
    category: "veggies",
    tags: ["Organic", "Vegan", "Gluten-free"],
    store: "Green Street Farms",
    description: "Crisp, deep-green florets picked at dawn for maximum crunch.",
    ingredients: ["Organic broccoli"],
    nutrition: [
      { label: "Calories", value: "34" },
      { label: "Protein", value: "2.8g" },
      { label: "Carbs", value: "7g" },
      { label: "Fiber", value: "2.6g" },
    ],
  },
  {
    id: "salmon",
    name: "Atlantic Salmon Fillet",
    image: salmon,
    price: 12.4,
    unit: "300g · skin on",
    calories: "208 kcal / 100g",
    rating: 4.8,
    eta: "25-30 min",
    category: "meat",
    tags: ["Halal", "Gluten-free"],
    store: "Harbour Fish Market",
    description: "Sushi-grade fillet, line-caught and delivered on ice within 24 hours.",
    ingredients: ["Atlantic salmon"],
    nutrition: [
      { label: "Calories", value: "208" },
      { label: "Protein", value: "20g" },
      { label: "Carbs", value: "0g" },
      { label: "Fat", value: "13g" },
    ],
  },
];

export const addOnGroups = [
  {
    id: "size",
    title: "Choose size",
    type: "single" as const,
    options: [
      { id: "regular", label: "Regular", price: 0 },
      { id: "large", label: "Large", price: 1.5 },
      { id: "family", label: "Family pack", price: 3.2 },
    ],
  },
  {
    id: "extras",
    title: "Add extras",
    type: "multi" as const,
    options: [
      { id: "cheese", label: "Extra cheese", price: 1.0 },
      { id: "spicy", label: "Spicy level: hot 🌶️", price: 0 },
      { id: "sauce", label: "House dipping sauce", price: 0.8 },
    ],
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);

export const pastOrders = [
  {
    id: "GRO-8842",
    date: "Yesterday · 7:24 PM",
    items: "Butter Croissant, Artisan Coffee Latte",
    total: 11.24,
    status: "Delivered" as const,
  },
  {
    id: "GRO-8790",
    date: "Aug 14 · 1:02 PM",
    items: "Organic Strawberries, Fresh Dairy Milk, Broccoli",
    total: 21.68,
    status: "Delivered" as const,
  },
  {
    id: "GRO-8721",
    date: "Aug 09 · 8:15 PM",
    items: "Classic Cheese Burger x2",
    total: 19.8,
    status: "Cancelled" as const,
  },
];
