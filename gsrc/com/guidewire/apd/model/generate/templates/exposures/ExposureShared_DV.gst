<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo, editExistingExposure: boolean) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <DetailViewPanel
    id="${editExistingExposure ? "" : "NewClaim"}${info.ExposureType}DV">
    <Require
      name="Exposure"
      type="Exposure"/>
    <InputColumn>
      <InputSetRef
        def="ExposureDetailInputSet(Exposure, ${!editExistingExposure})"/>
<% if (editExistingExposure) { %>
      <InputSetRef
        def="ExposureWorkloadInputSet(Exposure)"/>
<% } %>
    </InputColumn>
    <InputColumn>
      <% /*
      <Label
        label="DisplayKey.get(&quot;NVV.Exposure.SubView.${info.ExposureType}.Exposure.IncidentOverview&quot;)"/>
      <RangeInput
        editable="true"
        hideChildrenIfReadOnly="false"
        id="${info.IncidentType}"
        label="DisplayKey.get(&quot;NVV.Exposure.SubView.${info.ExposureType}.Exposure.Incident&quot;)"
        optionLabel="VALUE.${info.RiskObject.PrefixedCode}RU.DisplayName"
        required="true"
        value="Exposure.${info.IncidentType}"
        valueRange="Exposure.Claim.getIncidentsOfType(${info.IncidentType}) as ${info.IncidentType}[]"
        valueType="entity.${info.IncidentType}">
        <MenuItem
          action="${info.IncidentType}Popup.push(Exposure.Claim)"
          hideIfReadOnly="true"
          id="NewIncidentMenuItem"
          label="DisplayKey.get(&quot;NVV.Exposure.SubView.${info.ExposureType}.Exposure.NewIncident&quot;)"/>
        <MenuItem
          action="${info.IncidentType}Popup.push( Exposure.${info.IncidentType}, true )"
          hideIfReadOnly="true"
          id="EditIncidentMenuItem"
          label="DisplayKey.get(&quot;NVV.Exposure.SubView.${info.ExposureType}.Exposure.EditIncident&quot;)"
          visible="Exposure.${info.IncidentType} != null"/>
        <MenuItem
          action="${info.IncidentType}Popup.push( Exposure.${info.IncidentType}, false )"
          hideIfEditable="true"
          id="ViewIncidentMenuItem"
          label="DisplayKey.get(&quot;NVV.Exposure.SubView.${info.ExposureType}.Exposure.ViewIncident&quot;)"/>
        <PostOnChange/>
      </RangeInput>
      */ %>
      <TextInput
        id="IncidentDescription"
        label="<%= DynamicDisplayKey.declare("Web.Exposure.SubView." + info.ExposureType + ".Exposure.Description", "Description").getterCode()%>"
        value="Exposure.Incident.Description"/>
<% if (editExistingExposure) { %>
      <InputDivider/>
      <InputSetRef
        def="ExposureCodingFinancialsInputSet(Exposure)"/>
      <InputSetRef
        def="DeductibleInfoInputSet(Exposure)"/>
<% } %>
    </InputColumn>
    <InputFooterSection>
      <InputSetRef
        def="OtherCarrierInvolvementInputSet(Exposure)"/>
    </InputFooterSection>
  </DetailViewPanel>
</PCF>