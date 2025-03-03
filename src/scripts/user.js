
export async function getUserInfo(){
    const response = await fetch("https://localhost:7164/api/User/getUserInfo",{
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

//MIDDELWARE PARA VERIFICAR ROLES EN CLIENTE.
export async function verifyLogin(){
    const userCurrent = await getUserInfo();
    console.log("ROL ACTUAL: ", userCurrent.rol)
    if(userCurrent.rol != "Administrador" || userCurrent == null){
        console.log(userCurrent.rol)
        // hideHeader()
        window.location.href = "/unauthorized-access"
    }
}