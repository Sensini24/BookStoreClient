async function getCart(){
    const response = await fetch("https://localhost:7164/api/Cart/getUserCart",{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
        },
        mode:"cors",
        credentials:"include"
    })
    const data = await response.json()
    if(!response.ok){
        console.log(data.message)
        return data;
    }
    
    console.log("Items Cargados: ", data.cartdto)

    return data.cartdto.cartItems
}

export async function ChargeCartItems(){
    const containerItem = document.querySelector(".cart-items");
    const data = await getCart();
    const array = Array.from(data)
    await AddContentOrderSummary(array)
    if(array.length == 0){
        containerItem.innerHTML = `
        <div class="cart-empty">
            <h2>No tienes libros en tu carrito</h2>
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
            </div>
        </div>
        `
        return console.log("No existen items en el carrito")
        
    }
    console.log("DATA DESDE CART: ", array)
    containerItem.innerHTML = "";
    array.forEach(element => {
        const item = document.createElement("div");
        
        item.classList.add("cart-items")
        item.setAttribute("id","cart-container-item")
        item.innerHTML = `
                <div class="cart-item" data-id=${element.book.id} >
                    <img class="item-image" src="https://localhost:7164${element.book.imagePath}">
                    <div class="item-details">
                        <h3>${element.book.title}</h3>
                        <p class="item-author">${element.book.author}</p>
                        <p class="item-price class">S/ <span class="item-price"> ${element.book.price}</span></p>
                        <div class="quantity-control">
                            <button class="quantity-btn" id="rest">-</button>
                            <span class="quantity">${element.quantity}</span>
                            <button class="quantity-btn" id="add">+</button>
                        </div>
                        <p class="item-price-subtotal" style="font-family: 'Space Grotesk', sans-serif;margin-top:15px; font-size:1.2rem; color:#000000";>
                        SubTotal: S/ 
                        <span class="subtotal-span" style="font-family: 'Space Grotesk', sans-serif;"></span> </p>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
                `
        containerItem.appendChild(item)

        const subtotal = item.querySelector(".subtotal-span");
        // console.log("price: ", element.book.price * element.quantity)
        subtotal.textContent =  element.book.price * element.quantity
        
        
        
    });

    
    //? Suma de precios para Order.
    // const totalPrice = array.map(pr => pr.book.price)
    //                     .reduce((sum, price) => sum + price);

    // console.log(totalPrice);
    
}

export async function EditQuantity(){

    const cartItems = document.querySelector(".cart-items")
    cartItems.addEventListener("click", async (event)=>{
        
        const completeCart = event.target.closest(".cart-item")
        const bookid = completeCart.dataset.id
        const subtotal = completeCart.querySelector(".subtotal-span");

        const addBtn = event.target.closest("#add")
        const restBtn = event.target.closest("#rest")

        let quantity = completeCart.querySelector(".quantity")
        let price = completeCart.querySelector("span.item-price")
        let priceFloat = parseFloat(price.textContent)
        let totalPrice = document.querySelector(".total-price")
        let totalPriceFloat = parseFloat(totalPrice.textContent)
        
        var number = parseInt(quantity.textContent)
        if(restBtn){
            if(number <=1){
                return
            }
            number = number-1
            quantity.textContent = number
            changeCount(bookid, number)
            totalPriceFloat -= priceFloat
            totalPrice.textContent = totalPriceFloat.toString()
            
            // console.log("cantidad: ", number)
        }
        if(addBtn){
            number = number+1
            quantity.textContent = number
            changeCount(bookid, number)
            totalPriceFloat += priceFloat
            totalPrice.textContent = totalPriceFloat.toString()
            // console.log("cantidad: ", number)
        }

        if(price){
            console.log("Subtotal: ", parseFloat(price.textContent) * parseInt(quantity.textContent))
            let total = parseFloat(price.textContent) * parseInt(quantity.textContent)
            subtotal.textContent = total.toString()
        }else{
            console.log("No hay price")
        }
        
        
        
    })
    
}

 const changeCount = async (bookid, number)=>{
    const response = await fetch('https://localhost:7164/api/Cart/editItems', {
        method:"PUT",
        headers:{
            'Content-Type': 'application/json'
        },
        // body:JSON.stringify({title:title,description:description, author:author, price:price, stock:stock, Image:imageFile, idGenre:idGenre, tags:tagsconverted}),
        body:JSON.stringify({bookId: bookid, quantity: number}),
        mode: 'cors',
        credentials: 'include'
    })

    const datos = await response.json();
    if(response.status !== 200){
        console.log(datos)
        return console.log("No se pudo guardar el libro")
    }

    console.log("Cart Item editado: ", datos.message)
    // getCart()
}

