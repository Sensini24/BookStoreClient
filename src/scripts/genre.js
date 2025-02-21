export async function GetGenres() {
    const response = await fetch('https://localhost:7164/api/Genre/getGenre',{
        method:"GET",
        headers:{
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
    })

    const datos = await response.json();
    if(!response.status == 200){
        console.log("No se pudo obtener los generos")
    }
    console.log("Generos: ", datos)
    return datos.generos
}