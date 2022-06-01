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
  <Popup
    beforeCommit="a${info.PrefixedIncidentType }.Claim.instructNewServiceRequests()"
    canEdit="true"
    canVisit="true"
    id="${info.PrefixedIncidentType }Popup"
    returnType="${info.PrefixedIncidentType }"
    startInEditMode="startInEditMode"
    title="DisplayKey.get(&quot;Web.TripIncident&quot;)">
    <LocationEntryPoint
      signature="${info.PrefixedIncidentType }Popup(aClaim : Claim)"/>
    <LocationEntryPoint
      signature="${info.PrefixedIncidentType }Popup( a${info.PrefixedIncidentType }Param : ${info.PrefixedIncidentType }, startInEditMode : boolean)"/>
    <Variable
      name="aClaim"
      type="Claim"/>
    <Variable
      name="a${info.PrefixedIncidentType }Param"
      type="${info.PrefixedIncidentType }"/>
    <Variable
      initialValue="a${info.PrefixedIncidentType }Param == null ? aClaim.newIncident(entity.${info.PrefixedIncidentType }) as entity.${info.PrefixedIncidentType } : a${info.PrefixedIncidentType }Param"
      name="a${info.PrefixedIncidentType }"
      type="${info.PrefixedIncidentType }"/>
    <Variable
      initialValue="true"
      name="startInEditMode"
      type="boolean"/>
    <ScreenRef
      def="New${info.PrefixedIncidentType }Screen(a${info.PrefixedIncidentType })"/>
  </Popup>
</PCF>