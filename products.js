import { db } from "./firebase.js";

import { loadFirebaseProducts } from "./firebase-products.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
/*=========================================
SHIVANI WOOD CRAFT
PRODUCT DATABASE
=========================================*/

let products = [];

/*=========================================
GLOBAL VARIABLES
=========================================*/

let selectedProduct = products[0];

let qty = 1;

let cart = [];

/*=========================================
DOM
=========================================*/

const container =
document.getElementById("productsContainer");

const previewImage =
document.getElementById("previewImage");

const previewName =
document.getElementById("previewName");

const previewCode =
document.getElementById("previewCode");

const previewPrice =
document.getElementById("previewPrice");

const qtyText =
document.getElementById("qty");

const cartCount =
document.getElementById("cart-count");

const cartItems =
document.getElementById("cartItems");

const cartTotal =
document.getElementById("cartTotal");

const searchInput =
document.getElementById("searchInput");

/*=========================================
LOAD PRODUCTS
=========================================*/

function loadProducts(list = products){

    container.innerHTML = "";

    list.forEach(product=>{

        container.innerHTML += `

<div class="product-card">

<div class="wishlist-btn"
onclick="toggleWishlist(${product.id},this)">
🤍
</div>

    ${product.id<=8 ? `<div class="product-badge">NEW</div>` :
  product.id<=20 ? `<div class="product-badge best">BEST</div>` : ``}

<img
    loading="lazy"
    src="${product.image || "images/no-image.png"}"
    alt="${product.name}"
    onerror="this.src='logo.png';"
    onclick="selectProduct(${product.id})">

    <div class="product-info">

        <h3>${product.name}</h3>

        <div class="rating">
            ⭐⭐⭐⭐⭐
        </div>

        <p>${product.code}</p>

        <h4>₹${product.price}</h4>

        <p class="stock-status">${product.stock}</p>
<p class="delivery-status">${product.delivery}</p>

        <div class="product-actions">

            <button
                onclick="selectProduct(${product.id})">
            <i class="fa-solid fa-eye"></i> View

            <button
                class="quick-add"
                onclick="selectProduct(${product.id});addSelectedProduct();">
                <i class="fa-solid fa-cart-plus"></i> Add
            </button>

        </div>

    </div>

</div>

`;

    });

}
/*=========================================
SELECT PRODUCT
=========================================*/

function selectProduct(id){

    const product = products.find(p => p.id === id);

    if(!product) return;

    selectedProduct = product;

    qty = 1;

    qtyText.innerText = qty;

    previewImage.src = product.image;

    previewName.innerText = product.name;

    previewCode.innerText = product.code;

    previewPrice.innerText = product.price;

}

/*=========================================
QUANTITY
=========================================*/

function increaseQty(){

    qty++;

    qtyText.innerText = qty;

}

function decreaseQty(){

    if(qty>1){

        qty--;

        qtyText.innerText = qty;

    }

}

/*=========================================
ADD TO CART
=========================================*/

function addSelectedProduct(){

    const index = cart.findIndex(item => item.id === selectedProduct.id);

    if(index >= 0){

        cart[index].qty += qty;

    }else{

        cart.push({

            ...selectedProduct,

            qty:qty

        });

    }

    updateCart();

}

/*=========================================
UPDATE CART
=========================================*/

function updateCart(){

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item,index)=>{

        total += item.price * item.qty;

        cartItems.innerHTML += `

<div class="cart-item">

<img src="${item.image}">

<div class="cart-details">

<h4>${item.name}</h4>

<p>${item.code}</p>

<div class="cart-qty">

    <button onclick="changeQty(${index},-1)">−</button>

    <input
        type="number"
        min="1"
        value="${item.qty}"
        onchange="setQty(${index},this.value)">

    <button onclick="changeQty(${index},1)">+</button>

</div>

<p class="cart-price">
₹${item.price * item.qty}
</p>

<button

class="remove-btn"

onclick="removeItem(${index})">

Remove

</button>

</div>

</div>

`;

    });

    cartTotal.innerText = total;

    cartCount.innerText = cart.length;

}
function changeQty(index, value){

    cart[index].qty += value;

    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }

    updateCart();

}
function setQty(index,value){

    value = parseInt(value);

    if(isNaN(value) || value < 1){

        value = 1;

    }

    cart[index].qty = value;

    updateCart();

}
/*=========================================
REMOVE ITEM
=========================================*/

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

