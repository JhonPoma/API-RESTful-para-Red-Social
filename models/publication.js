
import {Schema, model} from 'mongoose'


const publicationSchema = Schema({

    user : {
        type : Schema.ObjectId,
        ref : "User"            // hacemos una referencia al modelo user
    },

    text : {
        type : String,
        required : true
    },
    file : {
        type : String
    },
    created_at :{
        type : Date,
        default : Date.now
    }
})

const Publication = model("Publication", publicationSchema, "publications")

export {
    Publication
}