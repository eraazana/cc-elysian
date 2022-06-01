<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.PCFComponentNameRetriever
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params( info : ProductInfo ) %>
<%
  var mode = info.Product.Abbreviation
%>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <Screen
    id="FNOLWizard_NewLossDetailsScreen"
    mode="${mode}">
    <Require
      name="Claim"
      type="Claim"/>
    <Require
      name="Wizard"
      type="gw.api.claim.NewClaimWizardInfo"/>
    <Variable
      initialValue="Claim.Officials.length &gt; 0"
      name="Officials"
      type="boolean"/>
    <Variable
      initialValue="Claim.MetroReports.length &gt; 0"
      name="PoliceReport"
      type="boolean"/>
    <Toolbar>
      <WizardButtons/>
    </Toolbar>
    <DetailViewPanel
      id="LossDetailsAddressDV">
      <InputColumn>
        <TextAreaInput
          editable="true"
          id="Description"
          label="DisplayKey.get(&quot;Web.NewLossDetailsScreen.LossDetailsAddressDV.WhatHappened.Label&quot;)"
          numRows="3"
          value="Claim.Description"/>
        <DateInput
          dateFormat="short"
          id="Claim_LossDate"
          label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.LossDate", "{Term.DateofLoss.Proper}").getterCode()%>"
          timeFormat="short"
          validationExpression="Claim.LossDate != null || Claim.LossDate &lt; gw.api.util.DateUtil.currentDate() ? null : DisplayKey.get(&quot;Java.Validation.Date.ForbidFuture&quot;)"
          value="Claim.LossDate"/>
        <TypeKeyInput
          editable="true"
          id="Claim_LossCause"
          label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.LossCause", "{Term.LossCause.Proper}").getterCode()%>"
          required="true"
          value="Claim.LossCause"
          valueType="typekey.LossCause"/>
        <CheckBoxInput
          editable="true"
          id="IncidentOnly"
          label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.Status.IncidentReport", "{Term.IncidentOnly.Proper}").getterCode()%>"
          value="Claim.IncidentReport"/>
      </InputColumn>
      <InputColumn maxWidth="480px">
        <InputSetRef
          def="CCAddressInputSet(Claim.AddressOwner)"
          id="AddressDetailInputSetRef"/>
      </InputColumn>
    </DetailViewPanel>
    <PanelRef
      id="IncidentPanelRef">
      <TitleBar
        title="<%= DynamicDisplayKey.declare("Web.NewLossDetailsScreen." + mode + ".Label", "Incidents").getterCode()%>"/>
      <Toolbar>
<%
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var exposureInfo = info.calculateExposureType(riskObject)
    var incidentType = exposureInfo.PrefixedIncidentType
    var addIncidentPopup = PCFComponentNameRetriever.getAddIncidentPopupForNewLossDetailsScreen(incidentType)
    if (addIncidentPopup.isEmpty()) {
        continue
    }
    var icon = PCFComponentNameRetriever.getIcon(info, exposureInfo.isExistingIncidentType(), incidentType)
%>
        <ToolbarButton
          action="<%= addIncidentPopup%>.push(Claim)"
          icon="${icon}"
          iconType="svgFileName"
          id="Add${riskObject.Code}Button"
          label="<%= DynamicDisplayKey.declare("Web.NewLossDetailsScreen.IncidentPanelRef.Add" + incidentType + "Button.Label", "Add ${exposureInfo.ExposureTypeDisplayName}").getterCode()%>"
        />
<%
  }
}
%>
      </Toolbar>
      <PanelSet>
<%
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var incidentType = info.calculateExposureType(riskObject).PrefixedIncidentType
    if (incidentType.equals("MobilePropertyIncident") || incidentType.equals("Incident")) {
        continue
    }
%>
        <Variable
          initialValue="Claim.${incidentType}sOnly"
          name="a${incidentType}List"
          recalculateOnRefresh="true"
          type="entity.${incidentType}[]"/>
<%
  }
}
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var exposureInfo = info.calculateExposureType(riskObject)
    var exposureTypeDisplayName = exposureInfo.getExposureTypeDisplayName()
    var incidentType = exposureInfo.PrefixedIncidentType
    var editIncidentPopup = PCFComponentNameRetriever.getEditIncidentPopupForNewLossDetailsScreen(incidentType)
    if (editIncidentPopup.isEmpty()) {
        continue
    }
