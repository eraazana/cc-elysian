package gw.webservice.cc.cc1000.vendormanagement

uses gw.api.locale.DisplayKey
uses gw.core.vendormanagement.servicerequeststate.ServiceRequestNextActionGwBase
uses gw.vendormanagement.servicerequeststate.ServiceRequestNextAction
uses gw.xml.ws.annotation.WsiExportable
uses typekey.Currency

/**
 * Contains summary information about a service request. An instance of this class is
 * created and returned for every service request matching a search, so it should have
 * only a minimal set of fields.
 */
@Export
@WsiExportable("http://guidewire.com/cc/ws/gw/webservice/cc/cc1000/vendormanagement/ServiceRequestSummary")
final class ServiceRequestSummary {

  /**
   * A unique number generated by ClaimCenter to identify this service request.
   */
  var _serviceRequestNumber : String as ServiceRequestNumber
  
  /**
   * A reference number assigned to this service request by the specialist. This value
   * is not used inside ClaimCenter but is expected to be meaningful to the specialist.
   * It may be the ID of a related record in a third-party system.
   */
  var _serviceRequestReferenceNumber : String as ServiceRequestReferenceNumber

  /**
   * The kind of this service request, such as quote-only or quote-and-perform-service.
   */
  var _kind : ServiceRequestKind as Kind

  /**
   * The name of the Kind in the current locale.
   */
  var _kindName : String as KindName

  /**
   * The currency of this service request. This is also the currency of any quotes, invoices,
   * and checks.
   */
  var _currency : Currency as Currency

  /**
   * Indicates the next action that should normally be performed on this service request.
   */
  var _nextAction : ServiceRequestNextAction as NextAction

  /**
   * The date that the specialist expects to provide a quote. This field is editable through
   * ServiceRequestAPI.
   */
  var _expectedQuoteCompletionDate : Date as ExpectedQuoteCompletionDate

  /**
   * Indicates whether the expected quote completion date is currently applicable and whether
   * it is editable through ServiceRequestAPI.
   */
  var _expectedQuoteCompletionDateApplies : boolean as ExpectedQuoteCompletionDateApplies

  /**
   * The date that the specialist expects to complete the work. This field is editable through
   * ServiceRequestAPI.
   */
  var _expectedServiceCompletionDate : Date as ExpectedServiceCompletionDate

  /**
   * Indicates whether the expected service completion date is currently applicable and whether
   * it is editable through ServiceRequestAPI.
   */
  var _expectedServiceCompletionDateApplies : boolean as ExpectedServiceCompletionDateApplies

  /**
   * The claim number for this service request's claim.
   */
  var _claimNumber : String as ClaimNumber

  /**
   * The policy number for this service request's claim's policy.
   */
  var _policyNumber : String as PolicyNumber

  /**
   * The customer contact with whom the specialist should coordinate the work.
   */
  var _customerContact : ContactSummary as CustomerContact

  /**
   * This service request's current place in its life cycle.
   */
  var _progress : ServiceRequestProgress as Progress

  /**
   * The name of the Progress in the current locale.
   */
  var _progressName : String as ProgressName

  /**
   * The current quote status for this service request.
   */
  var _quoteStatus : ServiceRequestQuoteStatus as QuoteStatus

  /**
   * The name of the QuoteStatus in the current locale.
   */
  var _quoteStatusName : String as QuoteStatusName

  /**
   * Whether this service request has a quote.
   */
  var _hasQuote : boolean as HasQuote

  /**
   * The default operation to be performed on this service request. The operation
   * can be invoked on ServiceRequestAPI.
   */
  var _defaultOperation: ServiceRequestOperation as DefaultOperation

  /**
   * The operations that can currently be performed on this service request. The values in
   * this list determine which functions can be invoked on ServiceRequestAPI.
   */
  var _otherOperations: List<ServiceRequestOperation> as OtherOperations

  /**
   * The user assigned to this service request.
   */
  var _adjuster : ContactSummary as Adjuster

  /**
   * The list of the services to be performed for this service request.
   */
  var _servicesRequested : List<Service> as ServicesRequested

  construct() {}

  construct(serviceRequest : ServiceRequest) {
    ServiceRequestNumber = serviceRequest.ServiceRequestNumber
    ServiceRequestReferenceNumber = serviceRequest.ServiceRequestReferenceNumberGw
    Kind = serviceRequest.Kind
    KindName = Kind.DisplayName
    Currency = serviceRequest.Currency
    var stateHandler = serviceRequest.createStateHandler()
    var action = serviceRequest.nextActionDefinition(stateHandler).NextAction
    if (action != null) {
      NextAction = mapNextActionDefinitionToEnum(action)
    }
    ExpectedQuoteCompletionDate = serviceRequest.ExpectedQuoteCompletionDateGw
    ExpectedQuoteCompletionDateApplies = serviceRequest.expectedQuoteCompletionDateApplies(stateHandler)
    ExpectedServiceCompletionDate = serviceRequest.ExpectedServiceCompletionDateGw
    ExpectedServiceCompletionDateApplies = serviceRequest.expectedServiceCompletionDateApplies(stateHandler)
    ClaimNumber = serviceRequest.Claim.ClaimNumber
    PolicyNumber = serviceRequest.Claim.Policy.PolicyNumber
    CustomerContact = new ContactSummary(serviceRequest.Instruction.CustomerContactGw)
    CustomerContact.Description = DisplayKey.get("Webservice.ServiceRequest.CustomerContact")
    Progress = serviceRequest.Progress
    ProgressName = Progress.DisplayName
    QuoteStatus = serviceRequest.QuoteStatus
    QuoteStatusName = QuoteStatus.DisplayName
    HasQuote = serviceRequest.LatestQuote != null
    var nextActionDefaultOperation = serviceRequest.nextActionDefinition(stateHandler).DefaultOperation
    DefaultOperation = serviceRequest.CoreSR.operationAvailable(nextActionDefaultOperation,true, stateHandler) ? nextActionDefaultOperation : null
    OtherOperations = ServiceRequestOperation.getTypeKeys(false)
                              .where(\ op -> op != DefaultOperation and serviceRequest.CoreSR.operationAvailable(op,true, stateHandler))
                              .toList()
    Adjuster = new ContactSummary(serviceRequest.AssignedUser.Contact)
    Adjuster.Description = DisplayKey.get("Webservice.ServiceRequest.Adjuster")
    ServicesRequested = serviceRequest.Instruction.Services.map(\ s -> new Service (s.Service.Code,s.Service.Name)).toList()
  }

  static function mapNextActionDefinitionToEnum(definition : ServiceRequestNextActionGwBase.NextActionDefinition) : ServiceRequestNextAction {
    return ServiceRequestNextAction.valueOf(definition.NextActionName)
  }
}