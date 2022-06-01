<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ProductInfo) %>
<%
  var mode = info.Product.Code
%>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <PanelSet
    id="FNOLWizard_ServicesPolicyPanelSet"
    mode="${mode}">
    <Require
      name="claim"
      type="Claim"/>
    <Require
      name="wizard"
      type="gw.api.claim.NewClaimWizardInfo"/>
  </PanelSet>
</PCF>