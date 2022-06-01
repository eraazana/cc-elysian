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
  <ListViewPanel
    id="Editable${info.PrefixedIncidentType }sLV">
    <ExposeIterator
      flags="Removeable"
      valueType="entity.${info.PrefixedIncidentType }"
      widget="Editable${info.PrefixedIncidentType }sLV"/>
    <Require
      name="Claim"
      type="Claim"/>
    <RowIterator
      editable="true"
      elementName="a${info.PrefixedIncidentType }"
      hideCheckBoxesIfReadOnly="true"
      pageSize="5"
      pickLocation="${info.PrefixedIncidentType }Popup.push( Claim )"
      toRemove="remove${info.PrefixedIncidentType }(a${info.PrefixedIncidentType })"
      value="Claim.${info.PrefixedIncidentType }sOnly"
      valueType="entity.${info.PrefixedIncidentType }[]">
      <ToolbarFlag
        name="Removeable"/>
      <Row>
        <TextCell
          action="${info.PrefixedIncidentType }Popup.push(a${info.PrefixedIncidentType }, CurrentLocation.InEditMode)"
          id="PropertyDesc"
          label="<%= DynamicDisplayKey.declare("Web." + info.PrefixedIncidentType + ".PropertyDescription", "Description").getterCode()%>"
          value="a${info.PrefixedIncidentType }"
          valueType="entity.${info.PrefixedIncidentType }"/>
        <TextCell
          action="${info.PrefixedIncidentType }Popup.push(a${info.PrefixedIncidentType }, CurrentLocation.InEditMode)"
          id="Description"
          label="<%= DynamicDisplayKey.declare("Web." + info.PrefixedIncidentType + ".Description", "Damage Description").getterCode()%>"
          value="a${info.PrefixedIncidentType }.Description.length &gt; 40 ? a${info.PrefixedIncidentType }.Description.substring( 0, 37 ) + &quot;...&quot; : a${info.PrefixedIncidentType }.Description"
          wrapLabel="true"/>
      </Row>
    </RowIterator>
    <Code><![CDATA[function remove${info.PrefixedIncidentType }(${info.PrefixedIncidentType }Param : ${info.PrefixedIncidentType }) {
  if (${info.PrefixedIncidentType }Param.UsedByExposure) {
      throw new gw.api.util.DisplayableException(<%=DynamicDisplayKey.declare("Web.NewLossDetailsScreen.CannotDelete" + info.PrefixedIncidentType + "ExposureLabel", "This incident is being used by an exposure. You must delete the exposure before you can delete the incident.").getterCode().replaceAll("&quot;","\"")%>)
  }  
  Claim.removeNewServiceRequests(${info.PrefixedIncidentType }Param)
  Claim.removeFromIncidents(${info.PrefixedIncidentType}Param )
}]]></Code>
  </ListViewPanel>
</PCF>