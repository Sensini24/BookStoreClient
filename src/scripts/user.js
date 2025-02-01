export async function getUserInfo(){
    const response = await fetch("https://localhost:7113/User/getUserInfo",{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
        },
        mode:"cors",
        credentials:"include"
    })
    const data = await response.json()
    if(!response.ok){
        console.log("No existe ningun usuario logeado")
        return data;
    }
    
    console.log("Usuario logeado: ", data)
    return data
}