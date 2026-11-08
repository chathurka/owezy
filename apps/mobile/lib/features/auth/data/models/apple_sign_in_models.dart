class AppleSignInRequestModel {
  const AppleSignInRequestModel({
    required this.identityToken,
    this.authorizationCode,
    this.fullName,
    this.email,
  });

  final String identityToken;
  final String? authorizationCode;
  final String? fullName;
  final String? email;

  Map<String, dynamic> toJson() => {
        'identityToken': identityToken,
        if (authorizationCode != null) 'authorizationCode': authorizationCode,
        if (fullName != null) 'fullName': fullName,
        if (email != null) 'email': email,
      };
}
