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
  <Screen
    editable="true"
    id="New${info.PrefixedIncidentType}Screen">
    <Require
      name="a${info.PrefixedIncidentType}"
      type="${info.PrefixedIncidentType}"/>
    <TitleBar
      icon="${info.Product.Package}.${info.Product.Product.Code}IncidentIconSet.${info.PrefixedIncidentType.toUpperCase()}.DefaultHeaderIcon"
      iconType="svgFileName"/>
    <Toolbar>
      <EditButtons
        pickValue="a${info.PrefixedIncidentType }"/>
    </Toolbar>
    <PanelRow
      editable="true">
      <PanelColumn>
        <DetailViewPanel
          editable="true"
          id="${info.PrefixedIncidentType }DV">
          <InputColumn>
            <Label
              label="<%= DynamicDisplayKey.declare("Web." + info.PrefixedIncidentType + "DV." + info.RiskObject.Code, info.RiskObject.DisplayName + " Details").getterCode()%>"/>
            <RangeInput
              editable="true"
              id="${info.RiskObject.PrefixedCode}RU"
              label="<%= DynamicDisplayKey.declare("Web." + info.PrefixedIncidentType + "DV." + info.RiskObject.Code + ".Picker", info.RiskObject.DisplayName + " Involved").getterCode()%>"
              required="true"
              value="a${info.PrefixedIncidentType }.${info.RiskObject.Code}"
              valueRange="a${info.PrefixedIncidentType }.Claim.Policy.RiskUnits.whereTypeIs(${info.RiskObject.PrefixedCode}RU)*.${info.RiskObject.Code}"
              valueType="entity.${info.RiskObject.PrefixedCode}"
              optionLabel="a${info.PrefixedIncidentType }.Claim.Policy.RiskUnits.whereTypeIs(${info.RiskObject.PrefixedCode}RU).firstWhere(\elt -> elt.${info.RiskObject.Code} == VALUE).DisplayName">
              <PostOnChange/>
            </RangeInput>
            <InputSetRef def="${info.PrefixedIncidentType}InputSet(a${info.PrefixedIncidentType})"/>
          </InputColumn>
        </DetailViewPanel>
      </PanelColumn>
      <PanelColumn>
        <DetailViewPanel>
          <InputColumn>
            <TextAreaInput
              boldLabel="true"
              editable="true"
              id="Description"
              label="<%= DynamicDisplayKey.declare("Web." + info.PrefixedIncidentType + "DV.Description", "Damage Description").getterCode()%>"
              labelAbove="true"
              numRows="6"
              required="true"
              value="a${info.PrefixedIncidentType }.Description"
              valueSectionMaxWidth="480px"/>
          </InputColumn>
        </DetailViewPanel>
      </PanelColumn>
    </PanelRow>
    <DetailViewPanel>
      <InputColumn>
        <Label
          label="DisplayKey.get(&quot;Web.ServicesScreen.ServiceRequest.ServiceToPerform&quot;)"/>
        <TextInput
          id="ServiceRequestSubmitMessageFNOL"
          labelAbove="true"
          value="DisplayKey.get(&quot;Web.ServiceRequest.FNOL.SubmitMessage&quot;)"
          visible="a${info.PrefixedIncidentType }.Claim.DraftClaim"/>
        <TextInput
          id="ServiceRequestSubmitMessage"
          labelAbove="true"
          value="DisplayKey.get(&quot;Web.ServiceRequest.SubmitMessage&quot;)"
          visible="not a${info.PrefixedIncidentType }.Claim.DraftClaim and CurrentLocation.InEditMode"/>
        <InputSetRef
          def="OtherServicesLVInputSet(a${info.PrefixedIncidentType }.Claim, a${info.PrefixedIncidentType }, a${info.PrefixedIncidentType }.ServiceRequestsGw.toSet(), null, {})"/>
      </InputColumn>
    </DetailViewPanel>
  </Screen>
</PCF>