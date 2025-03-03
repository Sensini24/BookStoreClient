import { GetQuantity } from "./cart";
import { manejarRuta } from "./router";
import { getUserInfo } from "./user";

export async function GetHeader(){
    const header = document.querySelector(".main-header");
    
    try{
        const response = await fetch('views/header.html');
        if (!response.ok) {
            throw new Error('Error al obtener los productos');
        }
        const textHeader = await response.text();
        
        header.innerHTML = textHeader;
        
        addItemsCart();
        chargeStyle()
        GetLogin()
        // interceptarEnlaces() 
    }catch(err){
        console.error('Error:', err);
    }
}

export async function AddOrRemoveItems() {
    const user = await getUserInfo()
    const quantity = await GetQuantity()
    console.log("Usuario: ", user)
    const btnLogin = document.querySelector(".login-container");
    const btnLogout = document.querySelector(".logout-container");
    const cartContainer = document.querySelector(".hdr-cart-container");
    const quantityCart = document.querySelector(".hdr-cart-count")
    const hedCarrito = document.querySelector("#cart-side")
    const editBook = document.querySelector("#edit-book")
    const newBook = document.querySelector("#new-book")
    let isLogin= user.success == false ? btnLogin.style.display = "flex" :"none";
    //Mostrar u ocultar icono de login
    if(isLogin){
        btnLogin.addEventListener("click", ()=>{
            window.location.href="/login"
        })
    }
    //Mostrar u ocultar icono de logout
    let isLogout = user.success == true ? btnLogout.style.display = "flex" :"none";

    //Mostrar u ocultar icono de carrito
    if(user.rol !== "Administrador"){
        cartContainer.style.display = "flex"
        hedCarrito.style.display = "flex"
        quantityCart.textContent = quantity.sumItem
        editBook.style.display = "none"
        newBook.style.display = "none"
    }

    if(user.rol === "Administrador"){
        editBook.style.display = "flex"
        newBook.style.display = "flex"
    }
    
    // let isthereCart = user.rol == "Cliente" ? 

}

export async function showSides(){
    
    // const Header = document.querySelectorAll(".hdr-nav-link")
    // Header.forEach(async ele=>{
    //     ele.addEventListener("click", ()=>{
    //         console.log(ele.textContent,ele.id)
    //         let nombre = ele.textContent;
    //         let id = ele.id
    //         setStyle(id)
            
    //         console.log("ruta: ",  ruta, ruta.length, ruta[ruta.length-1])
    //         // const addStyle = nombre =
    //         // localStorageVariable(id, nombre)
    //     })
        
    //     setStyleNull(`${ele.id}`)
    // })

    const completeHeader = document.querySelector(".hdr-header");
    completeHeader.addEventListener("click", (e)=>{
        event.preventDefault()
        if(e.target.closest(".hdr-cart-container")){
            
            addItemsCart()
        }
        const target = e.target
        let id = target.id
        let nombre = ""
        let ruta = window.location.href.split("/")
        let addStyle;
        switch(id){
            
            case "book-side":
                console.log("esta en libros")
                nombre = "Libros"
                handleSides("book-side")
                addStyle = ruta[ruta.length-1] == "books" ? setStyle(id) : setStyleNull(id)
                // setStyle(id)
                // localStorage.setItem("isClicked", nombre)
                // localStorageVariable(id,nombre)
                // console.log(localStorage.getItem("isClicked"))
                break;
            case "cart-side":
                nombre = "Carrito de compra"
                handleSides("cart-side")
                addStyle = ruta[ruta.length-1] == "cart" ? setStyle(id) : setStyleNull(id)
                // setStyle(id)
                // localStorage.setItem("isClicked", nombre)
                // console.log("esta en carrito de compras")
                break;
            case "category-side":
                nombre = "Categorías"
                handleSides("category-side")
                addStyle = ruta[ruta.length-1] == "categories" ? setStyle(id) : setStyleNull(id)
                // setStyle(id)
                // localStorage.setItem("isClicked", nombre)
                // console.log("esta en carrito de categorias")
                break;
        }
    })
    
}

function chargeStyle(){
    const Header = document.querySelectorAll(".hdr-nav-link")
    Header.forEach(async ele=>{
        let ruta = window.location.href.split("/")
        addStyle = ruta[ruta.length-1] == "books" ? setStyle(ele.id) : setStyleNull(ele.id)
    })
    
}

function handleSides(book){
    const sideBooks = document.querySelector(".hdr-nav-links-book");
    if(book == "book-side"){
        sideBooks.style.display = "flex"
    }else{
        sideBooks.style.display = "none"
    }
}

function addItemsCart(){
    const cartIcon = document.querySelector(".hdr-cart-container");
    cartIcon.addEventListener("click", (e)=>{
        e.preventDefault()
        history.pushState({}, "", "/cart");//El tipico push state para enviar la ruta y usarlo en manerjar ruta para cambiar de contenido SPA
        console.log("hola header");
        manejarRuta();
    })
}

function localStorageVariable(id, name){
    if(localStorage.getItem("isClicked") === name){
        const dato = document.getElementById(id)
        dato.style.backgroundColor = "#000000"
        dato.style.color = "#F5F5F5"
    }
}
async function setStyleNull(id){
    const dato = document.getElementById(id)
    dato.style.backgroundColor = "#E5E5E5"
    dato.style.color = "#000000"
}

async function setStyle(id){
    const dato = document.getElementById(id)
    dato.style.backgroundColor = "#000000"
    dato.style.color = "#F5F5F5"
}

const GetLogin = ()=>{
    const btnLogin = document.querySelector(".btn-login")

    if(btnLogin){
        window.location.href = "/login"
    }
}
