<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil;
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.modules.rest.framework.v1.exceptions.LocalizedExceptionUtil
uses gw.api.modules.rest.framework.v1.json.DataAttributes
uses gw.api.modules.rest.framework.v1.resources.DefaultKeyableBeanRestQueryCollectionResource
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.rest.exceptions.RestRequestException
uses gw.rest.core.cc.claim.v1.claims.ClaimCoreResource

@ReadOnly
@ResourceName("${PluralNameUtil.pluralize(info.PrefixedIncidentType)}")
class Claim${PluralNameUtil.pluralize(info.PrefixedIncidentType)}GenResource extends DefaultKeyableBeanRestQueryCollectionResource<ClaimCoreResource> {

  property get Claim() : Claim {
    return Parent.Claim
  }

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    return Query.make(${info.PrefixedIncidentType }).compare(${info.PrefixedIncidentType }#Claim, Relop.Equals, Parent.Claim).select()
  }

  override property get CollectionId() : String {
    return "${PluralNameUtil.pluralize(info.getRestKebabIncidentType())}"
  }

  override property get CanViewException() : RestRequestException {
    if (!Claim.RestV1.isValidIncidentType(ElementResourceName)) {
      return LocalizedExceptionUtil.notFound(RequestContext.RawRequest.PathInfo)
    }
    return null
  }

  override property get CanCreateException() : RestRequestException {
    return this.CanViewException
  }

  override function createMinimalChildElement(attributes : DataAttributes) : ${info.PrefixedIncidentType } {
    return Parent.Claim.newIncident(entity.${info.PrefixedIncidentType }) as ${info.PrefixedIncidentType }
  }

  override function buildElementResourceFromId(id : String) : ${info.PrefixedIncidentType}GenResource {
    return buildResource(${info.PrefixedIncidentType}GenResource, this, id)
  }

  protected override property get ChildType() : Class<${info.PrefixedIncidentType}GenResource> {
    return ${info.PrefixedIncidentType}GenResource
  }
}