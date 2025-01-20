
const pruebaPublication = (req, res)=>{
    return res.status(200).send({
        mesage:"msj enviado desde controlador/publication.js"
    })
}


export {
    pruebaPublication
}