export async function GetQuantity(){
    const response = await fetch('https://localhost:7164/api/Cart/getQuantity', {
        method:"GET",
        headers:{
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
    })

    
    if(response.status !== 200){
        return console.log("No se obtuvo la cantidad")
    }
    const datos = await response.json();
    console.log("Cantidad: " , datos)
    return datos;
}

export async function RemoveItem(){
    const containerItems = document.querySelector(".cart-items");
    containerItems.addEventListener("click", async (event)=>{
        const cartItem = event.target.closest(".cart-item")
        const btnRemove = event.target.closest(".remove-btn")
        const bookId = cartItem.dataset.id
        const toRemoveContainer = event.target.closest("#cart-container-item")
        console.log("Btn Remove: ", btnRemove, cartItem.querySelector(".item-author"), bookId, toRemoveContainer)

        if(btnRemove){
            const response = await fetch(`https://localhost:7164/api/Cart/removeItem/${bookId}`, {
                method:"DELETE",
                headers:{
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include'
            })
        
            
            if(response.status !== 200){
                return console.log("No se pudo eliminar el item del carrito")
            }
            const datos = await response.json();

            deleteContainer(toRemoveContainer)
            console.log("Item eliminado: " , datos.message)
        }
    })
}

const deleteContainer =(toRemoveContainer)=>{
    toRemoveContainer.remove();
}

async function AddContentOrderSummary(items){

    const totalPrice = document.querySelector(".total-price")
    console.log("Elementos;: ", items)
    console.log("Suma de subtotales: ", await items.map(cartItems =>cartItems.quantity * cartItems.unitPrice).reduce((sum, price)=>sum+price))
    const total = await items.map(cartItems =>cartItems.quantity * cartItems.unitPrice).reduce((sum, price)=>sum+price)
    totalPrice.textContent = total.toString()
    // const containerItem = document.querySelectorAll("#cart-container-item");
    // let total  = 0;
    // containerItem.forEach(element =>{
    //     const title = element.querySelector(".item-author")
    //     const subTotal = parseFloat(element.querySelector(".subtotal-span").textContent)
        
    //     console.log("titulos prueba: ", title)
    //     console.log("subTotal: ", subTotal)
    //     total += subTotal
    // })
    
    // console.log("total: ", total)
}

export async function PayOrder() {
    const checkoutBtn = document.querySelector(".checkout-btn")
    checkoutBtn.addEventListener("click", async ()=>{
        const data = await getCart();
        const array = Array.from(data)
        let total = await array.map(cartItems =>cartItems.quantity * cartItems.unitPrice).reduce((sum, price)=>sum+price);
        let orderDetails = array.map(item => ({
            bookId: item.book.id,
            quantity: item.quantity,
            price: item.unitPrice
        }));

        // Construir el objeto con el formato correcto
        const orderData = {
            total: total,
            orderDetails: orderDetails // Aquí va la lista
        };
        console.log(orderData)

        const response = await fetch('https://localhost:7164/api/Order/payOrder', {
            method:"POST",
            headers:{
                'Content-Type': 'application/json'
            },
            // body:JSON.stringify({title:title,description:description, author:author, price:price, stock:stock, Image:imageFile, idGenre:idGenre, tags:tagsconverted}),
            body:JSON.stringify(orderData),
            mode: 'cors',
            credentials: 'include'
        })
    
        const datos = await response.json();
        if(response.status !== 200){
            console.log(datos)
            return console.log("No se pudo pagar la cuenta")
        }
    

        
        window.location.href = datos.approveUrl


        console.log("Cart pagado: ", datos)
    })
}

export async function GetSuccess(token) {
    const response = await fetch(`https://localhost:7164/api/Order/paypalSuccess/${token}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        credentials: 'include'
    });

    const datos = await response.json();
    if (response.status !== 200) {
        console.log(datos);
        return console.log("No se pudo capturar el pago");
    }

    console.log("Pago procesado con éxito:", datos);
    alert("Pago realizado con éxito!");
}

