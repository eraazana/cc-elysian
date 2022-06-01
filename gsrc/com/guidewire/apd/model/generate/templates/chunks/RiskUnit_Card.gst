<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<%
var riskUnitTerm = DynamicDisplayKey.declare("Term.APD.RiskUnit." + info.RiskObject.Code, info.RiskObject?.NameL10NARRAY)
%>
<Card
  id="${info.PrefixedCode}Card"
  title="<%= DynamicDisplayKey.declare("Web.NewClaimPolicyDetails.Policy." + info.PrefixedCode, riskUnitTerm.toString()).getterCode()%>"
  visible="policyTabSet != null &amp;&amp; policyTabSet.contains(&quot;${info.PrefixedCode}&quot;) &amp;&amp; allRequiredFieldsExist()">
  <PanelRef
    def="NewClaim${info.PrefixedCode}LV(Claim, Wizard)">
    <TitleBar
      title="<%= DynamicDisplayKey.declare("Web.NewClaimPolicyDetails.Policy." + info.PrefixedCode, riskUnitTerm.toString()).getterCode()%>"/>
    <Toolbar>
      <IteratorButtons
        addVisible="!Claim.Policy.Verified and perm.Policy.edit(Claim)"
        iterator="NewClaim${info.PrefixedCode}LV.NewClaim${info.PrefixedCode}LV"
        removeVisible="perm.Policy.edit(Claim)"/>
    </Toolbar>
  </PanelRef>
</Card>