/*=========================================
OPEN / CLOSE CART
=========================================*/

function openCart(){

    document
    .getElementById("cartPanel")
    .classList
    .add("active");

}

function closeCart(){

    document
    .getElementById("cartPanel")
    .classList
    .remove("active");

}

/*=========================================
IMAGE VIEWER
=========================================*/

function openViewer(){

    const viewer = document.getElementById("imageViewer");
    const image = document.getElementById("viewerImage");

    image.src = selectedProduct.image;

    image.style.transform = "scale(1)";

    viewer.classList.add("active");

}

function closeViewer(){

    const viewer = document.getElementById("imageViewer");
    const image = document.getElementById("viewerImage");

    viewer.classList.remove("active");

    image.style.transform = "scale(1)";

    zoom = 1;

}
/*==============================
IMAGE ZOOM
==============================*/

let zoom = 1;
let currentX = 0;
let currentY = 0;

document.getElementById("viewerImage").style.transform = "scale(1)";

document.getElementById("viewerImage").addEventListener("wheel", function(e){

    e.preventDefault();

    if(e.deltaY < 0){
        zoom += 0.2;
    }else{
        zoom -= 0.2;
    }

    if(zoom < 1) zoom = 1;
    if(zoom > 4) zoom = 4;

    this.style.transform = `scale(${zoom})`;

});

viewerImage.addEventListener("click", function () {

    if (zoom === 1) {
        zoom = 2;
    } else {
        zoom = 1;
    }

    this.style.transform = `scale(${zoom})`;

});
document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){
        closeViewer();
    }

});

/*=========================================
CLICK IMAGE
=========================================*/

previewImage.onclick=function(){

    openViewer();

};

/*=========================================
SEARCH
=========================================*/

searchInput.addEventListener("keyup",function(){

    const text=this.value.toLowerCase();

    const result=products.filter(product=>

        product.name.toLowerCase().includes(text) ||

        product.code.toLowerCase().includes(text)

    );

    loadProducts(result);

});
document.getElementById("sortProducts").addEventListener("change", function () {

    let sorted = [...products];

    if (this.value === "low") {

        sorted.sort((a, b) => a.price - b.price);

    }

    else if (this.value === "high") {

        sorted.sort((a, b) => b.price - a.price);

    }

    else if (this.value === "new") {

        sorted.sort((a, b) => b.id - a.id);

    }

    loadProducts(sorted);

});
function sendWhatsAppOrder(){

    if(cart.length===0){
        alert("Please add at least one product to cart.");
        return;
    }
let html = "";
let total = 0;

cart.forEach(item => {

    const subtotal = item.price * item.qty;
    total += subtotal;

   html += `
<div style="
display:flex;
justify-content:space-between;
align-items:center;
padding:10px 0;
border-bottom:1px solid #333;
">

<div>

<b>${item.name}</b><br>

<small style="color:#FFD700;">
${item.code}
</small><br>

<small>
Qty : ${item.qty}
</small>

</div>

<div style="
color:#FFD700;
font-weight:bold;
font-size:18px;
">

₹${subtotal}

</div>

</div>
`;

});

document.getElementById("popupItems").innerHTML = html;
document.getElementById("popupTotal").innerHTML = "Total : ₹" + total;

    document
        .getElementById("orderPopup")
        .classList
        .add("active");

}
/*=========================================
START
=========================================*/

(async () => {

    products = await loadFirebaseProducts();

    loadProducts();

    if (products.length > 0) {
        selectProduct(products[0].id);
    }

    updateCart();

})();
/*=========================================
IMAGE FALLBACK
=========================================*/

document.addEventListener("error",function(e){

    if(e.target.tagName==="IMG"){

        e.target.src="images/no-image.png";

    }

},true);

/*=========================================
ENTER KEY SEARCH
=========================================*/

searchInput.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        this.value="";

        loadProducts();

    }

});

/*=========================================
CLOSE IMAGE VIEWER
=========================================*/

