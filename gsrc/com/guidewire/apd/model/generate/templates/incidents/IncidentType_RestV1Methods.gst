<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
<%
  var lowercased = info.PrefixedIncidentType.uncapitalize()
  var riskObjectLowercased = info.RiskObject.Code.toLowerCase()
  var riskObjectCode = info.RiskObject.Code
%>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

uses ${info.RiskObject.RiskUnitGenRestPackage}.Claim${info.RiskObject.PrefixedCode}

@ReadOnly
class ${info.PrefixedIncidentType}RestV1Methods {

  private final var _${lowercased} : ${info.PrefixedIncidentType }

  construct(${lowercased} : ${info.PrefixedIncidentType }) {
    _${lowercased} = ${lowercased}
  }

  property get ${riskObjectCode}Wrapper() : Claim${info.RiskObject.PrefixedCode} {
    var ${riskObjectLowercased} = _${lowercased}.${riskObjectCode}
    if (${riskObjectLowercased} == null) {
      return null
    }

    // We want to make sure to grab the appropriate risk object from the policy list if the risk object
    // is actually a shared reference, so we get the appropriate label and know that the risk object should not
    // be directly editable
    for (policy${riskObjectCode} in _${lowercased}.Claim.Policy.RestV1.Policy${PluralNameUtil.pluralize(info.RiskObject.PrefixedCode)}) {
      if (policy${riskObjectCode}.${riskObjectCode} == ${riskObjectLowercased}) {
        return policy${riskObjectCode}
      }
    }

    // We didn't find it as a shared risk object, so return it as a non-shared risk object
    return new Claim${info.RiskObject.PrefixedCode}(${riskObjectLowercased})
  }

  property set ${riskObjectCode}Wrapper(claim${riskObjectCode} : Claim${info.RiskObject.PrefixedCode}) {
    _${lowercased}.${riskObjectCode} = claim${riskObjectCode}.${riskObjectCode}
  }
}