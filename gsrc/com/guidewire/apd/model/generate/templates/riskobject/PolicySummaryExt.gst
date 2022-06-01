<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.templates.Field
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<extension
  xmlns="http://guidewire.com/datamodel"
  entityName="PolicySummary">
<% for (var fld in info.OrderedFields) {
%>${Field.renderToString(info.PrefixedCode, fld)}<% }
  for (var child in info.OrderedChildren) {
%>  <array
    arrayentity="PolicySummary${child.PrefixedCode}"
    desc="List of ${child.Code} covered by the policy."
    name="${child.PrefixedCode}"
    owner="true"
    triggersValidation="true"/>
<% } %>
</extension>
