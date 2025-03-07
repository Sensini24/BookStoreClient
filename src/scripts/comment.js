export function AddComment(){
    const bookDetails = document.querySelector(".book-details")
    const idBook = bookDetails.dataset.id;
    const commentContainer = document.querySelector("#comment-text")
    commentContainer.addEventListener("click", async(event)=>{
        const textComment = commentContainer.querySelector(".comment-book")
        const btnComment = event.target.closest("#btn-comment")
        if(btnComment){
            console.log(textComment.value, idBook)
            const response = await fetch(`https://localhost:7164/api/Comment/addComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({BookId:idBook, Content:textComment.value}),
                mode:'cors',
                credentials: "include"
            });
            
            
            if (!response.ok) {
                return console.log("No se pudo AGREGAR EL COMENTARIO: ")
            }
            const data = await response.json();
            return console.log("Comentario AGREGADO CORRECTAMENTE: ", data)
        }
    })
    
    
    
    
    // textComment.addEventListener("input", (event)=>{
    //     let texto = event.target.value
    //     console.log(texto, idBook)
    // })
    
}