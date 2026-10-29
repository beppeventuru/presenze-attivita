import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBw5tSSf6t2LsMNzfDly-Ae53cI0VVepdY",
  authDomain: "presenze-attivita.firebaseapp.com",
  projectId: "presenze-attivita",
  storageBucket: "presenze-attivita.firebasestorage.app",
  messagingSenderId: "855972123503",
  appId: "1:855972123503:web:d8614c0306c73c1264ce9a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const LOCAL_KEY = "presenze-attivita-v1";
const button = document.querySelector("#syncBtn");
const status = document.querySelector("#syncStatus");
let currentRef = null;
let unsubscribe = null;
let pendingEvents = null;
let writing = false;
let currentUser = null;

function localEvents() {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]"); }
  catch { return []; }
}
function show(message, connected = false) {
  if (status) status.textContent = message;
  if (button) {
    button.textContent = connected ? "Disconnetti" : "Sincronizza dispositivi";
    button.setAttribute("aria-label", connected ? "Disconnetti dalla sincronizzazione" : "Accedi con Google e sincronizza i dispositivi");
  }
  document.dispatchEvent(new CustomEvent("attendance:sync-status", { detail: { message, connected } }));
}
function applyRemote(events) {
  const safeEvents = Array.isArray(events) ? events : [];
  localStorage.setItem(LOCAL_KEY, JSON.stringify(safeEvents));
  document.dispatchEvent(new CustomEvent("attendance:remote-data", { detail: { events: safeEvents } }));
}
async function flush() {
  if (writing || !currentRef || !pendingEvents || !currentUser) return;
  if (!navigator.onLine) {
    show("Modifiche salvate qui; sincronizzazione in attesa di connessione.", true);
    return;
  }
  writing = true;
  try {
    while (pendingEvents && currentRef && currentUser) {
      const next = pendingEvents;
      pendingEvents = null;
      await setDoc(currentRef, { events: next, updatedAt: serverTimestamp() });
    }
    show("Sincronizzato tra i dispositivi.", true);
  } catch (error) {
    if (!pendingEvents) pendingEvents = localEvents();
    show("Sincronizzazione in attesa: " + (error.message || "controlla la connessione"), true);
  } finally {
    writing = false;
  }
}
function queue(events) {
  pendingEvents = Array.isArray(events) ? events : [];
  flush();
}
document.addEventListener("attendance:data-changed", event => queue(event.detail?.events));
window.addEventListener("online", () => flush());

if (button) button.addEventListener("click", async () => {
  if (currentUser) {
    try { await signOut(auth); }
    catch (error) { show("Disconnessione non riuscita: " + error.message, true); }
    return;
  }
  button.disabled = true;
  show("Apro l’accesso Google…");
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  } catch (error) {
    const message = error.code === "auth/unauthorized-domain"
      ? "Dominio non autorizzato in Firebase Authentication."
      : error.code === "auth/popup-blocked"
        ? "Popup bloccato: consenti il popup e riprova."
        : error.message || "Accesso non completato.";
    show("Accesso non riuscito: " + message);
  } finally {
    button.disabled = false;
  }
});

onAuthStateChanged(auth, async user => {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  currentUser = user || null;
  currentRef = null;
  pendingEvents = null;
  if (!user) {
    show("Sincronizzazione non attiva su questo dispositivo.");
    return;
  }
  show("Collego " + (user.email || "il tuo account Google") + "…");
  currentRef = doc(db, "users", user.uid, "state", "attendance");
  try {
    const snapshot = await getDoc(currentRef);
    const local = localEvents();
    let initial;
    if (snapshot.exists()) {
      const remote = Array.isArray(snapshot.data().events) ? snapshot.data().events : [];
      const remoteIds = new Set(remote.map(item => item.id));
      initial = remote.concat(local.filter(item => !remoteIds.has(item.id)));
    } else {
      initial = local;
    }
    applyRemote(initial);
    await setDoc(currentRef, { events: initial, updatedAt: serverTimestamp() });
    show("Sincronizzato come " + (user.email || "account Google") + ".", true);
    unsubscribe = onSnapshot(currentRef, snap => {
      if (!snap.exists() || snap.metadata.hasPendingWrites || pendingEvents) return;
      const cloudEvents = snap.data().events;
      if (Array.isArray(cloudEvents)) applyRemote(cloudEvents);
      show("Sincronizzato come " + (user.email || "account Google") + ".", true);
    }, error => show("Sincronizzazione in attesa: " + error.message, true));
  } catch (error) {
    show("Sincronizzazione non riuscita: " + (error.message || "errore di connessione"), true);
  }
});