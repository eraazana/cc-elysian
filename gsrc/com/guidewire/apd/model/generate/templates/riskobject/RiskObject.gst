<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.templates.Field
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<entity
  xmlns="http://guidewire.com/datamodel"
  desc="${info.RiskObject.Description ?: info.Code}."
  entity="${info.PrefixedCode}"
  exportable="true"
  table="${info.PrefixedCode}"
  type="retireable">
  <implementsEntity
    name="Extractable"/>
<% if (info.RiskObject.Description != null) { %>
  <fulldescription><![CDATA[${info.RiskObject.Description}]]></fulldescription>
<% } %>
  <column
    desc="Identifier for the ${info.DisplayName} in an external policy system"
    name="PolicySystemId"
    nullok="true"
    type="policysystemid"/>
<% for (var fld in info.OrderedFields) {
%>${Field.renderToString(info.PrefixedCode, fld)}<%
 }
  for (var child in info.OrderedChildren) {
%>  <array
    arrayentity="${child.PrefixedCode}"
    name="${child.Code}"
    owner="true"
    triggersValidation="true"/>
<% }
 if (info.NestedRiskObject) {
%>  <foreignkey
    fkentity="${info.Parent.PrefixedCode}"
    name="Parent${info.Parent.Code.capitalize()}"
    nullok="true"/>
<% } %>
</entity>
