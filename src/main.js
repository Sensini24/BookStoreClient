// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

// import "../styles/main"
// 
import {manejarRuta} from "./scripts/router.js"
import {addItemsCart, AddOrRemoveItems} from "./scripts/header.js"
// import { GetHeader } from "./scripts/header.js";


// Cargar la vista inicial al cargar la página
window.addEventListener('DOMContentLoaded', async()=>{
    
    // await GetHeader();
    manejarRuta();
    addItemsCart();
    AddOrRemoveItems();
});