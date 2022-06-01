<%
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
uses com.guidewire.apd.model.PCFComponentNameRetriever
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
  <DetailViewPanel
    id="LossDetailsDV"
    mode="${mode}">
    <Require
      name="Claim"
      type="Claim"/>
    <InputColumn
      maxWidth="480px">
      <Label
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.LossDetails", "{Term.LossDetails.Proper}").getterCode()%>"/>
      <TextAreaInput
        editable="true"
        id="Description"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Description", "{Term.Description.Proper}").getterCode()%>"
        numRows="3"
        required="false"
        value="Claim.Description"/>
      <TypeKeyInput
        editable="true"
        id="LossCause"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.LossCause", "{Term.LossCause.Proper}").getterCode()%>"
        required="true"
        value="Claim.LossCause"
        valueType="typekey.LossCause"/>
      <TypeKeyInput
        editable="true"
        id="Notification_Fault"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.Fault", "{Term.FaultRating.Proper}").getterCode()%>"
        value="Claim.FaultRating"
        valueType="typekey.FaultRating">
        <PostOnChange
          deferUpdate="false"/>
      </TypeKeyInput>
      <TextInput
        editable="true"
        formatType="percentagePoints"
        id="Notification_AtFaultPercentage"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.AtFaultPercentage", "Insured's Liability %").getterCode()%>"
        value="Claim.Fault"
        valueType="java.math.BigDecimal"
        visible="Claim.FaultRating == TC_1"/>
      <RangeInput
        editable="true"
        id="Catastrophe_CatastropheNumber"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Catastrophe.CatastropheNumber", "{Term.Catastrophe.Proper}").getterCode()%>"
        required="false"
        value="Claim.Catastrophe"
        valueRange="gw.api.admin.CatastropheUtil.getCatastrophes()"
        valueType="entity.Catastrophe"/>
      <TypeKeyInput
        editable="true"
        id="Claim_Weather"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Weather", "Weather").getterCode()%>"
        value="Claim.Weather"
        valueType="typekey.WeatherType"/>
      <DateInput
        dateFormat="short"
        editable="true"
        id="LossDate"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.LossDate", "{Term.DateofLoss.Proper}").getterCode()%>"
        required="true"
        timeFormat="short"
        validationExpression="Claim.LossDate == null || Claim.LossDate &lt; gw.api.util.DateUtil.currentDate() ? null : DisplayKey.get(&quot;Java.Validation.Date.ForbidFuture&quot;)"
        value="Claim.LossDate">
        <PostOnChange
          onChange="gw.pcf.ClaimLossDetailsUtil.changedLossDate(Claim)"/>
      </DateInput>
      <InputDivider/>
      <Label
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.LossLocation", "{Term.LossLocation.Proper}").getterCode()%>"/>
      <InputSetRef
        def="CCAddressInputSet(Claim.AddressOwner)"
        mode="Claim.AddressOwner.InputSetMode"/>
      <InputDivider/>
      <Label
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification", "{Term.NotificationandContact.Proper}").getterCode()%>"/>
      <BooleanRadioInput
        editable="true"
        id="Notification_FirstNoticeSuit"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.FirstNoticeSuit", "{Term.FirstNoticeSuit.Proper}").getterCode()%>"
        value="Claim.FirstNoticeSuit"/>
      <TypeKeyInput
        editable="true"
        id="Notification_HowReported"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.HowReported", "{Term.HowReported.Proper}").getterCode()%>"
        value="Claim.HowReported"
        valueType="typekey.HowReportedType"/>
      <ClaimContactInput
        claim="Claim"
        editable="true"
        id="ReportedBy_Picker"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.ReportedBy.Picker", "{Term.ReportedBy.Proper}").getterCode()%>"
        newContactMenu="ClaimNewPersonOnlyPickerMenuItemSet"
        required="true"
        value="Claim.reporter"
        valueRange="Claim.RelatedPersonArray"/>
      <TypeKeyInput
        editable="true"
        id="Notification_ReportedByType"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.ReportedByType", "{Term.RelationshiptoInsured.Proper}").getterCode()%>"
        required="true"
        value="Claim.ReportedByType"
        valueType="typekey.PersonRelationType">
        <Reflect
          triggerIds="ReportedBy_Picker">
          <ReflectCondition
            condition="VALUE==Claim.Insured"
            value="&quot;self&quot;"/>
          <ReflectCondition
            condition="true"
            value="&quot;&quot;"/>
        </Reflect>
      </TypeKeyInput>
      <ClaimContactInput
        claim="Claim"
        editable="true"
        id="MainContact_Picker"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.MainContact.Picker", "{Term.MainContact.Proper}").getterCode()%>"
        newContactMenu="ClaimNewPersonOnlyPickerMenuItemSet"
        value="Claim.maincontact"
        valueRange="Claim.RelatedPersonArray"
        valueType="entity.Person"/>
      <TypeKeyInput
        editable="true"
        id="Notification_MainContactType"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.MainContactType", "{Term.RelationshiptoInsured.Proper}").getterCode()%>"
        value="Claim.MainContactType"
        valueType="typekey.PersonRelationType">
        <Reflect
          triggerIds="MainContact_Picker">
          <ReflectCondition
            condition="VALUE==Claim.Insured"
            value="&quot;self&quot;"/>
          <ReflectCondition
            condition="true"
            value="&quot;&quot;"/>
        </Reflect>
      </TypeKeyInput>
      <DateInput
        dateFormat="short"
        editable="true"
        id="Notification_DateReportedToAgent"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Notification.DateReportedToAgent", "Date Reported to Agent").getterCode()%>"
        timeFormat="short"
        value="Claim.DateRptdToAgent"/>
      <InputDivider/>
    </InputColumn>
    <InputColumn>
