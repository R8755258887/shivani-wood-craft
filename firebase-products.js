import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

export async function loadFirebaseProducts() {

  const products = [];

  // Code के हिसाब से Sort करेगा (P001 → P131)
  const q = query(
    collection(db, "products"),
    orderBy("code", "asc")
  );

  const querySnapshot = await getDocs(q);

  let index = 1;

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    products.push({

      id: index++,
      firebaseId: doc.id,

      code: data.code || "",
      name: data.name || "",
      price: Number(data.price) || 0,
      description: data.description || "",

      image: data.image
        ? `images/images/${data.image}`
        : "images/no-image.png",

      stock: "🟢 In Stock",
      delivery: "🚚 Free Delivery"

    });

  });

  return products;

}