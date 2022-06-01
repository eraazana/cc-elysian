<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<Entity
  name="${info.PrefixedCode}RU">
  <Columns>
    <Column
      beanPath="${info.PrefixedCode}RU.RUNumber"
      name="ruNumber"
      sortOrder="1"/>
  </Columns>
  <DisplayName><![CDATA["${info.RiskObject.Name} #\${ruNumber}"]]></DisplayName>
</Entity>