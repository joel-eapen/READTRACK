import ApiError from "../utils/ApiError.js"
import { hashApiKey } from "../services/apiKey.service.js"
import apiKeyModel from "../models/apiKey.model.js"

const apiAuth = async(req,res,next)=>{
    const apiKey = req.header("x-api-key")
    if(!apiKey){
        throw new ApiError(401,"API key is not provided")
    }

    const apiKeyHash = hashApiKey(apiKey)

    const isKeyMatch = await apiKeyModel.findOne({
        apiHashed:apiKeyHash
    })

    if(!isKeyMatch){
        throw new ApiError(401,"API key does not match")
    }

    if(isKeyMatch.revokedAt){
        throw new ApiError(401,"API key has been revoked")
    }

    req.apiKey = {
        id:isKeyMatch._id,
        userId: isKeyMatch.userId
    }

    isKeyMatch.lastUsedAt = new Date()

    await isKeyMatch.save()

    next()
}

export default apiAuth