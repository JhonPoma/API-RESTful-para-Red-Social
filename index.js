import conectionDB from './database/connection.js'
import express from 'express'
import cors from 'cors'

console.log("API NODE para RED SOCIAL encendida...!")

// conexion a la bd
conectionDB()

const app = express()
const PORT = 3900;

//configirarmos el cors
app.use(cors())

// convertir los datos del body a objetos js
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/ruta-prueba', (req,res)=>{
    return res.status(200).json({
        "id":1,
        "nomre": "jhon"
    })
})

import rutaUsuario from './routes/user.js'
import rutaPublicacion from './routes/publication.js'
import rutaFollow from './routes/follow.js'

app.use('/api/user', rutaUsuario);
app.use('/api/publication', rutaPublicacion);
app.use('/api/follow', rutaFollow);



app.listen(PORT, ()=>{
    console.log(`servidor corriendo ${PORT}`)
})