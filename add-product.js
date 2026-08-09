import { db } from "./firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", async () => {

    const code = document.getElementById("code").value.trim();
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const image = document.getElementById("image").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!code || !name || !price || !image) {
        alert("Please fill all required fields");
        return;
    }

    try {

        await addDoc(collection(db, "products"), {

            code: code,
            name: name,
            price: Number(price),
            image: image,
            description: description,
            createdAt: new Date()

        });

        alert("Product Saved Successfully");

        document.getElementById("code").value = "";
        document.getElementById("name").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";
        document.getElementById("description").value = "";

    } catch (error) {

        alert(error.message);

    }

});