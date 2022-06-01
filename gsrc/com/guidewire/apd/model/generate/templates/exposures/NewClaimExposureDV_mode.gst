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
  <CardViewPanel
    hideTabIfSingle="true"
    id="NewClaimExposureDV"
    mode="${info.ExposureType}">
    <Require
      name="Exposure"
      type="Exposure"/>
    <Require
      name="unusedServiceRequests"
      type="java.util.Set&lt;ServiceRequest&gt;"/>
    <Card
      id="NewClaimExposureCard"
      title="&quot;&quot;">
      <PanelRef
        def="NewClaim${info.ExposureType}DV(Exposure)"/>
    </Card>
  </CardViewPanel>
</PCF>