import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const table = document.getElementById("productTable");
const searchBox = document.getElementById("searchBox");

let products = [];

async function loadProducts() {

    table.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

    const q = query(
        collection(db, "products"),
        orderBy("code", "asc")
    );

    const snapshot = await getDocs(q);

    products = [];

    snapshot.forEach((item) => {

        products.push({
            id: item.id,
            ...item.data()
        });

    });

    renderProducts(products);

}

function renderProducts(list) {

    table.innerHTML = "";

    list.forEach(product => {

        table.innerHTML += `

<tr>

<td>
<img
src="${product.image}"
width="70"
alt="${product.name}">
</td>

<td>${product.code}</td>

<td>${product.name}</td>

<td>₹${product.price}</td>

<td>

<button
class="editBtn"
onclick="editProduct('${product.id}')">
✏️ Edit
</button>

<button
class="deleteBtn"
onclick="deleteProduct('${product.id}')">
🗑 Delete
</button>

</td>

</tr>

`;

    });

}

searchBox.addEventListener("keyup", function () {

    const text = this.value.toLowerCase();

    const result = products.filter(product =>

        product.name.toLowerCase().includes(text) ||
        product.code.toLowerCase().includes(text)

    );

    renderProducts(result);

});

window.deleteProduct = async function(id){

    if(!confirm("Delete this product?"))
        return;

    await deleteDoc(doc(db,"products",id));

    alert("Product Deleted");

    loadProducts();

}

window.editProduct = function(id){

    window.location.href =
        "edit-product.html?id=" + id;

}

loadProducts();