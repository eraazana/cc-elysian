<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.CodeGenUtil
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.templates.Input
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: RiskObjectInfo) %>
<%
var riskUnitTerm = DynamicDisplayKey.declare("Term.APD.RiskUnit." + info.RiskObject.Code, info.RiskObject?.NameL10NARRAY)
%>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <PanelSet
    id="${info.PrefixedCode}DetailPanelSet">
    <Require
      name="a${info.Code}RU"
      type="${info.PrefixedCode}RU"/>
    <DetailViewPanel
      id="Policy${info.PrefixedCode}DetailDV">
      <InputColumn>
        <TextInput
          editable="true"
          id="Number"
          label="<%= DynamicDisplayKey.declare("Web.ClaimPolicy." + info.PrefixedCode + "." + info.PrefixedCode + "Number", riskUnitTerm + " #").getterCode()%>"
          required="true"
          value="a${info.Code}RU.RUNumber"
          valueType="java.lang.Integer"/>
<% for (var fld in info.OrderedFields) {
  var entityVar = "a${info.Code}RU.${info.Code}";
%>
${CodeGenUtil.indentLines("        ", new String[]{Input.renderToString(info, fld, entityVar)})}
<% } %>
      </InputColumn>
    </DetailViewPanel>
<% if (info.OrderedCoverages.HasElements) { %>
    <ListDetailPanel
      id="Policy${info.Code}CoverageListDetail"
      selectionName="Coverage"
      selectionType="Coverage">
      <PanelRef
        def="Editable${info.PrefixedCode}CoveragesLV(a${info.Code}RU)">
        <TitleBar
          subtitle="<%= DynamicDisplayKey.declare("Web.Policy." + info.PrefixedCode + ".Coverages.Subtitle", "Click a specific coverage to see additional coverage terms (if any)") .getterCode()%>"
          title="<%= DynamicDisplayKey.declare("Web.Policy." + info.PrefixedCode + ".Coverages", "Coverages") .getterCode()%>"/>
        <Toolbar>
          <IteratorButtons
            iterator="Editable${info.PrefixedCode}CoveragesLV.Editable${info.PrefixedCode}CoveragesLV"/>
        </Toolbar>
      </PanelRef>
      <PanelRef
        def="ClaimPolicyCovTermsCV(Coverage)"
        editable="true"/>
    </ListDetailPanel>
<% } %>
  </PanelSet>
</PCF>