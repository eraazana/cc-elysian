<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.RiskUnitGenRestPackage}.coverages

uses gw.api.modules.rest.framework.v1.batch.BatchUpdateMap
uses gw.api.modules.rest.framework.v1.json.DataEnvelope
uses gw.api.modules.rest.framework.v1.resources.ResourceName
uses gw.api.modules.rest.framework.v1.resources.VersionableRestElementResource

@ReadOnly
@ResourceName("Unverified${info.PrefixedCode}RiskUnitCoverage")
class Unverified${info.PrefixedCode}RiskUnitCoverageGenResource extends VersionableRestElementResource<Unverified${info.PrefixedCode}RiskUnitCoveragesGenResource, ${info.CoverageType}> {

  override function init(parent : Unverified${info.PrefixedCode}RiskUnitCoveragesGenResource, coverageId : String) {
    super.init(parent, coverageId)
    validateParentChildConsistency(Parent.Parent.Element, Element.RiskUnit)
  }

  protected override property get BeanType() : Class<${info.CoverageType}> {
    return ${info.CoverageType}
  }

  override function finishCreate(data : DataEnvelope, batchUpdateMap : BatchUpdateMap) {
    super.finishCreate(data, batchUpdateMap)
    reserveIdsIfNecessary(this.Element.CovTerms)
  }
}