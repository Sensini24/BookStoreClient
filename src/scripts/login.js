export function hideHeader(){
    const content = document.getElementById("content");
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if(footer){
        footer.style.display = "none";
    }

    if(header){
        header.style.display = "none";
    }
    
    
}

export async function PostLogin(){
    
    try{
        const logbtn = document.querySelector(".log-btn")
        logbtn.addEventListener("click", async(event)=>{
            const email = document.querySelector(".email").value;
            const password = document.querySelector(".password").value;
            
            event.preventDefault()
            const response = await fetch('https://localhost:7164/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
                credentials:"include"
            });
        
            const data = await response.json();

            if (!response.ok) {
                console.log("datos incorrectos: ", data)
                throw new Error('Error al logearse');
                
            }
            if(data.success == true){
                console.log("Datos recibidos:", data);
                window.location.href = "/books"
            }
            
        })
        
    }catch(err){
        console.error('Error:', err);
    }
}

export async function Logout(){
    const logout = document.querySelector(".logout-container");
    logout.addEventListener("click", async ()=>{
        const response = await fetch('https://localhost:7164/api/Auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode:"cors",
            credentials:"include"
        });
    
        const data = await response.json();

        if (!response.ok) {
            console.log("datos incorrectos: ", data)
        }
        if(data.success == true){
            console.log("Datos recibidos:", data);
            window.location.href = "/login"
        }
    })
}