import { GetQuantity } from "./cart.js";
import { GetGenres } from "./genre.js";
import { cargarVista, manejarRuta } from "./router.js";


//-------------------------GET BOOKS -------------------------------------//
async function GetBooks(){
    try{
        const response = await fetch('https://localhost:7164/api/Book/getBooks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode:'cors',
            credentials: "include" // 🔥 Esto permite que el backend reciba la cookie con el token
        });
        if (!response.ok) {
            if(response.status == 401){
                window.location.href = "/login"
                console.log("No estás registrado")
            }
            if(response.status == 403){
                window.location.href = "/login"
                console.log("No estás autorizado para acceder a este sitio")
            }
            console.log("No se pudo obtener los datos")
            throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        console.log("Datos obtenidos: ", data)
        return data.productos;
    }catch(err){
        console.error('Error:', err);
        return [];
    }
}

//? Mostrar libros
function RenderBooks(books) {
    const booklist = document.querySelector('.books-grid');
    if(booklist){
        booklist.innerHTML = '';
        console.log("BOOKS: ", books)
        books.forEach(book => {
            
            const bookCard = document.createElement('div');
            bookCard.classList.add("book-card");
            bookCard.dataset.iscart = book.isInCart
            bookCard.dataset.id = book.idBook
            bookCard.innerHTML = `
                                <div class="part1">
                                    <div class="book-cover">
                                        <img src="https://localhost:7164${book.imagePath}">
                                    </div>
                                </div>
                                <div class="part2">
                                    <h2 class="book-title">${book.title}</h2>
                                    <p class="book-author">${book.author}</p>
                                    <div class="book-meta">
                                        <span class="book-price">${book.price} PEN</span>
                                        <div class="book-rating">
                                            <span>4.8</span>
                                            <span>★★★★★</span>
                                        </div>
                                    </div>
                                    <div class="book-actions">
                                        <button class="action-btn primary add-cart"></button>
                                        <button class="action-btn secondary preview">Preview</button>
                                    </div>
                                </div>
                                `
    
            let addCart = bookCard.querySelector(".add-cart")
            const isInCart = book.isInCart;
            if(isInCart){
                addCart.textContent = "Ya está en carrito Ver Carro"
                addCart.style.opacity = "0.5"
                
            }else{
                addCart.textContent = "Agregar a carrito"
    
            }; 
            booklist.appendChild(bookCard);
    
            
        }); 
    }
    

    ToCart();
    // GetBookById()
   
    
}

//? Al presionar en ver cart en libros te dirige hacia carrito de compra.
const ToCart = ()=>{
    const bookCard = document.querySelector(".books-grid")
    if(bookCard){
        bookCard.addEventListener("click", async(e)=>{
            // const btnTarget = e.target.closest(".book-card")
            
            const btnAddCart  = e.target.closest(".add-cart")
            if(btnAddCart){
                const btnTarget = btnAddCart.closest(".book-card")
                const bookId = btnTarget.dataset.id
                const isInCart = btnTarget.dataset.iscart
                if (!bookId || isNaN(bookId)) {
                    console.error("El ID del libro no es válido.");
                    return;
                }
                if (isInCart == "true") {
                    history.pushState({},"", "/cart")
                    manejarRuta()
                } else {
                    console.log("Libro agregado a carrito")
                    await addBookToCart(bookId)
                }
                
            }else{
                // console.log("no existe boton")
                return
            }
        })
    }
    
}

