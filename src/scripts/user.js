export async function getUserInfo(){
    const response = await fetch("http://localhost:5112/User/getUserInfo",{
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
        },
        mode:"cors",
        credentials:"include"
    })

    if(!response.ok){
        console.log("No existe ningun usuario logeado")
        return null;
    }
    const data = await response.json()
    console.log("Usuario logeado: ", data)
    return data
}