import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const table = document.getElementById("ordersTable");
const searchOrder = document.getElementById("searchOrder");
const statusFilter = document.getElementById("statusFilter");

let orders = [];

async function loadOrders(){

    table.innerHTML =
    `<tr>
        <td colspan="7">Loading...</td>
    </tr>`;

    try{

        const q = query(
            collection(db,"orders"),
            orderBy("createdAt","desc")
        );

        const snapshot = await getDocs(q);

        orders = [];

        snapshot.forEach(doc=>{

            orders.push({
                id:doc.id,
                ...doc.data()
            });

        });

        renderOrders(orders);

    }catch(error){

        console.error(error);

        table.innerHTML =
        `<tr>
            <td colspan="7">
                No Orders Found
            </td>
        </tr>`;

    }

}

function renderOrders(list){

    if(list.length===0){

        table.innerHTML =
        `<tr>
            <td colspan="7">
                No Orders Available
            </td>
        </tr>`;

        return;

    }

    table.innerHTML="";

    list.forEach(order=>{

        table.innerHTML += `

<tr>

<td>${order.orderId || "-"}</td>

<td>${order.date || "-"}</td>

<td>${order.customerName || "-"}</td>

<td>${order.mobile || "-"}</td>

<td>₹${order.total || 0}</td>

<td>
<span class="status ${(order.status || "Pending").toLowerCase()}">
${order.status || "Pending"}
</span>
</td>

<td>

<button
class="viewBtn"
onclick="viewOrder('${order.id}')">

View

</button>

</td>

</tr>

`;

    });

}

searchOrder.addEventListener("keyup",()=>{

    filterOrders();

});

statusFilter.addEventListener("change",()=>{

    filterOrders();

});

function filterOrders(){

    const text = searchOrder.value.toLowerCase();
    const status = statusFilter.value;

    const result = orders.filter(order=>{

        const matchSearch =

            (order.customerName || "")
            .toLowerCase()
            .includes(text)

            ||

            (order.mobile || "")
            .toLowerCase()
            .includes(text)

            ||

            (order.orderId || "")
            .toLowerCase()
            .includes(text);

    return matchSearch;

});

let filtered = result;

switch(status){

    case "pending":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "pending");
        break;

    case "confirmed":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "confirmed");
        break;

    case "packed":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "packed");
        break;

    case "shipped":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "shipped");
        break;

    case "delivered":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "delivered");
        break;

    case "cancelled":
        filtered = result.filter(order => (order.status || "").toLowerCase() === "cancelled");
        break;

    case "az":
        filtered = [...result].sort((a,b)=>
            (a.customerName || "").localeCompare(b.customerName || "")
        );
        break;

    case "za":
        filtered = [...result].sort((a,b)=>
            (b.customerName || "").localeCompare(a.customerName || "")
        );
        break;
}

renderOrders(filtered);

}

window.viewOrder = function(id){

    window.location.href = `view-order.html?id=${id}`;

}

loadOrders();