document
.getElementById("imageViewer")
.addEventListener("click",function(e){

    if(e.target.id==="imageViewer"){

        closeViewer();

    }

});

/*=========================================
CLOSE CART (ESC)
=========================================*/

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeCart();

        closeViewer();

    }

});

/*=========================================
AUTO SELECT FIRST PRODUCT
=========================================*/

window.addEventListener("load",()=>{

    if(products.length){

        selectProduct(1);

    }

});

/*=========================================
END OF FILE
=========================================*/
function openSharePopup(){

document.getElementById("sharePopup").style.display="flex";

}

function closeSharePopup(){

document.getElementById("sharePopup").style.display="none";

}

function shareWhatsApp(){

window.open("https://wa.me/?text="+encodeURIComponent(window.location.href));

}

function shareFacebook(){

window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(window.location.href));

}

function shareTelegram(){

window.open("https://t.me/share/url?url="+encodeURIComponent(window.location.href));

}

function copyProductLink(){

navigator.clipboard.writeText(window.location.href);

showToast("Link Copied");

closeSharePopup();

}

console.log(
"Shivani Wood Craft Products Loaded Successfully."
);
/*=========================================
HOME PAGE SEARCH SUPPORT
=========================================*/

const urlParams = new URLSearchParams(window.location.search);
const searchValue = urlParams.get("search");

if (searchValue) {

    searchInput.value = searchValue;

    const result = products.filter(product =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.code.toLowerCase().includes(searchValue.toLowerCase())
    );

    loadProducts(result);

}
// =============================
// ORDER POPUP
// =============================

function closePopup() {
    document.getElementById("orderPopup").classList.remove("active");
}

async function sendPopupOrder(){

    const name=document.getElementById("popupName").value.trim();
    const mobile=document.getElementById("popupMobile").value.trim();
    const address=document.getElementById("popupAddress").value.trim();

    if(name==="" || mobile==="" || address===""){
        alert("Please fill all details.");
        return;
    }

    let total=0;
    const orderId = "SWC" + Date.now().toString().slice(-6);
const orderDate = new Date().toLocaleString("en-IN");

    let message="🌸 *SHIVANI WOOD CRAFT*%0A%0A";
    message += `🆔 Order ID : ${orderId}%0A`;
message += `📅 ${orderDate}%0A%0A`;
    message+="🛒 *NEW ORDER*%0A%0A";

    cart.forEach(item=>{

        total+=item.price*item.qty;

        message+=`${item.name} (${item.code})%0A`;
        message+=`Qty : ${item.qty}%0A`;
        message+=`Price : ₹${item.price}%0A`;
        message+=`Subtotal : ₹${item.price*item.qty}%0A%0A`;

    });

    message += `%0A━━━━━━━━━━━━━━━━━━━━%0A`;
message += `💰 Total : ₹${total}%0A`;
message += `👤 Name : ${name}%0A`;
message += `📱 Mobile : ${mobile}%0A`;
message += `📍 Address : ${address}%0A`;
message += `🙏 Thank You for shopping with SHIVANI WOOD CRAFT`;
message += `%0A%0A🚚 Free Delivery Available`;
await addDoc(collection(db, "orders"), {
    orderId: orderId,
    date: orderDate,

    customerName: name,
    mobile: mobile,
    address: address,

    items: cart,

    total: total,

    status: "Pending",

    createdAt: serverTimestamp()
});
console.log("TOTAL =", total);

    window.open(
        "https://wa.me/918755258887?text="+message,
        "_blank"
    );

    alert("✅ Thank You!\n\nYour order is ready.\nWhatsApp is opening...");
    document.getElementById("popupName").value="";
document.getElementById("popupMobile").value="";
document.getElementById("popupAddress").value="";
cart = [];
updateCart();

closePopup();

}
let wishlist =
JSON.parse(localStorage.getItem("wishlist")) || [];

function toggleWishlist(id,btn){

if(wishlist.includes(id)){

wishlist =
wishlist.filter(x=>x!==id);

btn.classList.remove("active");

btn.innerHTML="🤍";

}else{

wishlist.push(id);

btn.classList.add("active");

btn.innerHTML="❤️";

}

localStorage.setItem("wishlist",JSON.stringify(wishlist));

}
/*========================================
PREMIUM LOADER
========================================*/

