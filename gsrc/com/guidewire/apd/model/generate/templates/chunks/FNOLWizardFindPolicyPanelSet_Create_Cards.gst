<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses gw.apdcloud.client.model.APDRiskLocationTypeEnum
%>
<%@ params( product: ProductInfo ) %>
<% for (var line in product.OrderedLines) { %>
<%  for (var info in line.OrderedChildren) {
if (info.RiskObject.RiskLocationType == APDRiskLocationTypeEnum.REFLOCATION) { %>
<Card
    id="PolicyLocationsCard_${info.PrefixedCode}"
    title="DisplayKey.get(&quot;JSP.NewClaimPolicyDetails.Policy.Locations&quot;)"
    visible="policyTabSet != null &amp;&amp; policyTabSet.contains(&quot;${info.PrefixedCode}&quot;) &amp;&amp; allRequiredFieldsExist()">
    <PanelRef
      def="PolicyLocation${info.PrefixedCode}LDV(Claim)">
      <Toolbar>
        <IteratorButtons
          addVisible=" !Claim.Policy.Verified and perm.Policy.edit(Claim)"
          iterator="PolicyLocation${info.PrefixedCode}LDV.PolicyLocationIterator"
          removeVisible=" !Claim.Policy.Verified and perm.Policy.edit(Claim)"/>
      </Toolbar>
    </PanelRef>
</Card>
<% } else { %>
${RiskUnit_Card.renderToString(info)}
<% }
} %>
<% } %>
