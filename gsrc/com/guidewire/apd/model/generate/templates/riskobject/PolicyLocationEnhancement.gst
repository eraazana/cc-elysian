<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.RiskUnitPackage}

@ReadOnly
enhancement ${info.PrefixedCode}PolicyLocationEnhancement: entity.PolicyLocation {
  function create${info.PrefixedCode}RU(policy: Policy): entity.${info.PrefixedCode}RU {
    var ${info.Code} = new ${info.PrefixedCode}()
    var ${info.Code}RU = new ${info.PrefixedCode}RU()
    ${info.Code}RU.${info.Code} = ${info.Code}
    ${info.Code}RU.setPolicyLocation(this)
    this.addToLocationBasedRisks(${info.Code}RU)
    policy.addToRiskUnitsAndAssignRUNumber(${info.Code}RU)
    return ${info.Code}RU
  }

  function remove${info.PrefixedCode}RU(ru: entity.${info.PrefixedCode}RU, policy: Policy) {
    for (var coverage in ru.Coverages) {
      ru.removeFromCoverages(coverage);
    }
    ru.${info.Code}.remove();
    this.removeFromLocationBasedRisks(ru)
    policy.removeFromRiskUnits(ru);
  }
}
