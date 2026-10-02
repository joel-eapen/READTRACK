import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import googleSearchAPI from "../services/googleBook.service.js";

const search = asyncHandler(async (req, res) => {
  const { q, page, limit } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  if (pageNumber <= 0 || limitNumber <= 0) {
    throw new ApiError(400, "Incorrect query");
  }
  let response;
  try {
    response = await googleSearchAPI(
      q,
      pageNumber,
      limitNumber,
      process.env.GOOGLE_BOOKS_API_KEY
    );
  } catch (error) {
    throw new ApiError(502, "Bad Gateway");
  }
  

  if (!response || response === null) {
    return res.status(200).json(
      new ApiResponse(200, {
        data: response,
        pagination: {
          pageNumber,
          limitNumber,
        },
      })
    );
  }

  if(response.totalItems===0){
    return res.status(200).json(new ApiResponse(200,{
      data:[]
    },"No result"))
  }

  const parsedItems = response.items.map((item) => {
    return {
      externalId: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0],
      coverImg: item.volumeInfo.imageLinks?.thumbnail,
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      totalPages: item.volumeInfo.pageCount,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, {
      data: parsedItems,
      pagination: {
        pageNumber,
        limitNumber,
      },
    })
  );
});

export default {
  search,
};
