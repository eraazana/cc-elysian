<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.RiskUnitPackage}

@ReadOnly
enhancement ${info.PrefixedCode}RUEnhancement: entity.${info.PrefixedCode}RU {
  function canHaveCoverage(coverage: CoverageType): boolean {
<% for (var coverage in info.OrderedCoverages) { %>
    if (coverage == CoverageType.TC_${coverage.PrefixedCode.toUpperCase()}) return true
<% } %>
    return false
  }
}
