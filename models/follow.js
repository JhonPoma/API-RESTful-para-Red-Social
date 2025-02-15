import { Schema, model } from "mongoose";

const followSchema = Schema({

    user : {
        type : Schema.ObjectId,
        ref : "User"
    },
    followed : {
        type : Schema.ObjectId,
        ref : "User"
       
    },
    create_at : {
        type : Date,
        default : Date.now
    }

})

const Follow = model("Follow", followSchema, "follows")

export {
    Follow
}

