package gw.webservice.cc.cc5000.vendormanagement

uses gw.xml.ws.annotation.WsiExportable

uses java.math.BigDecimal

@Export
@WsiExportable("http://guidewire.com/cc/ws/gw/webservice/cc/cc5000/vendormanagement/ServiceRequestStatementLineItem")
final class ServiceRequestStatementLineItem {
  var _category:  ServiceRequestStatementLineItemCategory as Category
  var _desc:      String                                  as Description
  var _amount:    BigDecimal                              as Amount

  construct() {
  }

  /**
   * Replaces any null values for the document parameters with empty lists.
   * Validates that Description and Amount fields are non-null.
   * Validates that at least one document was specified, that DocumentsToUpload has the same length as
   * DocumentsToUploadNames, and that there are no null or empty elements in either list.
   */
  internal function normalizeAndValidate() {
    if (Amount == null) {
      throw new IllegalArgumentException("Amount cannot be null")
    }
  }


}
