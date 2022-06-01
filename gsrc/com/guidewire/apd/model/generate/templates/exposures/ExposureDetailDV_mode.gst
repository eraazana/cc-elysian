<%
uses com.guidewire.apd.model.DynamicDisplayKey
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
    id="ExposureDetailDV"
    mode="${info.ExposureType}">
    <Require
      name="Exposure"
      type="Exposure"/>
    <Require
      name="unusedServiceRequests"
      type="java.util.Set&lt;ServiceRequest&gt;"/>
    <Card
      id="DetailsCard"
      title="<%= DynamicDisplayKey.declare("Web.Exposure." + info.ExposureType + ".Details", "Details").getterCode()%>">
      <PanelRef
        def="${info.ExposureType}DV(Exposure)"/>
    </Card>
    <Card
      id="Exposure_ISOCard"
      title="DisplayKey.get(&quot;NVV.Exposure.ISO&quot;)"
      visible="!Exposure.Claim.ISOClaimLevelMessaging">
      <PanelRef
        def="ISODetailsDV(Exposure)"/>
    </Card>
  </CardViewPanel>
</PCF>