<%
for (var line in info.OrderedLines) {
  for (var riskObject in line.OrderedChildren) {
    var exposureInfo = info.calculateExposureType(riskObject)
    var incidentType = exposureInfo.PrefixedIncidentType
    var incidentDisplayKey = DynamicDisplayKey.declare("Term.APD.${info.Product.Code}.RiskUnit.${incidentType}", exposureInfo.ExposureTypeDisplayName)
    var addIncidentPopup = PCFComponentNameRetriever.getAddIncidentPopupForNewLossDetailsScreen(incidentType)
    if (addIncidentPopup.isEmpty()) {
        continue
    }
    var incidentUIHelperName = PCFComponentNameRetriever.getIncidentUIHelper(incidentType)
    if (not incidentUIHelperName.isEmpty()) {
%>
      <ListViewInput
          boldLabel="true"
          label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim." + incidentType + "", incidentDisplayKey.toString()).getterCode()%>"
          labelAbove="true">
        <Toolbar>
        <IteratorButtons
            iterator="Editable${incidentType}LV"/>
        </Toolbar>
        <ListViewPanel id="Editable${incidentType}LV">
          <Variable
            initialValue="new gw.api.claim.IncidentListUIHelper(Claim, List.of(gw.api.claim.IncidentUIHelpers.${incidentUIHelperName}))"
            name="incidentListUIHelper"
            type="gw.api.claim.IncidentListUIHelper"/>
          <RowIterator
            editable="true"
            elementName="incident"
            id="IncidentIterator"
            toAdd="${addIncidentPopup}.push(Claim)"
            value="Claim.${incidentType}sOnly"
            valueType="entity.Incident[]">
          <Variable
            initialValue="incidentListUIHelper.getIncidentUIHelper(incident)"
            name="incidentUIHelper"
            type="gw.api.claim.IncidentUIHelper"/>
          <Row>
            <TextCell
              action="incidentUIHelper.goToViewIncident(incident, CurrentLocation.InEditMode)"
              hideChildrenIfReadOnly="false"
              id="Name"
              label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim." + incidentType + ".Name", "Name").getterCode()%>"
              value="incidentUIHelper.getInstanceDisplayName(incident)">
              <MenuItem
                action="incidentUIHelper.goToViewIncident(incident, true)"
                id="EditIncident"
                label="incidentUIHelper.EditLabel"
                visible="perm.Incident.edit(incident)"/>
              <MenuItem
                action="incidentUIHelper.removeIncident(Claim, incident, CurrentLocation, null)"
                confirmMessage="incidentUIHelper.RemoveConfirmMsg"
                id="RemoveIncident"
                label="incidentUIHelper.RemoveLabel"
                visible="(!incident.UsedByExposure) and perm.Incident.edit(incident)"/>
            </TextCell>
            <TextAreaCell
              id="description"
              label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim." + incidentType + ".Description", "Description").getterCode()%>"
              value="incident.Description"/>
          </Row>
          </RowIterator>
        </ListViewPanel>
      </ListViewInput>
      <InputDivider/>
<%
} else {
    var listViewDef = incidentType.equals("TripIncident") ? "Editable${incidentType}sLV(Claim, true)" : "Editable${incidentType}sLV(Claim)"
%>
     <ListViewInput
        boldLabel="true"
        def="${listViewDef}"
        editable="true"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim." + incidentType + "", incidentDisplayKey.toString()).getterCode()%>"
        labelAbove="true">
        <Toolbar>
          <IteratorButtons
            iterator="Editable${incidentType}sLV.Editable${incidentType}sLV"/>
        </Toolbar>
      </ListViewInput>
      <InputDivider/>
<%
        }
    }
}
%>
      <ListViewInput
        boldLabel="true"
        def="EditableOfficialsLV(Claim)"
        editable="true"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Officials", "{Term.Officials.Proper}").getterCode()%>"
        labelAbove="true">
        <Toolbar>
          <IteratorButtons
            iterator="EditableOfficialsLV.EditableOfficialsLV"/>
        </Toolbar>
      </ListViewInput>
      <InputDivider/>
    </InputColumn>
    <InputFooterSection>
      <ListViewInput
        def="EditableWitnessesLV(Claim.getClaimContactRolesByRole(TC_WITNESS), Claim, TC_WITNESS)"
        editable="true"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.Witness.Header", "Witnesses").getterCode()%>"
        labelAbove="true">
        <Toolbar>
          <IteratorButtons
            iterator="EditableWitnessesLV.EditableWitnessesLV"/>
        </Toolbar>
      </ListViewInput>
      <ListViewInput
        def="EditableContributingFactorsLV(Claim)"
        editable="true"
        label="<%= DynamicDisplayKey.declare("NVV.Claim.SubView.LossDetails" + mode + ".Claim.ContributingFactors", "Contributing Factors").getterCode()%>"
        labelAbove="true">
        <Toolbar>
          <IteratorButtons
            iterator="EditableContributingFactorsLV.EditableContributingFactorsLV"/>
        </Toolbar>
      </ListViewInput>
    </InputFooterSection>
  </DetailViewPanel>
</PCF>
