<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.RiskUnitExtRestPackage}.coverages

uses ${info.RiskUnitGenRestPackage}.coverages.${info.PrefixedCode}RiskUnitCoverageGenResource

@Export
class ${info.PrefixedCode}RiskUnitCoverageExtResource extends ${info.PrefixedCode}RiskUnitCoverageGenResource {
}