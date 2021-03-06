<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ProductInfo) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <ListViewPanel
    id="Editable${info.Product.Code}PolicyCoveragesLV"
    stretch="true">
    <ExposeIterator
      valueType="entity.PolicyCoverage"
      widget="Editable${info.Product.Code}PolicyCoveragesLV"/>
    <Require
      name="aPolicy"
      type="Policy"/>
    <RowIterator
      editable="true"
      elementName="aCoverage"
      hideCheckBoxesIfReadOnly="true"
      toAdd="aPolicy.addCoverage(aCoverage)"
      toRemove="aPolicy.removeCoverage(aCoverage)"
      value="aPolicy.Coverages"
      valueType="entity.PolicyCoverage[]">
      <Row
        editable="!aPolicy.Verified">
        <TypeKeyCell
          editable="true"
          grow="true"
          id="CoverageType"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.CoverageType&quot;)"
          required="true"
          sortOrder="1"
          value="aCoverage.Type"
          valueType="typekey.CoverageType"
          wrapLabel="true">
          <PostOnChange/>
        </TypeKeyCell>
        <TypeKeyCell
          editable="aCoverage.allowCurrencyChange()"
          id="Currency"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.Currency&quot;)"
          required="true"
          sortOrder="2"
          validationExpression="util.PolicyUI.handleCoverageCurrencyUpdate(aCoverage)"
          value="aCoverage.Currency"
          valueType="typekey.Currency"
          visible="gw.api.util.CurrencyUtil.MultiCurrencyMode">
          <PostOnChange/>
        </TypeKeyCell>
        <CurrencyCell
          editable="false"
          id="Deductible"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.Deductible&quot;)"
          value="aCoverage.Deductible"
          wrapLabel="true"
          visible="gw.pcf.PolicyUtils.isDeductiblePresent(aPolicy)"/>
        <CurrencyCell
          editable="true"
          id="ExposureLimit"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.ExposureLimit&quot;)"
          value="aCoverage.ExposureLimit"/>
        <CurrencyCell
          editable="true"
          id="IncidentLimit"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.IncidentLimit&quot;)"
          value="aCoverage.IncidentLimit"/>
        <TextCell
          editable="true"
          grow="true"
          id="Notes"
          label="DisplayKey.get(&quot;LV.Policy.PolicyCoverages.Notes&quot;)"
          value="aCoverage.Notes"
          wrapLabel="true"/>
      </Row>
    </RowIterator>
  </ListViewPanel>
</PCF>
