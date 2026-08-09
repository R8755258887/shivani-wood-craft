import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const searchBox = document.getElementById("productSearch");
const productList = document.getElementById("productList");
const selectedProduct = document.getElementById("selectedProduct");

const previewImage = document.getElementById("previewImage");
const previewName = document.getElementById("previewName");
const previewCode = document.getElementById("previewCode");
const previewStock = document.getElementById("previewStock");
const previewPrice = document.getElementById("previewPrice");

const supplier = document.getElementById("supplier");
const historyTable = document.getElementById("history");

let allProducts = [];

let editId = null;

async function loadProducts(){

    allProducts=[];

    const snap=await getDocs(collection(db,"products"));

    snap.forEach((docSnap)=>{

        allProducts.push({

            id:docSnap.id,

            ...docSnap.data()

        });

    });

}

searchBox.addEventListener("input",()=>{

    const keyword=searchBox.value.trim().toLowerCase();

    if(keyword===""){

        productList.style.display="none";

        productList.innerHTML="";

        return;

    }

    const result=allProducts.filter(product=>

        (product.code||"").toLowerCase().includes(keyword)||

        (product.name||"").toLowerCase().includes(keyword)

    );

    productList.innerHTML="";

    result.forEach(product=>{

        productList.innerHTML+=`

        <div class="product-item"

        onclick="selectProduct('${product.id}')">

        <b>${product.code}</b>

        <br>

        ${product.name}

        </div>

        `;

    });

    productList.style.display=result.length?"block":"none";

});

window.selectProduct=function(id){

    const product=allProducts.find(x=>x.id===id);

    if(!product) return;

    selectedProduct.value=id;

    searchBox.value=product.code+" - "+product.name;

    previewImage.src = product.image.startsWith("images/")
    ? product.image
    : "images/images/" + product.image;

    previewName.innerText=product.name;

    previewCode.innerText=product.code;

    previewStock.innerText=product.stock||0;

    previewPrice.innerText=product.price||0;

    productList.style.display="none";

};

document.addEventListener("click",(e)=>{

    if(

        !searchBox.contains(e.target)

        &&

        !productList.contains(e.target)

    ){

        productList.style.display="none";

    }

});
// --------------------
// Load Suppliers
// --------------------

async function loadSuppliers(){

    supplier.innerHTML="<option value=''>Select Supplier</option>";

    const snap=await getDocs(collection(db,"suppliers"));

    snap.forEach(docSnap=>{

        const data=docSnap.data();

        supplier.innerHTML+=`

        <option value="${docSnap.id}">

        ${data.name}

        </option>

        `;

    });

}

// --------------------
// Save Purchase
// --------------------

window.savePurchase=async function(){

    try{

        const productId=selectedProduct.value;

        const supplierId=supplier.value;

        const qty=Number(document.getElementById("qty").value);

        const billNo=document.getElementById("billNo").value.trim();

        const purchasePrice=Number(document.getElementById("purchasePrice").value);

        const purchaseDate=document.getElementById("purchaseDate").value;

        const remarks=document.getElementById("remarks").value.trim();

        if(!productId){

            alert("Select Product");

            return;

        }

        if(qty<=0){

            alert("Enter Valid Qty");

            return;

        }

        const productRef=doc(db,"products",productId);

        const productSnap=await getDoc(productRef);

        const product=productSnap.data();

        const currentStock=Number(product.stock||0);

        const newStock=currentStock+qty;

        await updateDoc(productRef,{

            stock:newStock

        });

        const supplierText = "";

        await addDoc(collection(db,"purchase"),{

            productId,

            supplierId: "",

            supplierName: "",

            productCode:product.code,

            productName:product.name,

            image:product.image||"",

            qty,

            purchasePrice,

            total:qty*purchasePrice,

            billNo,

            purchaseDate,

            remarks,

            previousStock:currentStock,

            currentStock:newStock,

            createdAt:new Date()

        });

        alert("✅ Purchase Saved Successfully");

        clearForm();

        loadHistory();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// --------------------
// Purchase History
// --------------------

async function loadHistory(){

    historyTable.innerHTML="";

    const q=query(

        collection(db,"purchase"),

        orderBy("createdAt","desc")

    );

    const snap=await getDocs(q);

    snap.forEach(docSnap=>{

        const data=docSnap.data();

        historyTable.innerHTML+=`

        <tr>

        <td>${data.purchaseDate||""}</td>

        <td>${data.billNo||""}</td>

        <td>${data.supplierName||""}</td>

        <td>${data.productCode||""}</td>

        <td>${data.productName||""}</td>

        <td>${data.qty}</td>

        <td>₹${data.purchasePrice}</td>

        <td>₹${data.total}</td>

        <td>${data.currentStock}</td>

        <td>

        <button
        class="action-btn edit-btn"
        onclick="editPurchase('${docSnap.id}')">

        Edit

        </button>

        <button
        class="action-btn delete-btn"
        onclick="deletePurchase('${docSnap.id}')">

        Delete

        </button>

        </td>

        </tr>

        `;

    });

}

// --------------------
// Delete Purchase
// --------------------

window.deletePurchase=async function(id){

    if(!confirm("Delete this Purchase?")) return;

    try{

        const purchaseRef=doc(db,"purchase",id);

        const purchaseSnap=await getDoc(purchaseRef);

        if(!purchaseSnap.exists()) return;

        const purchase=purchaseSnap.data();

        const productRef=doc(db,"products",purchase.productId);

        const productSnap=await getDoc(productRef);

        if(productSnap.exists()){

            const product=productSnap.data();

            const stock=Math.max(

                Number(product.stock||0)-Number(purchase.qty),

                0

            );

            await updateDoc(productRef,{

                stock:stock

            });

        }

        await deleteDoc(purchaseRef);

        alert("Purchase Deleted");

        loadHistory();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

// --------------------
// Edit Purchase
// --------------------

window.editPurchase=function(id){

    alert("Edit Purchase Module Next Update");

};

// --------------------
// Search History
// --------------------

document.getElementById("historySearch")

.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    document.querySelectorAll("#history tr")

    .forEach(row=>{

        row.style.display=

        row.innerText.toLowerCase()

        .includes(value)

        ? ""

        : "none";

    });

});

// --------------------
// Clear Form
// --------------------

window.clearForm=function(){

    selectedProduct.value="";

    searchBox.value="";

    supplier.value="";

    document.getElementById("billNo").value="";

    document.getElementById("purchaseDate").value="";

    document.getElementById("qty").value="";

    document.getElementById("purchasePrice").value="";

    document.getElementById("remarks").value="";

    previewImage.removeAttribute("src");

    previewName.innerText="Select Product";

    previewCode.innerText="-";

    previewStock.innerText="0";

    previewPrice.innerText="0";

};

// --------------------
// Initial Load
// --------------------

loadProducts();

loadSuppliers();

loadHistory();