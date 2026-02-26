// src/firestore.js
// ─────────────────────────────────────────────────────────────────
// All Firestore read/write helpers for the AutoChina app.
// ─────────────────────────────────────────────────────────────────
import {
    collection, doc, getDocs, getDoc, setDoc, addDoc,
    updateDoc, deleteDoc, onSnapshot, serverTimestamp
} from "firebase/firestore";
import {
    ref, uploadString, getDownloadURL, deleteObject
} from "firebase/storage";
import { db, storage } from "./firebase";

// ─── COLLECTIONS ──────────────────────────────────────────────────
const COL = {
    vehicles: "vehicles",
    charging: "charging",
    parts: "parts",
    orders: "orders",
    inquiries: "inquiries",
    settings: "settings",
};

// ─── SETTINGS (single doc: settings/main) ─────────────────────────
export async function getSettings() {
    const snap = await getDoc(doc(db, COL.settings, "main"));
    return snap.exists() ? snap.data() : null;
}
export async function saveSettings(data) {
    await setDoc(doc(db, COL.settings, "main"), data, { merge: true });
}

// ─── VEHICLES ─────────────────────────────────────────────────────
export function onVehicles(cb) {
    return onSnapshot(collection(db, COL.vehicles), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}
export async function saveVehicle(vehicle) {
    if (vehicle.id && typeof vehicle.id === "string") {
        const { id, ...data } = vehicle;
        await setDoc(doc(db, COL.vehicles, id), data, { merge: true });
    } else {
        await addDoc(collection(db, COL.vehicles), vehicle);
    }
}
export async function deleteVehicle(id) {
    await deleteDoc(doc(db, COL.vehicles, id));
}

// ─── CHARGING ─────────────────────────────────────────────────────
export function onCharging(cb) {
    return onSnapshot(collection(db, COL.charging), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}
export async function saveCharger(charger) {
    if (charger.id && typeof charger.id === "string") {
        const { id, ...data } = charger;
        await setDoc(doc(db, COL.charging, id), data, { merge: true });
    } else {
        await addDoc(collection(db, COL.charging), charger);
    }
}
export async function deleteCharger(id) {
    await deleteDoc(doc(db, COL.charging, id));
}

// ─── PARTS ────────────────────────────────────────────────────────
export function onParts(cb) {
    return onSnapshot(collection(db, COL.parts), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}
export async function savePart(part) {
    if (part.id && typeof part.id === "string") {
        const { id, ...data } = part;
        await setDoc(doc(db, COL.parts, id), data, { merge: true });
    } else {
        await addDoc(collection(db, COL.parts), part);
    }
}
export async function deletePart(id) {
    await deleteDoc(doc(db, COL.parts, id));
}

// ─── ORDERS ───────────────────────────────────────────────────────
export function onOrders(cb) {
    return onSnapshot(collection(db, COL.orders), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}
export async function saveOrder(order) {
    if (order.id && typeof order.id === "string") {
        const { id, ...data } = order;
        await setDoc(doc(db, COL.orders, id), data, { merge: true });
    } else {
        await addDoc(collection(db, COL.orders), { ...order, createdAt: serverTimestamp() });
    }
}
export async function deleteOrder(id) {
    await deleteDoc(doc(db, COL.orders, id));
}

// ─── INQUIRIES ────────────────────────────────────────────────────
export function onInquiries(cb) {
    return onSnapshot(collection(db, COL.inquiries), (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
}
export async function addInquiry(data) {
    await addDoc(collection(db, COL.inquiries), {
        ...data,
        status: "new",
        date: new Date().toISOString().split("T")[0],
        createdAt: serverTimestamp(),
    });
}
export async function updateInquiryStatus(id, status) {
    await updateDoc(doc(db, COL.inquiries, id), { status });
}
export async function deleteInquiry(id) {
    await deleteDoc(doc(db, COL.inquiries, id));
}

// ─── STORAGE: Upload base64 image ─────────────────────────────────
// Returns a public download URL
export async function uploadImage(base64DataUrl, path) {
    const storageRef = ref(storage, path);
    await uploadString(storageRef, base64DataUrl, "data_url");
    return await getDownloadURL(storageRef);
}

// ─── SEED: Write default data to Firestore ────────────────────────
// Call this ONCE from the admin panel to initialise the database
export async function seedFirestore(VEHICLES0, CHARGING0, PARTS0, ORDERS0, SETTINGS0) {
    // Settings
    const { theme, ...settingsRest } = SETTINGS0;
    await setDoc(doc(db, COL.settings, "main"), settingsRest, { merge: true });

    // Vehicles
    for (const v of VEHICLES0) {
        const { id, ...data } = v;
        await setDoc(doc(db, COL.vehicles, String(id)), data);
    }
    // Charging
    for (const c of CHARGING0) {
        const { id, ...data } = c;
        await setDoc(doc(db, COL.charging, String(id)), data);
    }
    // Parts
    for (const p of PARTS0) {
        const { id, ...data } = p;
        await setDoc(doc(db, COL.parts, String(id)), data);
    }
    // Orders
    for (const o of ORDERS0) {
        const { id, ...data } = o;
        await setDoc(doc(db, COL.orders, String(id)), data);
    }

    console.log("✅ Firestore seeded successfully!");
}
