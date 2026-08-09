import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const code = document.getElementById("code");
const name = document.getElementById("name");
const price = document.getElementById("price");
const image = document.getElementById("image");
const description = document.getElementById("description");
const previewImage = document.getElementById("previewImage");
const saveBtn = document.getElementById("saveBtn");
const imageFile = document.getElementById("imageFile");
const selectImageBtn = document.getElementById("selectImageBtn");

async function loadProduct(){

    try{

        const ref = doc(db,"products",productId);

        const snap = await getDoc(ref);

        if(!snap.exists()){

            alert("Product Not Found");
            return;

        }

        const data = snap.data();

        code.value = data.code || "";
        name.value = data.name || "";
        price.value = data.price || "";
        image.value = data.image || "";
        description.value = data.description || "";

        previewImage.src =
    data.image
    ? data.image
    : "images/no-image.png";

    }catch(error){

        console.error(error);
        alert(error.message);

    }

}

image.addEventListener("keyup",function(){

    previewImage.src =
    this.value
    ? this.value
    : "images/no-image.png";

});

saveBtn.addEventListener("click",async()=>{

    try{

        await updateDoc(
            doc(db,"products",productId),
            {

                code:code.value.trim(),
                name:name.value.trim(),
                price:Number(price.value),
                image:image.value.trim(),
                description:description.value.trim()

            }
        );

        alert("✅ Product Updated Successfully");

        window.location.href="manage-products.html";

    }catch(error){

        console.error(error);
        alert(error.message);

    }

});
selectImageBtn.addEventListener("click", () => {
    imageFile.click();
});

imageFile.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    image.value = "images/images/" + file.name;
    previewImage.src = "images/images/" + file.name;

});

loadProduct()