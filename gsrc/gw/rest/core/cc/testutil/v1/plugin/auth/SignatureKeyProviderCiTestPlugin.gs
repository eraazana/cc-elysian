package gw.rest.core.cc.testutil.v1.plugin.auth

uses gw.api.modules.rest.framework.v1.auth.jwt.JwsAlgorithm
uses gw.api.modules.rest.framework.v1.plugin.security.SignatureKeyProviderPluginBase
uses gw.util.StreamUtil

uses javax.crypto.SecretKey
uses javax.crypto.spec.SecretKeySpec
uses java.security.KeyPairGenerator
uses java.security.PrivateKey
uses java.security.PublicKey
uses java.security.SecureRandom

@Export
class SignatureKeyProviderCiTestPlugin extends SignatureKeyProviderPluginBase {

  var _secretKey = "abcdefghijklmnop1234567890ABCDEF"

  private static var _publicKey : PublicKey
  private static var _privateKey : PrivateKey

  private var kpg = KeyPairGenerator.getInstance("RSA")

  construct() {
    if (_publicKey == null || _privateKey == null) {
      // generate keys with a seeded SecureRandom so public/private keys will be the same every time
      var random = SecureRandom.getInstance("SHA1PRNG")
      random.setSeed(8)
      kpg.initialize(2048, random);
      var keyPair = kpg.generateKeyPair()
      _privateKey = keyPair.getPrivate()
      _publicKey = keyPair.getPublic()
    }
  }

  override function getSecretKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : SecretKey {
    if (!signatureAlgorithm.Symmetric) {
      throw new IllegalArgumentException("Not a symmetric key algorithm: ${signatureAlgorithm.AlgorithmName}")
    }
    return new SecretKeySpec(StreamUtil.toBytes(_secretKey), signatureAlgorithm.AlgorithmName)
  }

  override function getPublicKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : PublicKey {
    verifyRSA(signatureAlgorithm)
    return _publicKey
  }

  override function getPrivateKey(signatureAlgorithm : JwsAlgorithm, qualifiers : Map<String,Object> = null) : PrivateKey {
    verifyRSA(signatureAlgorithm)
    return _privateKey
  }

  private function verifyRSA(signatureAlgorithm : JwsAlgorithm) {
    if (signatureAlgorithm.Symmetric || signatureAlgorithm.CryptoAlgorithm != JwsAlgorithm.CryptoAlgorithm.RSA) {
      throw new IllegalArgumentException("Not an asymmetric RSA key algorithm: ${signatureAlgorithm.AlgorithmName}")
    }
  }
}