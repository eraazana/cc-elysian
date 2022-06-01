package gw.auth

uses gw.auth.gwhub.AuthConfig
uses gw.auth.gwhub.AuthUtil

/**
 * This class is used by the ui, to check if it should change behavior and supply some values for messages and exits.
 * This can be modified so that the pcf pages remain unchanged.
 */
@SuppressWarnings("HiddenPackageReference")
@Export
class AuthHelper {
  /**
   * This will return true if the is login fields should be displayed.
   *
   * IMPLEMENTATION NOTE: Customers who need to use both during testing (i.e., to create new users as su) can
   * change this to reflect that sometimes even with oauth enabled they want those fields active.
   *
   * @return true to display fields
   */
  static function displayLoginFields() : boolean {
    return !AuthConfig.Instance.FilterActive
  }

  /**
   * This will return the oauth log out field
   *
   * @return the url
   */
  static property get LogoutUrl() : String {
    return AuthConfig.Instance.LogoutUrl
  }

  static function hasErrorMessage() : boolean {
    var message = errorMessage()
    return message != null
  }

  /**
   * Extract the OAuth error message from the session by directly accessing the session.
   *
   * @return the error message if there is one, otherwise null.
   */
  static function errorMessage() : String {
    return AuthUtil.ErrorMessageInSession
  }

  static function message(loginFormMessage : String) : String {
    if (loginFormMessage != null && !loginFormMessage.Empty) {
      return loginFormMessage
    }
    return errorMessage()
  }
}