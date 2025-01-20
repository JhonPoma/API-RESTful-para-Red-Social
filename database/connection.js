import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config() // Cargamos el archivo .env

const conectionDB = async()=>{
    
    try {
        const mongoURI = process.env.MONGO_URI
        await mongoose.connect(mongoURI)
        console.log("Conectado correctamente a la BD")
    } catch (error) {
        console.log(error)
        throw new Error("No se pudo conectar a la BD")
    }
}


export default conectionDB