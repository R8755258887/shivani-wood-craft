import { db } from "./firebase.js";

import {
doc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

const invoice = document.getElementById("invoice");

function numberToWords(num){

const ones=[
"",
"One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
"Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen",
"Sixteen","Seventeen","Eighteen","Nineteen"
];

const tens=[
"",
"",
"Twenty","Thirty","Forty","Fifty",
"Sixty","Seventy","Eighty","Ninety"
];

function convert(n){

if(n<20) return ones[n];

if(n<100){

return tens[Math.floor(n/10)] +
(n%10 ? " "+ones[n%10] : "");

}

if(n<1000){

return ones[Math.floor(n/100)] +
" Hundred" +
(n%100 ? " "+convert(n%100) : "");

}

if(n<100000){

return convert(Math.floor(n/1000)) +
" Thousand" +
(n%1000 ? " "+convert(n%1000) : "");

}

if(n<10000000){

return convert(Math.floor(n/100000)) +
" Lakh" +
(n%100000 ? " "+convert(n%100000) : "");

}

return convert(Math.floor(n/10000000)) +
" Crore" +
(n%10000000 ? " "+convert(n%10000000) : "");

}

return convert(Number(num)) + " Rupees Only";

}

async function loadInvoice(){

if(!orderId){

invoice.innerHTML="<h2>Invoice Not Found</h2>";

return;

}

const snap=await getDoc(doc(db,"orders",orderId));

if(!snap.exists()){

invoice.innerHTML="<h2>Invoice Not Found</h2>";

return;

}

const order=snap.data();

let rows="";

let sr=1;
order.items.forEach(item=>{

rows += `

<tr>

<td>${sr++}</td>

<td>

<img
class="product-img"
src="${item.image}"
onerror="this.src='images/logo.png'">

</td>

<td>${item.code}</td>

<td>${item.name}</td>

<td>${item.qty}</td>

<td>₹${item.price}</td>

<td>₹${item.qty * item.price}</td>

</tr>

`;

});

const totalQty = order.items.reduce(
(sum,item)=>sum + Number(item.qty),0
);

invoice.innerHTML = `

<div class="invoice">

<div class="header">

<div class="company">

<img src="images/logo.png">

<div>

<h1>SHIVANI WOOD CRAFT</h1>

<p>Premium Wooden MDF Products</p>

<p><b>Address :</b> Delhi, India</p>

<p><b>Mobile :</b> +91 XXXXXXXXXX</p>

<p><b>Email :</b> info@shivaniwoodcraft.com</p>

<p><b>Website :</b> www.shivaniwoodcraft.com</p>

<p><b>GSTIN :</b> XXXXXXXXXXXXXXX</p>

</div>

</div>

<div class="invoice-title">

<h2>INVOICE</h2>

<p><b>Invoice No :</b> ${order.orderId}</p>

<p><b>Date :</b> ${order.date}</p>

<p><b>Status :</b> ${order.status}</p>

</div>

</div>

<div class="info">

<div class="box">

<h3>Customer Details</h3>

<p><b>Name :</b> ${order.customerName}</p>

<p><b>Mobile :</b> ${order.mobile}</p>

<p><b>Address :</b> ${order.address}</p>

</div>

<div class="box">

<h3>Invoice Details</h3>

<p><b>Total Items :</b> ${order.items.length}</p>

<p><b>Total Qty :</b> ${totalQty}</p>

<p><b>Payment :</b> Pending</p>

</div>

</div>

<table>

<thead>

<tr>

<th>S.No.</th>

<th>Image</th>

<th>Code</th>

<th>Product</th>

<th>Qty</th>

<th>Price</th>

<th>Total</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>
<div class="total">

<div class="summary-row">

<p><b>Total Qty :</b> ${totalQty}</p>

<p><b>Amount in Words :</b> ${numberToWords(order.total)}</p>

</div>

<hr>

<div class="summary-row">

<p><b>Grand Total :</b> ₹${order.total}</p>

<p><b>Amount :</b> ₹${order.total}</p>

</div>

</div>

<div class="payment-area">

<div class="payment-text">

<h2>Payment Information</h2>

<p>

Scan the QR Code to make payment instantly.

</p>

<br>

<p><b>UPI ID :</b> yourupi@bank</p>

<p><b>Account Name :</b> SHIVANI WOOD CRAFT</p>

<p><b>Bank :</b> State Bank of India</p>

<p><b>Thank You For Your Business.</b></p>

</div>

<div class="qr-box">

<img
src="images/payment-qr.png"
alt="QR Code">

<h3>Scan & Pay</h3>

</div>

</div>

<div class="signature">

<div class="thanks">

<h2>Thank You!</h2>

<p>

Thank you for shopping with

<b>Shivani Wood Craft.</b>

We appreciate your trust and hope to serve you again.

</p>

</div>

<div class="sign">

<p>For</p>

<h3>SHIVANI WOOD CRAFT</h3>

<br><br>

<hr>

<p><b>Authorized Signatory</b></p>

</div>

</div>

<button

class="print-btn"

onclick="window.print()">

🖨️ Print Invoice

</button>

</div>

`;
}
loadInvoice();

window.printInvoice = function () {

    window.print();

};

window.addEventListener("beforeprint", () => {

    document.title = "Invoice_" + orderId;

});

window.addEventListener("afterprint", () => {

    document.title = "Shivani Wood Craft";

});

window.onerror = function (msg, url, line) {

    console.error(
        "Invoice Error :",
        msg,
        "Line :",
        line
    );

};
