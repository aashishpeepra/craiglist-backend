class HttpError extends Error {
    constructor(error,message, errorCode) {
      super(message);
      console.error(error,message,errorCode,Date.now())
      this.code = errorCode;
    }
  }
  
  module.exports = HttpError;