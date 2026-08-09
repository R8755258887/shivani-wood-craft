import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const orderDetails = document.getElementById("orderDetails");

async function loadOrder() {

    if (!orderId) {

        orderDetails.innerHTML = "<h2>Order Not Found</h2>";
        return;

    }

    try {

        const ref = doc(db, "orders", orderId);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            orderDetails.innerHTML = "<h2>Order Not Found</h2>";
            return;

        }

        const order = snap.data();

        let itemsHTML = "";

        order.items.forEach(item => {

            itemsHTML += `

<tr>

<td>

<img
class="product-img"
src="${item.image}"
alt="${item.name}"
onerror="this.src='logo.png';">

</td>

<td>${item.code}</td>

<td>

<b>${item.name}</b>

<br><br>

<span class="stock">
${item.stock || ""}
</span>

<br>

<span class="delivery">
${item.delivery || ""}
</span>

</td>

<td>${item.qty}</td>

<td>₹${item.price}</td>

<td><b>₹${item.price * item.qty}</b></td>

</tr>

`;

        });

        orderDetails.innerHTML = `
        <div class="card">

<h2>Customer Details</h2>

<div class="info"><b>Order ID :</b> ${order.orderId}</div>

<div class="info"><b>Date :</b> ${order.date}</div>

<div class="info"><b>Name :</b> ${order.customerName}</div>

<div class="info"><b>Mobile :</b> ${order.mobile}</div>

<div class="info"><b>Address :</b> ${order.address}</div>

<div style="margin-top:20px;">

<label><b>Order Status</b></label>

<br><br>

<select
id="orderStatus"
style="
padding:12px;
width:250px;
border-radius:8px;
font-size:16px;">

<option ${order.status=="Pending"?"selected":""}>Pending</option>

<option ${order.status=="Packed"?"selected":""}>Packed</option>

<option ${order.status=="Shipped"?"selected":""}>Shipped</option>

<option ${order.status=="Delivered"?"selected":""}>Delivered</option>

<option ${order.status=="Cancelled"?"selected":""}>Cancelled</option>

</select>

<br><br>

<button
class="backBtn"
onclick="updateStatus()">

💾 Update Status

</button>

</div>

</div>

<div class="card">

<h2>Products</h2>

<table>

<thead>

<tr>

<th>Image</th>

<th>Code</th>

<th>Product Details</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${itemsHTML}

</tbody>

</table>

<div class="total">

Grand Total : ₹${order.total}

</div>

<button
class="backBtn"
onclick="printInvoice()">

🖨️ Print Invoice

</button>

<button
class="backBtn"
onclick="history.back()">

← Back

</button>

</div>

`;

    } catch (error) {

        console.error(error);

        orderDetails.innerHTML = `
        <div class="card">
            <h2>❌ Something went wrong.</h2>
            <p>${error.message}</p>
        </div>
        `;

    }

}

window.updateStatus = async function () {

    try {

        const status =
        document.getElementById("orderStatus").value;

        const orderRef = doc(db, "orders", orderId);

        const orderSnap = await getDoc(orderRef);

        const order = orderSnap.data();

        // अगर पहली बार Delivered किया जा रहा है
        if (status === "Delivered" && order.status !== "Delivered") {

            for (const item of order.items) {

                if (!item.firebaseId) continue;

                const productRef = doc(db, "products", item.firebaseId);

                const productSnap = await getDoc(productRef);

                if (!productSnap.exists()) continue;

                const product = productSnap.data();

                const currentStock = Number(product.stock || 0);

                const qty = Number(item.qty || 0);

                const newStock = Math.max(currentStock - qty, 0);

                await updateDoc(productRef, {
                    stock: newStock
                });

            }

        }

        await updateDoc(orderRef, {
            status: status
        });

        alert("✅ Order Status Updated Successfully.");

        loadOrder();

    } catch (error) {

        console.error(error);

        alert("❌ Status Update Failed.");

    }

};
loadOrder();
window.printInvoice = function(){

    window.open(
        `invoice.html?id=${orderId}`,
        "_blank"
    );

}