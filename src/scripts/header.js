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
        // interceptarEnlaces() 
    }catch(err){
        console.error('Error:', err);
    }
}

export async function AddOrRemoveItems() {
    const user = await getUserInfo()
    console.log("Usuario: ", user)
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