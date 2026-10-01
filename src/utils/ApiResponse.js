/**
 * Standardized success response wrapper.
 * Keeps all successful API responses in a consistent shape.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 200, 201)
   * @param {*} data - The payload to return to the client
   * @param {string} message - Human-readable message
   */
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Sends this response using the given Express res object.
   * @param {import("express").Response} res
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponse;
