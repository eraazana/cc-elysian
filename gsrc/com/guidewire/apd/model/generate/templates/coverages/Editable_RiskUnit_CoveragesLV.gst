<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <ListViewPanel
    id="Editable${info.PrefixedCode}CoveragesLV">
    <ExposeIterator
      valueType="entity.RUCoverage"
      widget="Editable${info.PrefixedCode}CoveragesLV"/>
    <Require
      name="a${info.Code}RU"
      type="${info.PrefixedCode}RU"/>
    <RowIterator
      editable="true"
      elementName="aCoverage"
      hideCheckBoxesIfReadOnly="true"
      toAdd="a${info.Code}RU.addToCoverages(aCoverage)"
      toRemove="a${info.Code}RU.removeFromCoverages(aCoverage)"
      value="a${info.Code}RU.Coverages"
      valueType="entity.RUCoverage[]">
      <Row>
        <TypeKeyCell
          editable="true"
          id="CoverageType"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + "info.PrefixedCode" + "Coverages.CoverageType", "Coverage Type").getterCode()%>"
          required="true"
          sortOrder="1"
          value="aCoverage.Type"
          filter="a${info.Code}RU.canHaveCoverage(VALUE)"
          valueType="typekey.CoverageType">
          <PostOnChange/>
        </TypeKeyCell>
        <TypeKeyCell
          editable="aCoverage.allowCurrencyChange()"
          id="Currency"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.Currency", "{Term.Currency.Proper}").getterCode()%>"
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
          formatType="currency"
          id="Deductible"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.Deductible", "Deductible").getterCode()%>"
          value="aCoverage.Deductible"
          visible="gw.pcf.RiskUnitUtils.isDeductiblePresent(a${info.Code}RU)"/>
        <CurrencyCell
          editable="true"
          id="ExposureLimit"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.ExposureLimit", "{Term.Exposure.Proper} Limit").getterCode()%>"
          value="aCoverage.ExposureLimit"/>
        <CurrencyCell
          editable="true"
          id="IncidentLimit"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.IncidentLimit", "Incident Limit").getterCode()%>"
          value="aCoverage.IncidentLimit"/>
        <TypeKeyCell
          editable="true"
          id="LimitsIndicator"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.LimitsIndicator", "CSLI").getterCode()%>"
          value="aCoverage.LimitsIndicator"
          valueType="typekey.LimitsIndicator"/>
        <TextCell
          editable="true"
          id="Notes"
          label="<%= DynamicDisplayKey.declare("Web.Policy.Editable" + info.PrefixedCode + "Coverages.Notes", "{Term.Notes.Proper}").getterCode()%>"
          value="aCoverage.Notes"/>
      </Row>
    </RowIterator>
  </ListViewPanel>
</PCF>