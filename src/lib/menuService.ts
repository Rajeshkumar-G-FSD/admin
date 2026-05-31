import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  onSnapshot, getDocs, writeBatch, serverTimestamp,
  query, orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  available: boolean;
  orders: number;
  createdAt?: unknown;
}

export type NewMenuItem = Omit<MenuItem, "id" | "createdAt">;

const COL = "menuItems";

// ── Real-time listener ────────────────────────────────────────
export function subscribeMenuItems(
  callback: (items: MenuItem[]) => void
): Unsubscribe {
  const q = query(collection(db, COL), orderBy("category"), orderBy("name"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MenuItem));
    callback(items);
  });
}

// ── Add new item ──────────────────────────────────────────────
export async function addMenuItem(item: NewMenuItem): Promise<void> {
  await addDoc(collection(db, COL), { ...item, createdAt: serverTimestamp() });
}

// ── Toggle availability ───────────────────────────────────────
export async function toggleAvailability(id: string, available: boolean): Promise<void> {
  await updateDoc(doc(db, COL, id), { available });
}

// ── Update price ──────────────────────────────────────────────
export async function updatePrice(id: string, price: number): Promise<void> {
  await updateDoc(doc(db, COL, id), { price });
}

// ── Delete item ───────────────────────────────────────────────
export async function deleteMenuItem(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ── Seed initial data if collection is empty ──────────────────
const SEED: NewMenuItem[] = [
  { name: "Paneer Tikka",        category: "Veg Snacks",  price: 180, emoji: "🧀", available: true,  orders: 142 },
  { name: "Gobi 65",             category: "Veg Snacks",  price: 130, emoji: "🥦", available: true,  orders: 98  },
  { name: "Crispy Corn",         category: "Veg Snacks",  price: 120, emoji: "🌽", available: true,  orders: 87  },
  { name: "Chilli Paneer",       category: "Veg Snacks",  price: 160, emoji: "🌶️", available: true,  orders: 115 },
  { name: "Aloo Tikki",          category: "Veg Snacks",  price: 100, emoji: "🥔", available: true,  orders: 60  },
  { name: "Masala Fries",        category: "Veg Snacks",  price: 120, emoji: "🍟", available: true,  orders: 76  },
  { name: "Cheese Garlic Bread", category: "Veg Snacks",  price: 140, emoji: "🧄", available: true,  orders: 54  },
  { name: "Paneer Burger",       category: "Veg Snacks",  price: 140, emoji: "🍔", available: true,  orders: 103 },
  { name: "Loaded Sandwich",     category: "Veg Snacks",  price: 130, emoji: "🥪", available: true,  orders: 89  },
  { name: "Samosa",              category: "Tea-Time",    price: 40,  emoji: "🔺", available: true,  orders: 204 },
  { name: "Pani Puri",           category: "Tea-Time",    price: 60,  emoji: "💧", available: true,  orders: 198 },
  { name: "Pav Bhaji",           category: "Tea-Time",    price: 120, emoji: "🍞", available: true,  orders: 76  },
  { name: "Vada Pav",            category: "Tea-Time",    price: 50,  emoji: "🍔", available: true,  orders: 65  },
  { name: "Dahi Puri",           category: "Tea-Time",    price: 80,  emoji: "🫙", available: true,  orders: 88  },
  { name: "Garlic Momos",        category: "Fast Food",   price: 120, emoji: "🥟", available: true,  orders: 67  },
  { name: "Veg Burger",          category: "Fast Food",   price: 120, emoji: "🍔", available: true,  orders: 91  },
  { name: "Pizza Slices",        category: "Fast Food",   price: 150, emoji: "🍕", available: true,  orders: 48  },
  { name: "Loaded Nachos",       category: "Café Style",  price: 180, emoji: "🧀", available: true,  orders: 72  },
  { name: "BBQ Loaded Fries",    category: "Café Style",  price: 160, emoji: "🍟", available: true,  orders: 91  },
  { name: "Korean Corn Dogs",    category: "Café Style",  price: 160, emoji: "🌭", available: false, orders: 43  },
  { name: "Masala Tea",          category: "Beverages",   price: 30,  emoji: "☕", available: true,  orders: 312 },
  { name: "Cold Coffee",         category: "Beverages",   price: 80,  emoji: "☕", available: true,  orders: 134 },
  { name: "Fresh Lime Soda",     category: "Beverages",   price: 60,  emoji: "🍋", available: true,  orders: 98  },
  { name: "Mojito",              category: "Beverages",   price: 90,  emoji: "🍃", available: true,  orders: 77  },
];

export async function seedIfEmpty(): Promise<void> {
  const snap = await getDocs(collection(db, COL));
  if (!snap.empty) return;

  const batch = writeBatch(db);
  SEED.forEach((item) => {
    const ref = doc(collection(db, COL));
    batch.set(ref, { ...item, createdAt: serverTimestamp() });
  });
  await batch.commit();
}
