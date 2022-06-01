package gw.plugin.vehiclevaluation

uses gw.api.financials.CurrencyAmount
uses gw.vendormanagement.SpecialistServiceCodeConstants

uses java.time.Year

@Export
class VehicleValuationPluginDemo implements VehicleValuationPlugin {

  private static final var MIN_THRESHOLD_AMOUNT = new CurrencyAmount(100, TC_USD)
  private static final var MAX_THRESHOLD_AMOUNT = new CurrencyAmount(300000, TC_USD)

  override function isValuationRequired(incident : VehicleIncident, serviceRequest : ServiceRequest) : ValuationRequired {
    // Don't update ValuationRequired if analytics has already indicated it isn't required
    if (incident.ValuationRequired == ValuationRequired.TC_NO_ANALYTICS_INDICATE_REPAIR) {
      return incident.ValuationRequired
    }

    var hasAutoBodyRepairService = false
    var services = serviceRequest.Instruction.Services;
    for (service in services) {
      if (service.Service.Code == SpecialistServiceCodeConstants.AUTOBODYREPAIR) {
        hasAutoBodyRepairService = true
        break
      }
    }

    if (hasAutoBodyRepairService) {
      var quote = serviceRequest.LatestQuote
      if (quote.Amount < MIN_THRESHOLD_AMOUNT) {
        return ValuationRequired.TC_NO_QUOTE_INDICATES_REPAIR
      } else if (quote.Amount > MAX_THRESHOLD_AMOUNT) {
        return ValuationRequired.TC_NO_QUOTE_INDICATES_TOTAL_LOSS
      }
    }

    return ValuationRequired.TC_YES
  }

  override function shouldRequestValuation(incident : VehicleIncident) : boolean {
    // If property value is already set for the incident, do not request another valuation
    return (incident.PropertyValue == null && incident.ValuationRequired == ValuationRequired.TC_YES)
  }

  override function performValuation(incident : VehicleIncident) {
    incident.setValuationSource(TC_DEMO)

    var vehicleAge = Year.now().getValue() - incident.Vehicle.Year
    var vehicleValue = Math.max(30000 - 2000 * vehicleAge, 1500)
    incident.setPropertyValue(new CurrencyAmount(vehicleValue, incident.Claim.Currency))
  }
}