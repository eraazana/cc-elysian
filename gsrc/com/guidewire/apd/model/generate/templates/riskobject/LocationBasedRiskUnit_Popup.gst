<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
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
  <Popup
    canEdit="true"
    canVisit="true"
    id="${info.PrefixedCode}RUPopup"
    returnType="${info.PrefixedCode}RU"
    startInEditMode="a${info.Code}RUParam == null or startEditable == true"
    title="a${info.Code}RUParam == null ? <%=
    DynamicDisplayKey.declare("Web.ClaimPolicy." + info.PrefixedCode + ".New" + info.PrefixedCode + "Popup", riskUnitTerm + " Details")
    .getterCode()%> : <%=
    DynamicDisplayKey.declare("Web.ClaimPolicy." + info.PrefixedCode + "." + info.PrefixedCode + "Popup", riskUnitTerm + " Details")
    .getterCode()%>">
    <LocationEntryPoint
      signature="${info.PrefixedCode}RUPopup(aClaim : Claim, aLocation : PolicyLocation)"/>
    <LocationEntryPoint
      signature="${info.PrefixedCode}RUPopup(aClaim : Claim, a${info.Code}RUParam : ${info.PrefixedCode}RU, startEditable : Boolean, aLocation : PolicyLocation)"/>
    <Variable
      name="aClaim"
      type="Claim"/>
    <Variable
      initialValue="true"
      name="startEditable"
      type="Boolean"/>
    <Variable
      name="aLocation"
      type="PolicyLocation"/>
    <Variable
      name="a${info.Code}RUParam"
      type="${info.PrefixedCode}RU"/>
    <Variable
      initialValue="a${info.Code}RUParam == null ? aLocation.create${info.PrefixedCode}RU(aClaim.Policy) : a${info.Code}RUParam"
      name="a${info.Code}RU"
      type="${info.PrefixedCode}RU"/>
    <Screen
      id="Policy${info.Code}Screen">
      <Toolbar>
        <EditButtons
          pickValue="a${info.Code}RU"
          editVisible="!aClaim.Policy.Verified and perm.Policy.edit(aClaim)"/>
      </Toolbar>
      <PanelRef
        def="${info.PrefixedCode}DetailPanelSet(a${info.Code}RU)"/>
    </Screen>
  </Popup>
</PCF>