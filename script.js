/* ======================================
   PRODUCT DATABASE
====================================== */

const PRODUCTS = {
  shiv: [
    {
      code: "SHIV-001",
      name: "Shiv Ji Dashboard Idol",
      price: 299,
      oldPrice: 499,
      image: "images/product1.jpg.jpeg"
    },
    {
      code: "SHIV-002",
      name: "Shiv Ji Dashboard Idol",
      price: 349,
      oldPrice: 549,
      image: "images/product-2.jpg.jpeg"
    },
    {
      code: "SHIV-003",
      name: "Shiv Ji Dashboard Idol",
      price: 399,
      oldPrice: 599,
      image: "images/product-3.jpg.jpeg"
    },
    {
      code: "SHIV-004",
      name: "Shiv Ji Dashboard Idol",
      price: 499,
      oldPrice: 699,
      image: "images/product1-4.jpg.jpeg"
    }
  ],

  krishna: [
    {
      code: "KRISHNA-001",
      name: "Krishna Dashboard Idol",
      price: 299,
      oldPrice: 499,
      image: "images/product2.jpg.jpeg"
    },
    {
      code: "KRISHNA-002",
      name: "Krishna Dashboard Idol",
      price: 349,
      oldPrice: 549,
      image: "images/product2-2.jpg.jpeg"
    },
    {
      code: "KRISHNA-003",
      name: "Krishna Dashboard Idol",
      price: 399,
      oldPrice: 599,
      image: "images/product2-3.jpg.jpeg"
    },
    {
      code: "KRISHNA-004",
      name: "Krishna Dashboard Idol",
      price: 499,
      oldPrice: 699,
      image: "images/product2-4.jpg.jpeg"
    }
  ]
};
// ===========================
// SMOOTH SCROLL
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ===========================
// STICKY HEADER SHADOW
// ===========================

window.addEventListener("scroll", () => {

    const header = document.querySelector(".header");

    if(header){

        if(window.scrollY > 50){
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,.15)";
        }else{
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,.08)";
        }

    }

});
// ===========================
// SCROLL ANIMATION
// ===========================

const sections = document.querySelectorAll("section");

const revealSection = () => {

    sections.forEach(section => {

        const top = section.getBoundingClientRect().top;
        const screen = window.innerHeight;

        if(top < screen - 100){
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        }

    });

};

sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(40px)";
    section.style.transition = "all .8s ease";
});

window.addEventListener("scroll", revealSection);
window.addEventListener("load", revealSection);
// ===========================
// BACK TO TOP BUTTON
// ===========================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if(topBtn){

        if(window.scrollY > 300){
            topBtn.style.display = "block";
        }else{
            topBtn.style.display = "none";
        }

    }

});

if(topBtn){
    topBtn.addEventListener("click", () => {
        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });
}
/* ===========================
   SMART PRODUCT SEARCH
=========================== */

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const keyword = this.value.trim().toLowerCase();

        const cards = document.querySelectorAll(".product-card");

        let found = 0;

        cards.forEach(card => {

            const text = card.innerText.toLowerCase();

            if (text.includes(keyword)) {

                card.style.display = "";

                found++;

            } else {

                card.style.display = "none";

            }

        });

        let msg = document.getElementById("noProductMessage");

        if (!msg) {

            msg = document.createElement("h2");

            msg.id = "noProductMessage";

            msg.innerHTML = "❌ No Product Found";

            msg.style.textAlign = "center";
            msg.style.color = "#FFD700";
            msg.style.margin = "40px 0";
            msg.style.fontFamily = "Cinzel";

            document.querySelector(".product-grid").appendChild(msg);

        }

        msg.style.display = found === 0 ? "block" : "none";

    });

}
function changeImage(id, src, price = null, oldPrice = null, code = null){

    const img = document.getElementById(id);

    img.src = src;

    img.setAttribute("data-selected", src);

    const no = id.replace("mainImage","");

    if(price){
        document.getElementById("price"+no).innerText = "₹"+price;
    }

    if(oldPrice){
        document.getElementById("oldPrice"+no).innerText = "₹"+oldPrice;
    }

    if(code){
        document.getElementById("code"+no).innerText = code;
    }

}
/*==========================
      GALLERY LIGHTBOX
==========================*/

const galleryImages=document.querySelectorAll(".gallery-item img");

const lightbox=document.getElementById("lightbox");

const lightboxImg=document.getElementById("lightbox-img");

