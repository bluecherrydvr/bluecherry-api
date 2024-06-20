export default class ErrorResponse {
  public statusCode: Number;
  public message: String;
  public information: any;

  constructor(statusCode: Number, message: String, information?: any) {
    this.statusCode = statusCode;
    this.message = message;
    if (information != null) this.information = information;
  }
}
