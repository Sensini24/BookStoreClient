
// import ".../styles/books"
async function GetBooks(){
    try{
        const response = await fetch('http://localhost:5112/Book/getBooks', {
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
        return data.books;
    }catch(err){
        console.error('Error:', err);
        return [];
    }
}


function RenderBooks(books) {
    const booklist = document.querySelector('.books-grid');
    booklist.innerHTML = '';

    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add("book-card");
        bookCard.innerHTML = `
                            <div class="book-cover">
                                <img src="${book.imagePath}">
                                <span class="book-badge">Best Seller</span>
                            </div>
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
                                <button class="action-btn primary">Add to Cart</button>
                                <button class="action-btn secondary">Preview</button>
                            </div>
                            `
        booklist.appendChild(bookCard);
    });
}

// Función para cargar y mostrar los productos
export async function ChargerBooks() {
    const books = await GetBooks();
    RenderBooks(books);

    window.scrollTo(0, 0);
}