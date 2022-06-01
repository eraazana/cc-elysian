<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil;
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.VersionableRestElementResource
uses gw.api.rest.exceptions.RestRequestException
uses gw.rest.core.cc.claim.v1.claims.ClaimRelatedResource
uses gw.rest.core.cc.claim.v1.claims.EditableStateHandler

@ReadOnly
@ResourceName("${info.PrefixedIncidentType}")
class ${info.PrefixedIncidentType}GenResource extends VersionableRestElementResource<Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}GenResource, ${info.PrefixedIncidentType}> implements ClaimRelatedResource {

  override function init(parent : Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}GenResource, incidentId : String) {
    super.init(parent, incidentId)
    validateParentChildConsistency(Parent.Claim, Element.Claim)
  }

  property get ${info.PrefixedIncidentType }() : ${info.PrefixedIncidentType } {
    return Element
  }

  override property get Claim() : Claim {
    return this.Element.Claim
  }

  override function delete() {
    this.Claim.removeFromIncidents(Element)
  }

  protected override property get BeanType() : Class<${info.PrefixedIncidentType }> {
    return entity.${info.PrefixedIncidentType }
  }

  override property get CanEditException() : RestRequestException {
    var maybeException = EditableStateHandler.checkClaimStateForEdit(this)
    return maybeException.isPresent() ? maybeException.get() : null
  }

  override function finishCreate(data : DataEnvelope, batchUpdateMap : BatchUpdateMap) {
    super.finishCreate(data, batchUpdateMap)
    // If an id was reserved for the incident, make sure to reserve ids for the risk object as well
    var incident = this.Element
    reserveIdsIfNecessary({incident.${info.RiskObject.Code}})
  }

  override property get CanDeleteException() : RestRequestException {
    return this.Element.IncidentRestV1.validateDeletion(this.ResourceName)
  }
}