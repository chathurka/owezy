import 'failure_code.dart';

class AppException implements Exception {
  const AppException(this.failureCode);

  final FailureCode failureCode;

  @override
  String toString() => 'AppException(${failureCode.runtimeType}: $failureCode)';
}
