import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  onSnapshot, getDocs, writeBatch, serverTimestamp,
  query, orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
export type OrderType   = "dine-in" | "takeaway" | "delivery";

export interface OrderItem {
  name:  string;
  qty:   number;
  price: number;
}

export interface Order {
  id:        string;
  customer:  string;
  phone:     string;
  items:     OrderItem[];
  total:     number;
  status:    OrderStatus;
  type:      OrderType;
  time:      string;
  createdAt?: unknown;
}

export type NewOrder = Omit<Order, "id" | "createdAt">;

const COL = "orders";

/* ── Real-time listener ──────────────────────────────────── */
export function subscribeOrders(cb: (orders: Order[]) => void): Unsubscribe {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
  });
}

/* ── Add order ───────────────────────────────────────────── */
export async function addOrder(order: NewOrder): Promise<void> {
  await addDoc(collection(db, COL), { ...order, createdAt: serverTimestamp() });
}

/* ── Update status ───────────────────────────────────────── */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status });
}

/* ── Delete order ────────────────────────────────────────── */
export async function deleteOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

/* ── Seed sample orders if collection is empty ───────────── */
const SEED_ORDERS: NewOrder[] = [
  {
    customer: "Arun Kumar", phone: "9876543210", type: "dine-in",
    status: "preparing", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    items: [{ name: "Paneer Tikka", qty: 2, price: 180 }, { name: "Masala Tea", qty: 2, price: 30 }],
    total: 420,
  },
  {
    customer: "Priya S", phone: "9123456780", type: "takeaway",
    status: "pending", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    items: [{ name: "Pani Puri", qty: 1, price: 60 }, { name: "Samosa", qty: 4, price: 40 }],
    total: 220,
  },
  {
    customer: "Ramesh M", phone: "9988776655", type: "delivery",
    status: "ready", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    items: [{ name: "Gobi 65", qty: 1, price: 130 }, { name: "Veg Burger", qty: 2, price: 120 }],
    total: 370,
  },
  {
    customer: "Kavitha R", phone: "9001122334", type: "dine-in",
    status: "delivered", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    items: [{ name: "Pav Bhaji", qty: 2, price: 120 }, { name: "Cold Coffee", qty: 2, price: 80 }],
    total: 400,
  },
];

export async function seedOrdersIfEmpty(): Promise<void> {
  const snap = await getDocs(collection(db, COL));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  SEED_ORDERS.forEach((o) => {
    batch.set(doc(collection(db, COL)), { ...o, createdAt: serverTimestamp() });
  });
  await batch.commit();
}
