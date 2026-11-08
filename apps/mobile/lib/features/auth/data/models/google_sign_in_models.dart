class GoogleSignInRequestModel {
  const GoogleSignInRequestModel({
    required this.idToken,
    this.fullName,
    this.email,
  });

  final String idToken;
  final String? fullName;
  final String? email;

  Map<String, dynamic> toJson() => {
        'idToken': idToken,
        if (fullName != null) 'fullName': fullName,
        if (email != null) 'email': email,
      };
}
