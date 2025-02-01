import {ChargerBooks} from  "./books.js"
import { hideHeader, PostLogin } from "./login.js";

async function cargarVista(vista) {
    try {
        // Suavizar la transición
        content.style.opacity = '0';
        const response = await fetch(`views/${vista}.html`);
        if (!response.ok) {
            throw new Error('Vista no encontrada');
        }
        const html = await response.text();
        document.getElementById('content').innerHTML = html;

        setTimeout(() => {
            content.style.opacity = '1';
        }, 300);

        
        if (vista === 'books') {
            setTimeout(() => {
                ChargerBooks();
            }, 150);
        }

        if(vista === 'login'){
            hideHeader();
            PostLogin()
        }
        
        // if (vista === 'login') {
        //     setTimeout(() => {
        //         ChargerBooks();
        //     }, 150);
        // }
    } catch (error) {
        console.error('Error al cargar la vista:', error);
        document.getElementById('content').innerHTML = '<p>Error al cargar la vista.</p>';
    }
}

export function manejarRuta() {
    
    const ruta = window.location.pathname;

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
            break;
        // case '/login':
        //     cargarVista('cart');
            break;
        default:
            cargarVista('login');
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


