

const pruebaUser = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/user.js"
    })
}


//exportamos acciones
// export const funciones =  {
//     pruebaUser
// }
export {
    pruebaUser
}