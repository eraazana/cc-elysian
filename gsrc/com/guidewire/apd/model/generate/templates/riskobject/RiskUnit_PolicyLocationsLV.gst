<%
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <ListViewPanel
    editable="false"
    id="${info.PrefixedCode}PolicyLocationsLV">
    <Require
      name="PolicyLocations"
      type="PolicyLocation[]"/>
    <Require
      name="Claim"
      type="Claim"/>
    <ExposeIterator
      flags="hasRU,checked"
      valueType="PolicyLocation"
      widget="PolicyLocationIterator"/>
    <RowIterator
      appendPageInfo="true"
      checkBoxVisible="CurrentLocation.InEditMode"
      editable="false"
      elementName="PolicyLocation"
      hasCheckBoxes="true"
      id="PolicyLocationIterator"
      pickLocation="${info.PrefixedCode}PolicyLocationPopup.push(null, Claim, true)"
      toRemove="Claim.Policy.removeFromPolicyLocations(PolicyLocation)"
      value="PolicyLocations"
      valueType="entity.PolicyLocation[]">
      <ToolbarFlag
        condition="PolicyLocation.LocationBasedRisks.Count &gt; 0"
        name="hasRU"/>
      <ToolbarFlag
        name="checked"/>
      <Row>
        <TextCell
          action="${info.PrefixedCode}PolicyLocationPopup.push(PolicyLocation, Claim, CurrentLocation.InEditMode)"
          id="LocationNumber"
          label="DisplayKey.get(&quot;LV.Policy.Locations.Number&quot;)"
          value="PolicyLocation.LocationNumber"/>
        <TextCell
          id="Description"
          label="DisplayKey.get(&quot;LV.Policy.Locations.Description&quot;)"
          value="PolicyLocation.Address.Description"/>
        <TextCell
          action="${info.PrefixedCode}PolicyLocationPopup.push(PolicyLocation, Claim, CurrentLocation.InEditMode)"
          id="Address"
          label="DisplayKey.get(&quot;LV.Policy.Locations.Address&quot;)"
          value="PolicyLocation.Address"
          valueType="entity.Address"/>
        <TextCell
          id="Lienholders"
          label="DisplayKey.get(&quot;LV.Policy.Locations.Lienholders&quot;)"
          value="PolicyLocation.policyLocationLienHoldersOnly.join(&quot;, &quot;)"
          visible="Claim.Policy.PolicyType != PolicyType.TC_WORKERSCOMP"/>
        <TypeKeyCell
          id="HighValueItems"
          label="DisplayKey.get(&quot;LV.Policy.Locations.HasListedItems&quot;)"
          value="PolicyLocation.HighValueItems.Count &gt; 0 ? YesNo.TC_YES : YesNo.TC_NO"
          valueType="typekey.YesNo"/>
      </Row>
    </RowIterator>
  </ListViewPanel>
</PCF>