%>
        <PanelRow>
          <PanelColumn
            visible="a${incidentType}List.HasElements">
            <PanelIterator
              elementName="a${incidentType}"
              id="${incidentType}Iterator"
              value="a${incidentType}List"
              valueType="entity.${incidentType}[]">
              <DetailViewPanel
                border="true"
                columnDivider="false"
                id="${incidentType}DV"
                inline="true"
                width="320px">
                <InputColumn
                  width="30px">
                  <Label
                    icon="a${incidentType}.PanelIcon"
                    iconType="svgFileName"
                    id="tripIcon"/>
                </InputColumn>
                <InputColumn
                  width="250px">
                  <TextInput
                    action="<%= editIncidentPopup%>.push(a${incidentType}, true)"
                    boldValue="true"
                    hideChildrenIfReadOnly="false"
                    id="${riskObject.Code}Name"
                    labelAbove="true"
                    value="a${incidentType}.DisplayName.elide(25)"
                    valueType="String">
                    <MenuItem
                      action="<%= editIncidentPopup%>.push(a${incidentType}, true)"
                      id="Edit${riskObject.Code}Menu"
                      label="<%= DynamicDisplayKey.declare("Web.NewLossDetailsScreen" + incidentType + "Iterator.Edit" + incidentType + "MenuItem.Label", "Edit ${exposureTypeDisplayName}").getterCode()%>"/>
                    <MenuItem
                      action="a${incidentType}.Claim.removeFromIncidents(a${incidentType})"
                      confirmMessage="<%= DynamicDisplayKey.declare("Web.NewLossDetailsScreen" + incidentType + "Iterator.Remove" + incidentType + "MenuItem.ConfirmMessage", "Do you want to remove this {Term.APD.RiskUnit." + riskObject.Code + "}?").getterCode()%>"
                      id="Remove${riskObject.Code}Menu"
                      label="<%= DynamicDisplayKey.declare("Web.NewLossDetailsScreen" + incidentType + "Iterator.Remove" + incidentType + "MenuItem.Label", "Remove ${exposureTypeDisplayName}").getterCode()%>"
                      visible="a${incidentType}.Exposures.IsEmpty"/>
                  </TextInput>
                  <TextAreaInput
                    id="${incidentType}Description"
                    labelAbove="true"
                    value="a${incidentType}.Description"
                    valueType="String"
                    visible="a${incidentType}.Description.HasContent"/>
                </InputColumn>
              </DetailViewPanel>
              <Spacer
                height="8px"/>
            </PanelIterator>
          </PanelColumn>
        </PanelRow>
<%
  }
}
%>
      </PanelSet>
    </PanelRef>
    <PanelRef>
      <TitleBar
        title="DisplayKey.get(&quot;Web.NewLossDetailsScreen.AtTheSceneDV.AtTheSceneLabel&quot;)"/>
      <DetailViewPanel
        id="AtTheSceneDV">
        <InputColumn>
          <ListViewInput
            def="EditableWitnessesLV(Claim.getClaimContactRolesByRole(ContactRole.TC_WITNESS), Claim, ContactRole.TC_WITNESS)"
            editable="true"
            id="WitnessLV"
            label="DisplayKey.get(&quot;Web.NewLossDetailsScreen.AtTheSceneDV.AnyWitnesses.Label&quot;)"
            labelAbove="true">
            <Toolbar>
              <IteratorButtons
                iterator="WitnessLV.EditableWitnessesLV"/>
            </Toolbar>
          </ListViewInput>
          <ListViewInput
            def="EditableOfficialsLV(Claim)"
            editable="true"
            id="Claim_Officials"
            label="DisplayKey.get(&quot;Web.NewLossDetailsScreen.AtTheSceneDV.Officials.Label&quot;)"
            labelAbove="true">
            <Toolbar>
              <IteratorButtons
                iterator="Claim_Officials.EditableOfficialsLV"/>
            </Toolbar>
          </ListViewInput>
        </InputColumn>
      </DetailViewPanel>
    </PanelRef>
    <PanelRef>
      <TitleBar
        title="DisplayKey.get(&quot;Web.NewLossDetailsScreen.CategorizationDV.CategorizationLabel&quot;)"/>
      <DetailViewPanel
        id="CategorizationDV">
        <InputColumn>
          <TypeKeyInput
            editable="true"
            id="Notification_Fault"
            label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.Notification.Fault", "{Term.FaultRating.Proper}").getterCode()%>"
            value="Claim.FaultRating"
            valueType="typekey.FaultRating"/>
          <TypeKeyInput
            editable="true"
            id="Claim_Weather"
            label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.Weather", "Weather").getterCode()%>"
            value="Claim.Weather"
            valueType="typekey.WeatherType"/>
          <RangeInput
            editable="true"
            id="Catastrophe_CatastropheNumber"
            label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.Catastrophe.CatastropheNumber", "{Term.Catastrophe.Proper}").getterCode()%>"
            required="false"
            value="Claim.Catastrophe"
            valueRange="gw.api.admin.CatastropheUtil.getCatastrophes()"
            valueType="entity.Catastrophe"/>
          <RangeInput
            editable="true"
            id="Claim_PermissionRequired"
            label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.NewClaimLossDetails" + mode + ".Claim.PermissionRequired", "Special {Term.Claim.Proper} Permission").getterCode()%>"
            required="false"
            value="Claim.PermissionRequired"
            valueRange="gw.api.claim.ClaimUtil.getAvailableTypes()"
            valueType="typekey.ClaimSecurityType"/>
        </InputColumn>
      </DetailViewPanel>
    </PanelRef>
  </Screen>
</PCF>