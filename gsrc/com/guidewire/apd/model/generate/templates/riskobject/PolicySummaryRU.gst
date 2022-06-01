<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.templates.Field
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<subtype
  xmlns="http://guidewire.com/datamodel"
  desc="${info.PrefixedCode}"
  displayName="${info.PrefixedCode}"
  entity="PolicySummary${info.PrefixedCode}"
  supertype="PolicySummaryRiskUnit">
  <implementsInterface
    iface="gw.cc.policy.entity.PolicySummaryRiskUnit"
    impl="com.guidewire.cc.domain.policy.impl.PolicySummaryRiskUnitImpl"/>
<% for (var fld in info.OrderedFields) {
%>${Field.renderToString(info.PrefixedCode, fld)}<%
 }
 for (var child in info.OrderedChildren) {
%>  <array
    arrayentity="PolicySummary${child.PrefixedCode}"
    name="${child.Code}"
    owner="true"
    triggersValidation="true"/>
<% } %>
<% if (info.NestedRiskObject) { %>
  <foreignkey
    fkentity="PolicySummary${info.Parent.PrefixedCode}"
    name="Parent${info.Parent.Code}"
    nullok="true"/>
<% } %>
</subtype>
