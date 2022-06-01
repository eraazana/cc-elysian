<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil;
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentExtRestPackage}

uses ${info.IncidentGenRestPackage}.Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}GenResource

@Export
class Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}ExtResource extends Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}GenResource {
}