const closeBtn=document.querySelector(".close-lightbox");

const nextBtn=document.querySelector(".next");

const prevBtn=document.querySelector(".prev");

let currentIndex=0;

galleryImages.forEach((img,index)=>{

img.addEventListener("click",()=>{

currentIndex=index;

showImage();

});

});

function showImage(){

lightbox.classList.add("active");

lightboxImg.src=galleryImages[currentIndex].src;

}

closeBtn.onclick=()=>{

lightbox.classList.remove("active");

}

nextBtn.onclick=()=>{

currentIndex++;

if(currentIndex>=galleryImages.length){

currentIndex=0;

}

showImage();

}

prevBtn.onclick=()=>{

currentIndex--;

if(currentIndex<0){

currentIndex=galleryImages.length-1;

}

showImage();

}

lightbox.onclick=(e)=>{

if(e.target===lightbox){

lightbox.classList.remove("active");

}

}
document.querySelectorAll(".faq-item").forEach(item=>{

const question=item.querySelector(".faq-question");

question.addEventListener("click",()=>{

item.classList.toggle("active");

});

});


/* ===========================
   SHOPPING CART SYSTEM
=========================== */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {

    const count = document.getElementById("cart-count");

    if(count){

        count.innerText = cart.reduce((t,p)=>t+p.qty,0);

    }

}

function addToCart(name,price,image){

    let item = cart.find(
    p => p.name === name && p.image === image
);

    if(item){

        item.qty++;

    }else{

        cart.push({
            name:name,
            price:price,
            image:image,
            qty:1
        });

    }

    saveCart();

    alert(name + " Added To Cart");

}

updateCartCount();
/* ===========================
      CART FUNCTIONS
=========================== */

function openCart(){

    document.getElementById("cart-panel").classList.add("active");

    renderCart();

}

function closeCart(){

    document.getElementById("cart-panel").classList.remove("active");

}

function renderCart(){

    let box=document.getElementById("cart-items");

    let total=0;

    box.innerHTML="";

    cart.forEach((item,index)=>{

        total+=item.price*item.qty;

        box.innerHTML+=`

        <div class="cart-item">

            <img src="${item.image}">

            <div class="cart-details">

                <h4>${item.name}</h4>

                <p>₹${item.price}</p>

                <div class="qty-box">

                    <button onclick="changeQty(${index},-1)">-</button>

                    <span>${item.qty}</span>

                    <button onclick="changeQty(${index},1)">+</button>

                </div>

                <button class="remove-btn"

                onclick="removeItem(${index})">

                Remove

                </button>

            </div>

        </div>

        `;

    });

    document.getElementById("cart-total").innerText=total;

}

function changeQty(index,value){

    cart[index].qty+=value;

    if(cart[index].qty<=0){

        cart.splice(index,1);

    }

    saveCart();

    renderCart();

}

function removeItem(index){

    cart.splice(index,1);

    saveCart();

    renderCart();

}

function checkoutWhatsApp(){
    

    if(cart.length==0){

        alert("Cart Empty");

        return;

    }
    let name = document.getElementById("customerName").value;

let phone = document.getElementById("customerPhone").value;

let address = document.getElementById("customerAddress").value;

    let msg="Hello Shivani Wood Craft%0A%0A";

    let total=0;

    cart.forEach(item=>{

        msg+=`${item.name}%0AQty : ${item.qty}%0APrice : ₹${item.price}%0A%0A`;

        total+=item.price*item.qty;

    });

    msg+="Total : ₹"+total;
    msg+="%0A%0A";

msg+="Customer Name : "+name+"%0A";

msg+="Mobile : "+phone+"%0A";

msg+="Address : "+address;

    window.open("https://wa.me/918755258887?text="+msg,"_blank");

}
function goToProductsSearch(e){

    if(e.key === "Enter"){

        const searchBox = document.getElementById("homeSearch");
        let value = searchBox.value.trim();

        if(value !== ""){

            // Search box clear kar do
            searchBox.value = "";

            // Products page open karo
            window.location.href =
                "product.html?search=" + encodeURIComponent(value);

        }

    }

}
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle.onclick = function () {
    mobileMenu.classList.toggle("active");
};
document.querySelectorAll("#mobileMenu a").forEach(link => {

    link.addEventListener("click", () => {

        setTimeout(() => {
            mobileMenu.classList.remove("active");
        }, 500);

    });

});
