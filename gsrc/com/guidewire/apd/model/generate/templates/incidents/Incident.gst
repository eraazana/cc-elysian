<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.CodeGenUtil
%>
<%@ params(riskObjectInfo: RiskObjectInfo) %><%
    var columnName = riskObjectInfo.PrefixedCode + "ID"
    var indexName = CodeGenUtil.hashIfExceedsLength("policy${riskObjectInfo.Code}", CodeGenUtil.INDEX_LENGTH);
%><?xml version="1.0"?>
<subtype
  xmlns="http://guidewire.com/datamodel"
  desc="Report of an incident involving a ${riskObjectInfo.Code}."
  entity="${riskObjectInfo.PrefixedCode}Incident"
  final="false"
  supertype="Incident">
<%
  if (riskObjectInfo.Parent != null) {
  // Only for non-line risk units
%>
  <foreignkey
    archivingOwner="source"
    columnName="${columnName}"
    desc="${riskObjectInfo.Code} associated with the incident."
    fkentity="${riskObjectInfo.PrefixedCode}"
    name="${riskObjectInfo.Code}"
    nullok="true"
    triggersValidation="true"/>
  <index
    desc="Covering index to improve search"
    expectedtobecovering="true"
    name="${indexName}"
    trackUsage="true">
    <indexcol
      keyposition="1"
      name="${columnName}"/>
    <indexcol
      keyposition="2"
      name="Retired"/>
    <indexcol
      keyposition="3"
      name="Subtype"/>
    <indexcol
      keyposition="4"
      name="ClaimID"/>
  </index>
<% } %>
</subtype>
