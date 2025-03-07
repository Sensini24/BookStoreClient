import { addBookToCart, IsInCartOrNotButtonName } from "./books"
import { AddComment } from "./comment"
import { cargarVista, manejarRuta } from "./router"

export async function ChangePathDetails(){
    const bookContainer= document.querySelector(".books-grid")
    if(bookContainer){
        bookContainer.addEventListener("click", async(event)=>{
            const btnPreview = event.target.closest(".preview")
            const card = event.target.closest(".book-card")
            const idBook = card.dataset.id
            if (btnPreview) {
                try {
                    history.pushState({}, "", `/detailBook/${idBook}`);
                    // await cargarVista('detailsBook'); // Usa await si cargarVista es async
                    cargarVista("detailsBook", idBook)
                } catch (error) {
                    console.error("Error al cargar la vista:", error);
                }
            }
            
        })
    }
}


export async function GetBookById(){
    const currentPathDetails = window.location.pathname
    const idBook = currentPathDetails.split("/", currentPathDetails.length).pop()
    if(idBook){
        console.log("IDBOOK: ", idBook)
        const response = await fetch(`https://localhost:7164/api/Book/getBooksById/${idBook}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode:'cors',
            credentials: "include"
        });
        const data = await response.json()

        if(response.status !==200){
            return console.log("No se obtuvo los libros")
        }
        AddInfoDetailsBook(data)
        console.log("Libros by id obtenidos: ",data.message,data.productos, data.productos[0].title, data)
        return
    }
    console.log("Idbook no encontrado")

}


export async function AddInfoDetailsBook(data){
    // const data = await GetBookById();
    console.log("DATA DESDE ADINFO: ", data)
    const cartDetails = document.querySelector(".main-details")
    const referenceNode = document.querySelector(".related-books")
    
    const ruta = data.productos[0].imagePath
    const title = data.productos[0].title
    const author = data.productos[0].author
    const price = data.productos[0].price
    const description = data.productos[0].description
    const tagsArray = data.productos[0].tags
    const idBook = data.productos[0].idBook
    const isInCart = data.productos[0].isInCart
    
    const div = document.createElement("section")
    div.classList.add("book-details")
    div.setAttribute("data-id",idBook)
    let item = `
                    <img src="https://localhost:7164${ruta}" alt="The First 90 Days" class="book-cover">
                    <div class="book-info">
                        <h1>${title}</h1>
                        <p class="book-author">${author}</p>
                        <div class="book-rating">
                            <span class="star">★★★★★</span>
                            <span>4.8 (1,234 ratings)</span>
                        </div>
                        <p class="book-price">$${price}</p>
                        <p class="book-description">
                            ${description}
                        </p>
                        <div class="book-tags">
                            
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-primary add-cart">Agregar a carrito</button>
                            <button class="btn btn-secondary">Agregar a lista de deseos</button>
                        </div>
                    </div>
                `
        div.innerHTML = item
        cartDetails.insertBefore(div,referenceNode)

        //?AGREGAR LOS TAGS
        let stringTags= ""
        const bookTag = document.querySelector(".book-tags")
        tagsArray // Eliminar espacios innecesarios
        .filter(tag => tag.length > 0)
        .map((d)=>{
            stringTags+=d + ","
        });

        stringTags.split(",", stringTags.length)
        .filter(s=>s.trim()) // Filtrar vacíos
        .forEach(tag => {
            const span = document.createElement("span");
            span.classList.add("tag");
            span.textContent = tag.trim();
            bookTag.appendChild(span);
            console.log("Tags: ", tag)
        });

        //? Llamar a metodo para poder guardar libro en cart.
        let addCart = document.querySelector(".add-cart")
        tocart2(idBook, addCart, isInCart);
        
        IsInCartOrNotButtonName(addCart, isInCart)

        //? Agregar comentario en Text Content
        AddComment()
}

const tocart2 = async(bookId, btnAddCart, isInCart)=>{
    btnAddCart.addEventListener("click", async()=>{
        if (!bookId || isNaN(bookId)) {
            console.error("El ID del libro no es válido.");
            return;
        }
        if (isInCart == "true" || btnAddCart.textContent == "Ya está en carrito Ver Carro") {
            history.pushState({},"", "/cart")
            manejarRuta()
        } else {
            console.log("Libro agregado a carrito")
            await addBookToCart(bookId, btnAddCart)
        }
    })
    
}