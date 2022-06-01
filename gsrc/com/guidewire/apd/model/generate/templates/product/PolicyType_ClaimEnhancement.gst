<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ProductInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.Package}

@ReadOnly
enhancement ${info.Product.Code}ClaimEnhancement : Claim {
<%
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var exposureInfo = info.calculateExposureType(riskObject)
    if (!exposureInfo.isExistingIncidentType()) {
%>
  property get ${exposureInfo.PrefixedIncidentType }sOnly() : ${exposureInfo.PrefixedIncidentType }[] {
    return this.getIncidentsOfType(${exposureInfo.PrefixedIncidentType }) as ${exposureInfo.PrefixedIncidentType }[]
  }
<%
    }
  }
}
%>
}
