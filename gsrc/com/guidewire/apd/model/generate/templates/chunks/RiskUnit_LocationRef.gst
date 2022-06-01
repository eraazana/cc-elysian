<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<%
var riskUnitTerm = DynamicDisplayKey.declare("Term.APD.RiskUnit." + info.RiskObject.Code, info.RiskObject?.NameL10NARRAY)
%>
<LocationRef
  label="<%= DynamicDisplayKey.declare("Web.ClaimPolicy.Policy.Navigation." + info.PrefixedCode, riskUnitTerm.toString()).getterCode()%>"
  location="ClaimPolicy${info.PrefixedCode}(Claim)"/>
