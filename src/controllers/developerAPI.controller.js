import asyncHandler from "../utils/asyncHandler.js";
import generateApiKey from "../services/apiKey.service.js";
import userModel from "../models/user.model.js";
import apiKeyModel from "../models/apiKey.model.js";
import bookModel from "../models/book.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createAPIKey = asyncHandler(async(req,res)=>{

    const {name} = req.body
    if(!req.body){
        throw new ApiError(400,"Name is required")
    }
    const user = await userModel.findOne({
        clerkUserId:req.user.clerkUserId
    })

    if(!user){
        throw new ApiError(404,"User not found")
    }
    const {key,apiHashed} = generateApiKey()
    const apiKey = await apiKeyModel.create({
        userId:user._id,
        name,
        apiHashed
    })
    
    return res.status(201).json(new ApiResponse(201,{
        key
    },"API key has been created successfully"))
    

});

const findKeyMetaData = asyncHandler(async(req,res)=>{
    const user = await userModel.findOne({
        clerkUserId:req.user.clerkUserId
    })
    if(!user){
        throw new ApiError(404,"User not found")
    }

    const apiKeys = await apiKeyModel.find({
        userId:user._id
    })
    .select("-apiHashed")

    if(apiKeys.length===0){
        return res.status(200).json(new ApiResponse(200,{
            apiKeys:[]
        },"No API keys found"))
    }

    return res.status(200).json(new ApiResponse(200,{
        apiKeys
    },"API keys fetched successfully"))
});

const deleteAPIKey = asyncHandler(async(req,res)=>{
    const{id} = req.params
    const isValid = mongoose.isValidObjectId(id)
    if(!isValid){
        throw new ApiError(400,"Mongo object Id is invalid")
    }
    const user = await userModel.findOne({
        clerkUserId:req.user.clerkUserId
    })

    if(!user){
        throw new ApiError(404,"User not found")
    }

    const apiKey = await apiKeyModel.findOne({
        userId:user._id,
        _id:id
    })

    if(!apiKey){
        throw new ApiError(400,"No such API key exists")
    }

    apiKey.revokedAt = new Date()
    await apiKey.save()

    return res.status(200).json(new ApiResponse(200,apiKey,"Api key is deleted successfully"))
});

const getAllBooks = asyncHandler(async(req,res)=>{
    const userId = req.apiKey.userId
    const {page,limit} = req.query
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber-1)*limitNumber

    if(pageNumber<=0 || limitNumber <=0){
        throw new ApiError(401,"Invalid query params")
    }
    if(!userId){
        throw new ApiError(404,"User Id not found")
    }


    const [books, totalDocuments] = await Promise.all([
        bookModel.find({
        userId
    })
    .skip(skip)
    .limit(limitNumber)
    .sort({createdAt:-1})
    .select("-_id -userId"),

    bookModel.countDocuments({userId})
    ])

    const totalPage = Math.ceil(totalDocuments/limitNumber)

    if(books.length===0){
        return res.status(200).json(new ApiResponse(200,{
            books,
            pagination:{
                page:pageNumber,
                limit:limitNumber,
                totalDocuments,
                totalPage
            }
        },"No books to fetch"))
    }

    return res.status(200).json(new ApiResponse(200,{
            books,
            pagination:{
                page:pageNumber,
                limit:limitNumber,
                totalDocuments,
                totalPage
            }
        },"Book fetched successfully"))

});

export default {
    createAPIKey,
    findKeyMetaData,
    deleteAPIKey
}