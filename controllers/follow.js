
const pruebaFollow = (req, res)=>{

    return res.status(200).send({
        mesage:"msj enviado desde controlador/follow.js"
    })


}

// EXPORTACION POR DEFECTO:
// export default pruebaFollow

// EXPORTACION POR NOMBRE: 
export  {
    pruebaFollow
}