const addBookToCart = async(bookId)=>{
    
    const quantityCart = document.querySelector(".hdr-cart-count").textContent
    

    const response = await fetch(`https://localhost:7164/api/Cart/addUserCart/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode:'cors',
        credentials: "include"
    });
    
    if (!response.ok) {
        
        return console.log("No se pudo AGREGAR ITEM AL CARRITO")
    }
    let number = parseInt(quantityCart) + 1
    // const data = await response.json();
    quantityCart.textContent = number
}

//-------------------------ADD BOOK -------------------------------------//
//? AGREGAR GENEROS EN SELECT DE ADDBOOK
export async function InsertGenres(){
    const generos = await GetGenres()
    console.log("DADA", generos)
    let genreOptions = document.querySelector("#genre-options");
    Array.from(generos).forEach(el=>{
        console.log("Procesando género:", el);
        let genreoption = document.createElement("option");
        genreoption.value = el.id;
        genreoption.textContent = el.name;
        genreOptions.appendChild(genreoption);
    })
    
}

 async function AddBook(){
    try{
        const formCreateBook = document.querySelector(".form-container-create")

        formCreateBook.addEventListener("submit", async (event) => {
            event.preventDefault(); // Evita la recarga de la página
            // public\images\2666Cover.png
            const formData = new FormData(formCreateBook); // Captura todos los datos del formulario
            const data = Object.fromEntries(formData.entries()); // Convierte FormData en un objeto
            
            // console.log(data); // { bookTitle: "1984", bookAuthor: "George Orwell" }
            // console.log(data.category)
            let tags = await splitTags(data.tags);
            let title = data.title
            let author = data.author
            let description = data.description
            let idGenre = data.idGenre
            let tagsconverted = tags
            let price = data.price
            let stock = data.stock
            let imageFile = data.image
            // let imagePath = `public/images/${data.imagePath.name}`
            console.log(title,description, author, price, stock, imageFile, idGenre, tagsconverted)
            console.log("data libro: ", data)
            console.log("formdata: ", formData)

            const response = await fetch('https://localhost:7164/api/Book/addBook', {
                method:"POST",
                // headers:{
                //     'Content-Type': 'application/json'
                // },
                // body:JSON.stringify({title:title,description:description, author:author, price:price, stock:stock, Image:imageFile, idGenre:idGenre, tags:tagsconverted}),
                body:formData,
                mode: 'cors',
                credentials: 'include'
            })

            const datos = await response.json();
            if(response.status !== 200){
                console.log(datos)
                return console.log("No se pudo guardar el libro")
            }

            console.log(datos.message)
            // // window.location.href="/books"
    
        });
    }catch(err){
        console.error('Error:', err);
        return [];
    }
 }

 async function splitTags(tags) {
    let tagsSplit = await tags.split(",").map(e=>e.trim())
    console.log(tagsSplit)

    return tagsSplit;
 }

//? Mostrar imagenes usando dropzone o cambios en pantalla.
export async function ShowImages(){
    const inputImage = document.getElementById("cover-image")
    let image = document.querySelector("#preview-cover")
    const dropzone = document.querySelector(".cover-upload")
    
    inputImage.addEventListener("change", ()=>{
        const files = inputImage.files;
        console.log("Archivos seleccionados:", files);
        for (let i = 0; i < files.length; i++) {
            // let image = document.createElement("img");
            // image.setAttribute("id", "preview-cover")
            // dropzone.appendChild(image)
            image.src = URL.createObjectURL(files[i])
        }
    })
    dropzone.addEventListener("dragover", (event)=>{
        event.preventDefault()
        event.stopPropagation()
    })

    dropzone.addEventListener("drop", (event)=>{
        event.preventDefault()
        event.stopPropagation()

        const files = event.dataTransfer.files;
        console.log("Archivos seleccionados:", files);
        for (let i = 0; i < files.length; i++) {
            image.src = URL.createObjectURL(files[i])
        }
    })
    AddBook()
}

// Función para cargar y mostrar los productos
export async function ChargerBooks() {
    const books = await GetBooks();
    RenderBooks(books);
    
    window.scrollTo(0, 0);
}



//?----------------------Detalles libros ------------------------------

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
        console.log("Libros by id obtenidos: ",data.message,data.productos, data.productos[0].title)
        
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
    
    const div = document.createElement("section")
    div.classList.add("book-details")
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
                            <button class="btn btn-primary">Agregar a carrito</button>
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
        // const stringConvert = tagsArray.map((tag)=>{
        //     stringTags += tag +",";
        // })
        // const spliter = stringTags.split(",", stringTags.length)
        // const withoutspace = spliter.filter(s=> s.trim());
        // console.log("Sin epacios: ", withoutspace)
        // const tags = withoutspace.map((tag)=>{
        //     let span = document.createElement("span")
        //     span.classList.add("tag")
        //     span.textContent = tag.trim()
        //     bookTag.appendChild(span)
        // })
        // console.log(stringTags, spliter, tags)
        // console.log("Tags: ", tagsArray.length)
        
}
