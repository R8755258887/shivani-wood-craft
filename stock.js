import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const stockTable = document.getElementById("stockTable");

window.loadStock = async function () {

    stockTable.innerHTML = "";

    const snapshot = await getDocs(collection(db, "products"));

    snapshot.forEach((item) => {

        const product = item.data();

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>
                <img class="product-img"
                src="${product.image}"
                alt="">
            </td>

            <td>${product.code}</td>

            <td>${product.name}</td>

            <td>₹${product.price}</td>

            <td>
                <input
                type="number"
                class="stock-input"
                id="stock-${item.id}"
                value="${product.stock || 0}">
            </td>

            <td>

                <button
                class="save-btn"
                onclick="saveStock('${item.id}')">

                Save

                </button>

            </td>

        `;

        if ((product.stock || 0) <= 5) {

            tr.classList.add("low-stock");

        }

        stockTable.appendChild(tr);

    });

};

window.saveStock = async function (id) {

    const stock = Number(document.getElementById(`stock-${id}`).value);

    await updateDoc(doc(db, "products", id), {

        stock: stock

    });

    alert("Stock Updated Successfully");

    loadStock();

};

loadStock();