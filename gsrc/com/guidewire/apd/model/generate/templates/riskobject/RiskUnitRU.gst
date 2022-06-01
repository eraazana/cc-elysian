<%
uses gw.apdcloud.client.model.APDRiskLocationTypeEnum
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.CodeGenUtil
%>
<%@ params(riskObjectInfo: RiskObjectInfo) %><%
    var columnName = riskObjectInfo.PrefixedCode + "ID"
    var indexName = CodeGenUtil.hashIfExceedsLength("policy${riskObjectInfo.Code}", CodeGenUtil.INDEX_LENGTH);
    var supertype = riskObjectInfo.getRiskObject().getRiskLocationType() == APDRiskLocationTypeEnum.REFLOCATION
        ? "LocationBasedRU"
        : "RiskUnit";
%><?xml version="1.0"?>
<subtype
  xmlns="http://guidewire.com/datamodel"
  desc="RiskUnit containing a ${riskObjectInfo.RiskObject.Description ?: riskObjectInfo.Code}."
  entity="${riskObjectInfo.PrefixedCode}RU"
  supertype="${supertype}">
  <foreignkey
    archivingOwner="source"
    columnName="${columnName}"
    desc="Related ${riskObjectInfo.Code}."
    fkentity="${riskObjectInfo.PrefixedCode}"
    name="${riskObjectInfo.Code}"
    nullok="true"
    triggersValidation="true"/>
  <index
    desc="Enforce uniqueness, ensuring that no ${riskObjectInfo.Code} is shared between policies"
    name="${indexName}"
    unique="true">
    <indexcol
      keyposition="1"
      name="${columnName}"/>
    <indexcol 
      keyposition="2" 
      name="Retired"/>
  </index>
</subtype>
