<%
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <Popup
    beforeCommit="validateValidRiskUnits()"
    canEdit="perm.Claim.edit(Claim) and perm.Policy.edit(Claim)"
    canVisit="perm.Claim.edit(Claim) and perm.Policy.view(Claim)"
    id="${info.PrefixedCode}PolicyLocationPopup"
    returnType="PolicyLocation"
    startInEditMode="EditMode and (!Claim.Policy.Verified and perm.Claim.edit(Claim) and perm.Policy.edit(Claim))"
    title="DisplayKey.get(&quot;LV.Policy.Locations&quot;)">
    <LocationEntryPoint
      signature="${info.PrefixedCode}PolicyLocationPopup(PolicyLocation : PolicyLocation, Claim : Claim, EditMode : Boolean)"/>
    <Variable
      name="PolicyLocation"
      type="PolicyLocation"/>
    <Variable
      name="Claim"
      type="Claim"/>
    <Variable
      name="EditMode"
      type="Boolean"/>
    <Variable
      initialValue="new gw.api.address.PolicyLocationAddressOwner(PolicyLocation)"
      name="AddressOwner"
      type="gw.api.address.CCAddressOwner"/>
    <ScreenRef
      def="PolicyLocationScreen(PolicyLocation, Claim, EditMode)"/>
    <Code><![CDATA[function validateValidRiskUnits() {
  if (Claim.Policy.hasValidRiskUnits()) return
  throw new gw.api.util.DisplayableException(DisplayKey.get("JSP.ClaimPolicy.Policy.CombinationMustBeUnique"))
}]]></Code>
  </Popup>
</PCF>