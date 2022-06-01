<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

@ReadOnly
enhancement ${info.PrefixedIncidentType }RestV1Enhancement : ${info.PrefixedIncidentType } {

  property get RestV1() : ${info.PrefixedIncidentType }RestV1Methods {
    return new ${info.PrefixedIncidentType }RestV1Methods(this)
  }
}
