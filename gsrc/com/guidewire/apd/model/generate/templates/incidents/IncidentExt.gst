<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<extension
  xmlns="http://guidewire.com/datamodel"
  entityName="${info.PrefixedCode}Incident">
    <!-- TODO APD: Customer extensions go here -->
</extension>
