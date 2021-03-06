package gw.api.databuilder
uses gw.api.databuilder.populator.AbstractBeanPopulator
uses gw.api.database.Query
uses gw.sampledata.SampleSpecialistServicesBase

@Export
class ServiceRequestInstructionBuilder extends CCDataBuilder<ServiceRequestInstruction, ServiceRequestInstructionBuilder> {

  // ------------------------------------------------------------- Constructors

  /**
   * Creates a new ServiceRequestInstructionBuilder
   */
  construct() {
    super(ServiceRequestInstruction)
    var customerContact = PersonBuilder.uiReadyPerson()
                            .withHomePhoneCountry(PhoneCountryCode.TC_US)
                            .withWorkPhoneCountry(PhoneCountryCode.TC_US)
                            .withFaxPhoneCountry(PhoneCountryCode.TC_US)
                            .withCellPhoneCountry(PhoneCountryCode.TC_US)
    set(ServiceRequestInstruction#CustomerContactGw, customerContact)
  }

  // ----------------------------------------------------------- Public Methods

  /**
   * Returns a builder to construct a UI ready ServiceRequestInstruction. The following fields are set:
   * <ul>
   * <li> CustomerContact - a new contact
   * <li> Service - Auto - Inspect / Repair - Glass
   * <li> ServiceAddress - a new ui ready US address
   * </ul>
   */
  static function uiReady() : ServiceRequestInstructionBuilder {
    return new ServiceRequestInstructionBuilder()
        .withSpecialistService(SampleSpecialistServicesBase.AutoRepairGlass)
        .withServiceAddressGw(AddressBuilder.uiReadyUSA())
  }

  function withChangeWhereIntroducedGwPopulated() : ServiceRequestInstructionBuilder {
    var change = new ServiceRequestChangeBuilder()
                         .withInstructionChange(true)
    set(ServiceRequestInstruction#ChangeWhereIntroducedGw, change)
    addPopulator(new AbstractBeanPopulator<ServiceRequestInstruction>({}) {
      override function execute(instruction : ServiceRequestInstruction, vals : Object[]) {
        instruction.ServiceRequest.recordChange(instruction.ChangeWhereIntroducedGw)
      }
    })
    return this
  }

  /**
   * Sets the contact with whom the specialist should coordinate to perform the work. In many cases, this will be the claimant.
   * @param customerContact the desired value
   * @return the modified builder
   */
  function withCustomerContactGw(customerContact : Contact) : ServiceRequestInstructionBuilder {
    return withCustomerContactGw(wrapBean<Contact>(customerContact))
  }

  /**
   * Sets the contact with whom the specialist should coordinate to perform the work. In many cases, this will be the claimant.
   * @param customerContact a value generator that will return the desired value
   * @return the modified builder
   */
  function withCustomerContactGw(customerContact : ValueGenerator<Contact>) : ServiceRequestInstructionBuilder {
    set(ServiceRequestInstruction#CustomerContactGw, customerContact)
    return this
  }

  /**
   * Sets the text instructions to be provided to the specialist.
   * @param instructionText the desired value
   * @return the modified builder
   */
  function withInstructionTextGw(instructionText : String) : ServiceRequestInstructionBuilder {
    set(ServiceRequestInstruction#InstructionTextGw, instructionText)
    return this
  }

  /**
   * Sets the location at which the service is to be performed; may be null if the location is implied by the specialist, such as if it will be performed at the specialist's place of business.
   * @param serviceAddress the desired value
   * @return the modified builder
   */
  function withServiceAddressGw(serviceAddress : Address) : ServiceRequestInstructionBuilder {
    return withServiceAddressGw(wrapBean<Address>(serviceAddress))
  }

  /**
   * Sets the location at which the service is to be performed; may be null if the location is implied by the specialist, such as if it will be performed at the specialist's place of business.
   * @param serviceAddress a value generator that will return the desired value
   * @return the modified builder
   */
  function withServiceAddressGw(serviceAddress : ValueGenerator<Address>) : ServiceRequestInstructionBuilder {
    set(ServiceRequestInstruction#ServiceAddressGw, serviceAddress)
    return this
  }

  /**
   * Add a service request instruction service to the serviceRequestInstruction
   * @param service the service request instruction service to add
   * @return the modified builder
   */
  function withService(service : ServiceRequestInstructionService) : ServiceRequestInstructionBuilder {
    return withService(wrapBean<ServiceRequestInstructionService>(service))
  }

  /**
   * Add a service request instruction service to the serviceRequestInstruction
   * @param service a value generator that will return the service request instruction service to add
   * @return the modified builder
   */
  function withService(service : ValueGenerator< ServiceRequestInstructionService >) : ServiceRequestInstructionBuilder {
    addArrayElement(ServiceRequestInstruction#Services, service)
    return this
  }

  /**
   * Adds a SpecialistService found by its code to the service request instruction
   * @param code  the unique identifier to use to look up the SpecialistService
   * @return the modified builder
   */
  function withSpecialistServiceFoundByCode(code : String) : ServiceRequestInstructionBuilder {
    var q = Query.make(SpecialistService)
    q.compare("Code", Equals, code)
    // assume that withSpecialistService will pull the result out of the read-only bundle and into the correct bundle
    return withSpecialistService(q.select().single())
  }

  /**
   * Links the specified SpecialistService to this instruction
   */
  function withSpecialistService(service : SpecialistService) : ServiceRequestInstructionBuilder {
    return withSpecialistService(wrapBean<SpecialistService>(service))
  }

  /**
   * Links the specified SpecialistService to this instruction
   */
  function withSpecialistService(serviceGenerator : ValueGenerator<SpecialistService>) : ServiceRequestInstructionBuilder {
    addPopulator(new AbstractBeanPopulator<ServiceRequestInstruction>({serviceGenerator}) {
      override function execute(instruction : ServiceRequestInstruction, vals : Object[]) {
        instruction.addToServices(new ServiceRequestInstructionService(instruction.Bundle) { :Service = vals.single() as SpecialistService})
      }
    })
    return this
  }

  /**
   * Sets the reference to the ServiceRequest and sets this as the ServiceRequest's current instruction.
   * @param serviceRequest the desired value
   * @return the modified builder
   */
  function onServiceRequest(serviceRequest : ServiceRequest) : ServiceRequestInstructionBuilder {
    return onServiceRequest(wrapBean<ServiceRequest>(serviceRequest))
  }

  /**
   * Sets the reference to the ServiceRequest and sets this as the ServiceRequest's current instruction.
   * @param serviceRequest a value generator that will return the desired value
   * @return the modified builder
   */
  function onServiceRequest(serviceRequest : ValueGenerator< ServiceRequest >) : ServiceRequestInstructionBuilder {
    set(ServiceRequestInstruction#ServiceRequest, serviceRequest)
    addPopulator(new AbstractBeanPopulator<ServiceRequestInstruction>({}) {
      override function execute(instruction : ServiceRequestInstruction, vals : Object[]) {
        instruction.ServiceRequest.Instruction = instruction
      }
    })
    return this
  }

  /**
   * Sets the reference to the ServiceRequest but <b>without</b> making this the ServiceRequest's current instruction.
   * @param serviceRequest the desired value
   * @return the modified builder
   */
  function onServiceRequestButNotCurrent(serviceRequest : ServiceRequest) : ServiceRequestInstructionBuilder {
    return onServiceRequestButNotCurrent(wrapBean<ServiceRequest>(serviceRequest))
  }

  /**
   * Sets the reference to the ServiceRequest but <b>without</b> making this the ServiceRequest's current instruction.
   * @param serviceRequest a value generator that will return the desired value
   * @return the modified builder
   */
  function onServiceRequestButNotCurrent(serviceRequest : ValueGenerator< ServiceRequest >) : ServiceRequestInstructionBuilder {
    set(ServiceRequestInstruction#ServiceRequest, serviceRequest)
    return this
  }

}
