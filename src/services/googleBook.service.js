import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const googleSearchAPI = async (q, page, limit, API_KEY) => {
  try {
    const encodedQuery = encodeURIComponent(q);
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&startIndex=${page}&maxResults=${limit}&key=${API_KEY}`
    );

    return response.json();
  } catch (error) {
    throw new ApiError(502, "Bad Gateway", error.message);
  }
};

export default googleSearchAPI;
