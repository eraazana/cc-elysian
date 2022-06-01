<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <InputSet
    id="${info.PrefixedIncidentType}InputSet">
    <Require
      name="a${info.PrefixedIncidentType}"
      type="${info.PrefixedIncidentType}"/>
    <!-- TODO APD: additional incident fields go here -->
  </InputSet>
</PCF>