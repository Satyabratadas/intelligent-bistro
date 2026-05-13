const menu = [
  // Starters
  {
    id: "s1",
    name: "Garlic Bread",
    category: "starters",
    price: 4.99,
    description: "Toasted sourdough with roasted garlic butter and fresh herbs",
    tags: ["vegetarian"],
  },
  {
    id: "s2",
    name: "Crispy Calamari",
    category: "starters",
    price: 8.99,
    description: "Lightly battered squid rings with lemon aioli dipping sauce",
    tags: [],
  },
  {
    id: "s3",
    name: "Bruschetta",
    category: "starters",
    price: 6.99,
    description: "Grilled bread topped with diced tomatoes, basil, and balsamic glaze",
    tags: ["vegetarian", "vegan"],
  },

  // Mains
  {
    id: "m1",
    name: "Spicy Chicken Sandwich",
    category: "mains",
    price: 13.99,
    description: "Crispy fried chicken thigh with sriracha slaw, pickles, and brioche bun",
    tags: ["spicy"],
  },
  {
    id: "m2",
    name: "Classic Beef Burger",
    category: "mains",
    price: 14.99,
    description: "8oz beef patty, cheddar, lettuce, tomato, house sauce on a brioche bun",
    tags: [],
  },
  {
    id: "m3",
    name: "Grilled Salmon",
    category: "mains",
    price: 18.99,
    description: "Atlantic salmon fillet with lemon butter, asparagus, and roasted potatoes",
    tags: ["gluten-free"],
  },
  {
    id: "m4",
    name: "Mushroom Risotto",
    category: "mains",
    price: 15.99,
    description: "Arborio rice with wild mushrooms, parmesan, truffle oil, and fresh thyme",
    tags: ["vegetarian", "gluten-free"],
  },
  {
    id: "m5",
    name: "BBQ Ribs",
    category: "mains",
    price: 22.99,
    description: "Full rack of slow-cooked pork ribs with smoky BBQ glaze and fries",
    tags: [],
  },

  // Sides
  {
    id: "si1",
    name: "Truffle Fries",
    category: "sides",
    price: 5.99,
    description: "Crispy fries tossed in truffle oil with parmesan and parsley",
    tags: ["vegetarian"],
  },
  {
    id: "si2",
    name: "Garden Salad",
    category: "sides",
    price: 4.99,
    description: "Mixed greens, cherry tomatoes, cucumber, and house vinaigrette",
    tags: ["vegetarian", "vegan", "gluten-free"],
  },
  {
    id: "si3",
    name: "Coleslaw",
    category: "sides",
    price: 3.49,
    description: "Creamy homemade coleslaw with shredded cabbage and carrots",
    tags: ["vegetarian"],
  },

  // Drinks
  {
    id: "d1",
    name: "Still Water",
    category: "drinks",
    price: 1.99,
    description: "500ml still mineral water",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "d2",
    name: "Sparkling Water",
    category: "drinks",
    price: 1.99,
    description: "500ml sparkling mineral water",
    tags: ["vegan", "gluten-free"],
  },
  {
    id: "d3",
    name: "Fresh Lemonade",
    category: "drinks",
    price: 3.99,
    description: "Freshly squeezed lemonade with mint and a hint of ginger",
    tags: ["vegetarian", "vegan"],
  },
  {
    id: "d4",
    name: "Craft Cola",
    category: "drinks",
    price: 2.99,
    description: "Small-batch artisan cola with natural vanilla and spice",
    tags: ["vegan"],
  },
  {
    id: "d5",
    name: "Mango Smoothie",
    category: "drinks",
    price: 4.99,
    description: "Blended mango, pineapple, coconut milk and ice",
    tags: ["vegan", "gluten-free"],
  },

  // Desserts
  {
    id: "de1",
    name: "Chocolate Lava Cake",
    category: "desserts",
    price: 7.99,
    description: "Warm dark chocolate cake with a molten centre, served with vanilla ice cream",
    tags: ["vegetarian"],
  },
  {
    id: "de2",
    name: "Cheesecake",
    category: "desserts",
    price: 6.99,
    description: "New York-style baked cheesecake with berry compote",
    tags: ["vegetarian"],
  },
];

module.exports = menu;