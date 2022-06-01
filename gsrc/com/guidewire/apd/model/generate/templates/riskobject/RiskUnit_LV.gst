<%
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
    id="${info.PrefixedCode}LV">
    <ExposeIterator
      valueType="entity.${info.PrefixedCode}RU"
      widget="${info.PrefixedCode}LV"/>
    <Require
      name="aClaim"
      type="Claim"/>
    <RowIterator
      appendPageInfo="true"
      editable="false"
      elementName="a${info.Code}RU"
      toCreateAndAdd="aClaim.Policy.create${info.PrefixedCode}RU()"
      toRemove="aClaim.Policy.remove${info.PrefixedCode}RU(a${info.Code}RU)"
      pickValue="a${info.Code}RU"
      value="aClaim.Policy.RiskUnits.whereTypeIs(${info.PrefixedCode}RU)"
      valueType="entity.${info.PrefixedCode}RU[]">
      <Row>
        <TextCell
          id="${info.Code}RU_DisplayName"
          value="a${info.Code}RU"
          valueType="entity.${info.PrefixedCode}RU"/>
<% /* FIXME: main properties?
        <TypeKeyCell
          id="GeographicalRegion"
          label="DisplayKey.get(&quot;Web.ClaimPolicy.${info.PrefixedCode}.GeographicalRegion&quot;)"
          value="a${info.PrefixedCode}RU.GeographicalRegion"
          valueType="typekey.GeographicalRegion"/>
        <DateCell
          id="StartDate"
          label="DisplayKey.get(&quot;Web.ClaimPolicy.${info.PrefixedCode}.StartDate&quot;)"
          value="a${info.PrefixedCode}RU.StartDate"/>
        <DateCell
          id="EndDate"
          label="DisplayKey.get(&quot;Web.ClaimPolicy.${info.PrefixedCode}.EndDate&quot;)"
          value="a${info.PrefixedCode}RU.EndDate"/>
*/ %>
      </Row>
    </RowIterator>
  </ListViewPanel>
</PCF>