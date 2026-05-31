export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  type: "dine-in" | "takeaway" | "delivery";
  time: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  emoji: string;
  available: boolean;
  orders: number;
}

export const ORDERS: Order[] = [
  { id: "ORD-001", customer: "Arun Kumar",    phone: "9876543210", items: [{ name: "Paneer Tikka", qty: 2, price: 180 }, { name: "Masala Tea", qty: 2, price: 30 }],  total: 420, status: "preparing",  type: "dine-in",  time: "12:35 PM" },
  { id: "ORD-002", customer: "Priya S",        phone: "9123456780", items: [{ name: "Pani Puri",    qty: 1, price: 60  }, { name: "Samosa",     qty: 4, price: 40 }],  total: 220, status: "pending",    type: "takeaway", time: "12:41 PM" },
  { id: "ORD-003", customer: "Ramesh M",       phone: "9988776655", items: [{ name: "Gobi 65",      qty: 1, price: 130 }, { name: "Veg Burger", qty: 2, price: 120 }], total: 370, status: "ready",      type: "delivery", time: "12:18 PM" },
  { id: "ORD-004", customer: "Kavitha R",      phone: "9001122334", items: [{ name: "Pav Bhaji",    qty: 2, price: 120 }, { name: "Cold Coffee", qty: 2, price: 80 }],  total: 400, status: "delivered",  type: "dine-in",  time: "11:55 AM" },
  { id: "ORD-005", customer: "Suresh T",       phone: "9345678901", items: [{ name: "Crispy Corn",  qty: 2, price: 120 }, { name: "Mojito",     qty: 2, price: 90 }],   total: 420, status: "cancelled",  type: "takeaway", time: "11:30 AM" },
  { id: "ORD-006", customer: "Meena D",        phone: "9456712345", items: [{ name: "BBQ Fries",    qty: 1, price: 160 }, { name: "Cheese Balls", qty: 1, price: 150 }], total: 310, status: "preparing",  type: "delivery", time: "12:50 PM" },
  { id: "ORD-007", customer: "Vijay K",        phone: "9234567891", items: [{ name: "Malai Tikka",  qty: 2, price: 200 }, { name: "Masala Tea", qty: 3, price: 30 }],   total: 490, status: "pending",    type: "dine-in",  time: "1:02 PM"  },
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 1,  name: "Paneer Tikka",        category: "Veg Snacks", price: 180, emoji: "🧀", available: true,  orders: 142 },
  { id: 2,  name: "Gobi 65",             category: "Veg Snacks", price: 130, emoji: "🥦", available: true,  orders: 98  },
  { id: 3,  name: "Crispy Corn",         category: "Veg Snacks", price: 120, emoji: "🌽", available: true,  orders: 87  },
  { id: 4,  name: "Chilli Paneer",       category: "Veg Snacks", price: 160, emoji: "🌶️", available: true,  orders: 115 },
  { id: 5,  name: "Samosa",              category: "Tea-Time",   price: 40,  emoji: "🔺", available: true,  orders: 204 },
  { id: 6,  name: "Pani Puri",           category: "Tea-Time",   price: 60,  emoji: "💧", available: true,  orders: 198 },
  { id: 7,  name: "Pav Bhaji",           category: "Tea-Time",   price: 120, emoji: "🍞", available: true,  orders: 76  },
  { id: 8,  name: "Masala Tea",          category: "Beverages",  price: 30,  emoji: "☕", available: true,  orders: 312 },
  { id: 9,  name: "Cold Coffee",         category: "Beverages",  price: 80,  emoji: "☕", available: true,  orders: 134 },
  { id: 10, name: "Malai Paneer Tikka",  category: "BBQ & Grill",price: 200, emoji: "🍢", available: true,  orders: 89  },
  { id: 11, name: "Afghani Chaap",       category: "BBQ & Grill",price: 190, emoji: "🔥", available: false, orders: 54  },
  { id: 12, name: "Veg Burger",          category: "Fast Food",  price: 120, emoji: "🍔", available: true,  orders: 103 },
  { id: 13, name: "Garlic Momos",        category: "Fast Food",  price: 120, emoji: "🥟", available: true,  orders: 67  },
  { id: 14, name: "BBQ Loaded Fries",    category: "Café Style", price: 160, emoji: "🍟", available: true,  orders: 91  },
  { id: 15, name: "Korean Corn Dogs",    category: "Café Style", price: 160, emoji: "🌭", available: false, orders: 43  },
];

export const STATS = {
  todayOrders:   38,
  todayRevenue:  14820,
  pendingOrders: 7,
  menuItems:     MENU_ITEMS.length,
  topItem:       "Masala Tea",
  avgOrderValue: 390,
};
