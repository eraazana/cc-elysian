<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ProductInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.Package}

uses gw.api.claim.IncidentIconSet
uses gw.api.claim.HomeownersHelper

@ReadOnly
class ${info.Product.Code}IncidentIconSet {
<%
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var exposureInfo = info.calculateExposureType(riskObject)
    if (!exposureInfo.isExistingIncidentType()) {
%>
  /** Icons for ${exposureInfo.PrefixedIncidentType } incident */
  final public static var ${exposureInfo.PrefixedIncidentType.toUpperCase()} : IncidentIconSet
            = IncidentIconSet.register(${exposureInfo.PrefixedIncidentType }, "loss_of_use", "loss_of_use", "loss_of_use")
<%
    }
  }
}
%>
  static function getIconSetForIncident(incidentType : String) : String {
    switch (incidentType) {
      case InjuryIncident.DisplayName:
        return IncidentIconSet.INJURY.ButtonIcon
      case VehicleIncident.DisplayName:
        return IncidentIconSet.VEHICLE.ButtonIcon
      case FixedPropertyIncident.DisplayName:
        return IncidentIconSet.PROPERTY_LIABILITY.ButtonIcon
      case PropertyContentsIncident.DisplayName:
        return "contents"
      case DwellingIncident.DisplayName:
        return "dwelling"
      case BaggageIncident.DisplayName:
        return IncidentIconSet.BAGGAGE.ButtonIcon
      case LivingExpensesIncident.DisplayName:
        return "loss_of_use"
      case OtherStructureIncident.DisplayName:
        return "other_structures"
      case TripIncident.DisplayName:
        return IncidentIconSet.TRIP.ButtonIcon
      default:
        return ""
    }
  }
}

