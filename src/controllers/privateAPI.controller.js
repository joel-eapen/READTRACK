import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import userModel from "../models/user.model.js";
import bookModel from "../models/book.model.js"

const addToLibrary = asyncHandler(
    async(req,res)=>{
        const{externalId,title,author,coverImg,isbn,totalPages} = req.body
        const user = await userModel.findOne({
            clerkUserId:req.user.clerkUserId
        })
        

        if(!user){
            throw new ApiError(404,"User not found")
        }

        let book = await bookModel.findOne({
            userId:user._id,
            externalId
        })

        if(book){
            throw new ApiError(409,"A similar book exists in your library")
        }

        if(!book){
            book = await bookModel.create({
                userId:user._id,
                externalId,
                title,
                author,
                coverImg,
                isbn,
                totalPages,
                status:"want_to_read"


            })
        }


        return res.status(200).json(new ApiResponse(200,book))

        
    }
)


export default {
    addToLibrary
}
