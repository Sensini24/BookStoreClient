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
        // interceptarEnlaces() 
    }catch(err){
        console.error('Error:', err);
    }
}

export async function AddOrRemoveItems() {
    const user = await getUserInfo()
    console.log("Usuario: ", user)
    const btnLogin = document.querySelector(".login-container");
    const btnLogout = document.querySelector(".logout-container");
    const cartContainer = document.querySelector(".hdr-cart-container");
    const hedCarrito = document.querySelector("#cart-side")
    
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
    if(user.rol == "Cliente"){
        console.log("Si es cliente")
        cartContainer.style.display = "flex"
        hedCarrito.style.display = "flex"
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
        const target = e.target
        console.log("target: ", target)
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
        console.log("adstyle:", addStyle)
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

export function addItemsCart(){
    const cartIcon = document.querySelector('.hdr-cart-icon');
        const cartDropdown = document.querySelector('.hdr-cart-dropdown');
        const cartCount = document.querySelector('.hdr-cart-count');
        const addToCartBtn = document.getElementById('hdr-add-to-cart');
        const removeFromCartBtn = document.getElementById('hdr-remove-from-cart');
        const cartItems = document.getElementById('hdr-cart-items');

        let itemCount = 0;

        cartIcon.addEventListener('click', () => {
            cartDropdown.classList.toggle('show');
        });

        addToCartBtn.addEventListener('click', () => {
            itemCount++;
            updateCart();
        });

        removeFromCartBtn.addEventListener('click', () => {
            if (itemCount > 0) {
                itemCount--;
                updateCart();
            }
        });

        function updateCart() {
            cartCount.textContent = itemCount;
            cartItems.textContent = itemCount === 0 ? 'No items in cart' : `${itemCount} item${itemCount > 1 ? 's' : ''} in cart`;
        }

        document.addEventListener('click', (event) => {
            if (!cartIcon.contains(event.target) && !cartDropdown.contains(event.target)) {
                cartDropdown.classList.remove('show');
            }
        });
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