window.addEventListener("load", function () {

    setTimeout(function () {

        document
            .getElementById("loader")
            .classList
            .add("hide");

    }, 1800);

});
/*========================================
BACK TO TOP
========================================*/

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function(){

    if(window.scrollY > 50){

        topBtn.classList.add("show");

    }else{

        topBtn.classList.remove("show");

    }

});

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*=========================================
COPY PRODUCT CODE
=========================================*/

function copyProductCode(){

    const code = selectedProduct.code;

    navigator.clipboard.writeText(code)
    .then(()=>{

        alert("✅ Product Code Copied : " + code);

    })
    .catch(()=>{

        alert("Copy Failed");

    });

}
/*=========================================
SHARE PRODUCT
=========================================*/

function shareProduct(){

    const url = window.location.href;

    const text =
`🌸 Shivani Wood Craft

📦 Product : ${selectedProduct.name}
🏷 Code : ${selectedProduct.code}
💰 Price : ₹${selectedProduct.price}

${url}`;

    if(navigator.share){

        navigator.share({

            title:selectedProduct.name,

            text:text,

            url:url

        });

    }else{

        navigator.clipboard.writeText(text);

        alert("Product details copied successfully.");

    }

}
/*=========================================
ENQUIRY POPUP
=========================================*/

function quickEnquiry(id){

    const product = products.find(p => p.id === id);

    if(!product) return;

    selectedProduct = product;

    document.getElementById("enquiryPopup").classList.add("active");
}

function closeEnquiry(){

    document.getElementById("enquiryPopup").classList.remove("active");
}

function sendEnquiryWhatsApp(){

const enquiryId = "ENQ-" + Date.now();

const today = new Date();

const date = today.toLocaleDateString("en-IN");

const time = today.toLocaleTimeString("en-IN");

const message =
`🟡 *NEW PRODUCT ENQUIRY*

━━━━━━━━━━━━━━

🆔 Enquiry ID : ${enquiryId}

📅 Date : ${date}

🕒 Time : ${time}

━━━━━━━━━━━━━━

📦 Product : ${selectedProduct.name}

🔖 Code : ${selectedProduct.code}

💰 Price : ₹${selectedProduct.price}

━━━━━━━━━━━━━━

Customer wants more details about this product.

Thank You

Shivani Wood Craft`;

    window.open(
        "https://wa.me/918755258887?text=" +
        encodeURIComponent(message),
        "_blank"
    );

    closeEnquiry();
}

function sendEnquiryEmail(){

    const subject =
    "Product Enquiry - " + selectedProduct.code;

    const body =
`Hello Shivani Wood Craft,

I want enquiry about this product.

Product Name : ${selectedProduct.name}
Product Code : ${selectedProduct.code}
Price : ₹${selectedProduct.price}

Please send more details.`;

    window.location.href =
    "mailto:csrajeshpandey300997@gmail.com?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body);

    closeEnquiry();
}
// ===== Make functions global =====
window.selectProduct = selectProduct;
window.addSelectedProduct = addSelectedProduct;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.changeQty = changeQty;
window.setQty = setQty;
window.removeItem = removeItem;
window.openCart = openCart;
window.closeCart = closeCart;
window.openViewer = openViewer;
window.closeViewer = closeViewer;
window.sendWhatsAppOrder = sendWhatsAppOrder;
window.closePopup = closePopup;
window.sendPopupOrder = sendPopupOrder;
window.toggleWishlist = toggleWishlist;
window.copyProductCode = copyProductCode;
window.shareProduct = shareProduct;
window.openSharePopup = openSharePopup;
window.closeSharePopup = closeSharePopup;
window.shareWhatsApp = shareWhatsApp;
window.shareFacebook = shareFacebook;
window.shareTelegram = shareTelegram;
window.copyProductLink = copyProductLink;
window.quickEnquiry = quickEnquiry;
window.closeEnquiry = closeEnquiry;
window.sendEnquiryWhatsApp = sendEnquiryWhatsApp;
window.sendEnquiryEmail = sendEnquiryEmail;
window.scrollToTop = scrollToTop;