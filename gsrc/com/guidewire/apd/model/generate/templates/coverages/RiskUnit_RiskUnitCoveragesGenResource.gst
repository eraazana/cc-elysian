<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.RiskUnitGenRestPackage}.coverages

uses gw.api.database.IQueryBeanResult
uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.modules.rest.framework.v1.resources.DefaultKeyableBeanRestQueryCollectionResource
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.RestElementResource
uses ${info.RiskUnitGenRestPackage}.${info.PrefixedCode}RiskUnitGenResource

@ReadOnly
@ResourceName("${info.PrefixedCode}RiskUnitCoverages")
class ${info.PrefixedCode}RiskUnitCoveragesGenResource extends DefaultKeyableBeanRestQueryCollectionResource<${info.PrefixedCode}RiskUnitGenResource> {

  protected override function buildBaseQuery() : IQueryBeanResult<KeyableBean> {
    return Query.make(${info.CoverageType}).compare(${info.CoverageType}#RiskUnit, Relop.Equals, this.Parent.Element).select()
  }

  protected override property get ChildType() : Class<RestElementResource> {
    return ${info.PrefixedCode}RiskUnitCoverageGenResource
  }

  override property get CollectionId() : String {
    return "coverages"
  }
}