import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Las llaves de tu NUEVA tienda
const firebaseConfig = {
  apiKey: "AIzaSyCS70cSodmZAbEcs-IxKkVhwHx2ouzW75w",
  authDomain: "tiendaphonecases.firebaseapp.com",
  projectId: "tiendaphonecases",
  storageBucket: "tiendaphonecases.firebasestorage.app",
  messagingSenderId: "284074647224",
  appId: "1:284074647224:web:13906973ec3981db599e4d"
};

// 1. Inicializamos Firebase con tus llaves
const app = initializeApp(firebaseConfig);

// 2. Encendemos la base de datos y la exportamos
export const db = getFirestore(app);