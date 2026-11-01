import 'api_exception.dart';
import 'app_exception.dart';
import 'failure_code.dart';

AppException mapToAppException(Object error) {
  if (error is AppException) return error;
  if (error is ApiException) {
    return AppException(mapFailureCode(error));
  }
  return const AppException(CoreFailureCode.unknown);
}

FailureCode mapFailureCode(ApiException error) {
  if (error.isUnauthorized) return CoreFailureCode.unauthorized;
  if (error.isNotFound) return CoreFailureCode.notFound;
  final status = error.statusCode ?? 0;
  if (status >= 500) return CoreFailureCode.serverError;
  return CoreFailureCode.unknown;
}
