<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
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
  <Page
    canEdit="gw.api.policy.PolicyTabUtil.hasTab(Claim, &quot;${info.PrefixedCode}&quot;) and perm.Claim.edit(Claim) and perm.Policy.edit(Claim)"
    canVisit="gw.api.policy.PolicyTabUtil.hasTab(Claim, &quot;${info.PrefixedCode}&quot;) and perm.Policy.view(Claim) and perm.System.viewpolicy"
    id="ClaimPolicy${info.PrefixedCode}"
    title="<%= DynamicDisplayKey.declare("Web.ClaimPolicy." + info.PrefixedCode, "Policy: " + riskUnitTerm).getterCode()%>">
    <LocationEntryPoint
      signature="ClaimPolicy${info.PrefixedCode}(Claim : Claim)"/>
    <Variable
      name="Claim"
      type="Claim"/>
    <Screen
      id="ClaimPolicyClaimPolicy${info.PrefixedCode}Screen">
      <Toolbar>
        <ToolbarButton
          action="CurrentLocation.startEditing()"
          hideIfEditable="true"
          id="ClaimPolicy${info.PrefixedCode}_EditButton"
          label="DisplayKey.get(&quot;Button.Edit&quot;)"
          visible="!Claim.Policy.Verified and perm.Policy.edit(Claim)"/>
        <EditButtons
          editVisible="false"/>
      </Toolbar>
      <PanelRef
        def="PolicyLocation${info.PrefixedCode}LDV(Claim)">
        <Toolbar>
          <IteratorButtons
            addVisible="!Claim.Policy.Verified and perm.Claim.edit(Claim) and perm.Policy.edit(Claim)"
            iterator="PolicyLocation${info.PrefixedCode}LDV.PolicyLocationIterator"
            removeLabel="DisplayKey.get(&quot;Button.Delete&quot;)"
            removeVisible="perm.Claim.edit(Claim) and perm.Policy.edit(Claim)"/>
        </Toolbar>
      </PanelRef>
      <% /* FIXME
      <AlertBar
        id="ClaimPolicy${info.PrefixedCode}_PartialListAlertBar"
        label="<%= DisplayPropertiesGenerator.injectNewDisplayKey("Web.ClaimPolicy." + info.PrefixedCode + ".PartialList", "Not every {" + riskUnitTerm + "} is listed. Refresh the policy to see all {0}"), "Claim.Policy.Total + info.PrefixedCode)"
        visible="Claim.Policy.Verified and (Claim.Policy.Total${info.PrefixedCode} &gt;= 0) and (Claim.Policy.Total${info.PrefixedCode} != Claim.Policy.${info.PrefixedCode}.length)"/>
      */ %>
    </Screen>
  </Page>
</PCF>