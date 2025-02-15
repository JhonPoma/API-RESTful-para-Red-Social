import { Schema, model } from "mongoose"; 

const userSchema = Schema({
    name : {
        type:String,
        required : true
    },
    surname: String,
    bio : String,
    nick : {
        type:String,
        required: true
    },
    email : {
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    role : {
        type : String,
        default : 'role_user'
    },
    image : {
        type: String,
        default : 'default.png'
    },
    created_at : {
        type : Date,
        default : Date.now
    }


})

// Asignamos el modelo a una constante
const User = model('User', userSchema, 'users')

export {
    User
}


/*
user: nombre del modelo
userSchema : esquema que define la estructura de los documentos en la coleccion
users : nombre de la coleccion en la BD de MongoDB.
*/