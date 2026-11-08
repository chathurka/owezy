import 'package:google_sign_in/google_sign_in.dart';

import '../../../core/config/env_config.dart';
import '../domain/google_auth_gateway.dart';

class GoogleAuthGatewayImpl implements GoogleAuthGateway {
  GoogleAuthGatewayImpl({GoogleSignIn? googleSignIn})
      : _googleSignIn = googleSignIn ??
            GoogleSignIn(
              scopes: const ['email', 'profile'],
              serverClientId: EnvConfig.googleServerClientId.isEmpty
                  ? null
                  : EnvConfig.googleServerClientId,
            );

  final GoogleSignIn _googleSignIn;

  @override
  Future<GoogleCredential?> requestCredential() async {
    try {
      final account = await _googleSignIn.signIn();
      if (account == null) {
        return null;
      }

      final auth = await account.authentication;
      final idToken = auth.idToken;
      if (idToken == null || idToken.isEmpty) {
        return null;
      }

      return GoogleCredential(
        idToken: idToken,
        email: account.email,
        fullName: account.displayName,
      );
    } on Exception {
      rethrow;
    }
  }
}
