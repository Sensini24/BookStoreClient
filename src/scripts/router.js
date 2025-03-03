import { ChangePathDetails, ChargerBooks, GetBookById, InsertGenres, ShowImages} from  "./books.js"
import { ChargeCartItems, EditQuantity, PayOrder, ProcesarPago, RemoveItem } from "./cart.js";
import { hideHeader, PostLogin } from "./login.js";
import { verifyLogin } from "./user.js";

export async function cargarVista(vista, id) {
    try {
        // Suavizar la transición
        // content.style.opacity = '1';
        const response = await fetch(`/views/${vista}.html`);
        if (!response.ok) {
            throw new Error('Vista no encontrada');
        }
        const html = await response.text();
        document.getElementById('content').innerHTML = html;

        // setTimeout(() => {
        //     content.style.opacity = '1';
        // }, 300);

        if(vista === "detailsBook"){
            GetBookById()   
        }
        if (vista === 'books') {
            ProcesarPago()
            ChargerBooks();
            ChangePathDetails()
            
        }

        if(vista === 'login'){
            hideHeader();
            PostLogin();
        }

        if(vista === "addBook"){
            ShowImages();
            InsertGenres();
            
        }

        if(vista === "errorPages"){
            // hideHeader();
        }

        if(vista === "cart"){
            ChargeCartItems();
            EditQuantity()
            RemoveItem()
            PayOrder()
        }
        
        
    } catch (error) {
        console.error('Error al cargar la vista:', error);
        document.getElementById('content').innerHTML = '<p>Error al cargar la vista.</p>';
    }
}

export function manejarRuta() {
    
    const ruta = window.location.pathname;
    if (ruta.startsWith("/detailBook/")) {
        cargarVista('detailsBook'); // Asegúrate de que el nombre sea correcto
        return;
    }
    console.log("Rutas: ", ruta)
    switch (ruta) {
        case '/home':
            cargarVista('home');
            break;
        case '/books':
            cargarVista('books');
            console.log("Se eligio libros")
            break;
        case '/cart':
            cargarVista('cart');
            console.log("Se eligio cart")
            break;
        case '/addBook':
            verifyLogin() //MIDLEWARE PARA VERIFICAR SI EL QUE ESTA ABRIENDO LA VISTA ES ADMINISTRADOR
            cargarVista('addBook');
            break;
        case '/login':
            cargarVista("login")
            break;
        // case ruta.split("/", ruta.length)[1] === 'detailBook':
        //     console.log("ruta: ", ruta)
        //     cargarVista("detailsBook")
        //     break;
        case '/unauthorized-access':
            cargarVista("errorPages")
            break;
        default:
            cargarVista('books');
    }
}

// Escuchar cambios en la ruta (cuando el usuario hace clic en los enlaces)
window.addEventListener('popstate', manejarRuta);

// Interceptar clics en los enlaces
document.addEventListener('click', (e) => {
    const link = e.target.closest('a'); // Captura el enlace más cercano

    if (link && link.getAttribute('href').startsWith('/')) { // Solo si es una ruta interna
        e.preventDefault();
        const ruta = link.getAttribute('href');
        history.pushState(null, '', ruta); // Actualiza la URL sin recargar
        manejarRuta(); // Carga la vista correspondiente
    }
});


