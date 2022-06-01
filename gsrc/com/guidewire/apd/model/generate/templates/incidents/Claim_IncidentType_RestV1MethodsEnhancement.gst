<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

uses gw.rest.core.cc.claim.v1.claims.ClaimRestV1Methods

@ReadOnly
enhancement Claim${info.PrefixedIncidentType}RestV1MethodsEnhancement : ClaimRestV1Methods {

    property get ${PluralNameUtil.pluralize(info.PrefixedIncidentType)}Sorted() : List<${info.PrefixedIncidentType}> {
      var nullsLastComparator = this.NullsLastComparator
      return this.Claim.getIncidentsOfType(${info.PrefixedIncidentType})
          .orderBy(\i -> i.Severity, nullsLastComparator)
          .thenBy(\i -> i.LossParty, nullsLastComparator)
          .thenBy(\bean -> bean.RestId, nullsLastComparator) as List<${info.PrefixedIncidentType}>
    }
}