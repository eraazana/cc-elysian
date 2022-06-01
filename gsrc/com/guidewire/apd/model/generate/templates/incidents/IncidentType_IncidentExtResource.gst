<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentExtRestPackage}

uses ${info.IncidentGenRestPackage}.${info.PrefixedIncidentType}GenResource

@Export
class ${info.PrefixedIncidentType}ExtResource extends ${info.PrefixedIncidentType}GenResource {
}