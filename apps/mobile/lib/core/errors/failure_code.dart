abstract interface class FailureCode {}

enum CoreFailureCode implements FailureCode {
  unknown,
  connection,
  timeout,
  unauthorized,
  serverError,
  notFound,
}
