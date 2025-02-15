import { Follow } from '../models/follow.js'


const followUserIds = async (identificacionID) => {

    try {
        
        // Sacar informacion de seguimiento(los que yo sigo y mis seguidores)
        const following = await Follow.find({
            user: identificacionID
        }).select({ "_id": 0, "__v": 0, "user": 0, "create_at":0})//.select({"followed":1, "_id":0})
        
        const followers = await Follow.find({
            followed:identificacionID
        }).select({"_id": 0, "__v": 0, "followed": 0, "create_at":0})//.select({"user":1, "_id":0})

        // Procesamos el array de identificadores
        let followingLimpio = []
        following.forEach(element => {
            followingLimpio.push(element.followed)
        });

        let followersLimpio = []
        followers.forEach(element => {
            followersLimpio.push(element.user)
        });

        return {
            followingID : followingLimpio,
            followersID : followersLimpio
        }

    } catch (error) {
        return {}
    }

}



export {
    followUserIds
}