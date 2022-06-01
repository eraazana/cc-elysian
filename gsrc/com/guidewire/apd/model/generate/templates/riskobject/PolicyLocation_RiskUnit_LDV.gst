<%
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo) %>
<%
var riskUnitTerm = DynamicDisplayKey.declare("Term.APD.RiskUnit." + info.RiskObject.Code, info.RiskObject?.NameL10NARRAY)
%>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <ListDetailPanel
    id="PolicyLocation${info.PrefixedCode}LDV"
    selectionName="PolicyLocation"
    selectionType="PolicyLocation">
    <Require
      name="Claim"
      type="Claim"/>
    <ExposeIterator
      flags="hasRU,checked"
      name="PolicyLocationIterator"
      valueType="entity.PolicyLocation"
      widget="${info.PrefixedCode}PolicyLocationsLV.PolicyLocationIterator"/>
    <PanelRef
      def="${info.PrefixedCode}PolicyLocationsLV(Claim.Policy.PolicyLocations, Claim)"
      editable="false"
      mode="gw.config.LOBAbstraction.ForClaim.ForLossType.getUIMode(Claim)">
      <TitleBar
        title="DisplayKey.get(&quot;JSP.NewClaimPolicyDetails.Policy.Locations&quot;)"/>
    </PanelRef>
    <CardViewPanel>
      <Card
        id="${info.PrefixedCode}Card"
        title="<%= DynamicDisplayKey.declare("Web.NewClaimPolicyDetails.Policy." + info.PrefixedCode, riskUnitTerm.toString()).getterCode()%>">
        <PanelRef>
          <Toolbar>
            <IteratorButtons
              addVisible="!Claim.Policy.Verified and perm.Policy.edit(Claim)"
              iterator="NewClaim${info.PrefixedCode}LV"
              removeVisible="perm.Policy.edit(Claim)"/>
          </Toolbar>
           <ListViewPanel
              id="NewClaim${info.PrefixedCode}LV"
              maxWidth="250px">
                 <RowIterator
                   appendPageInfo="true"
                   editable="false"
                   elementName="a${info.Code}RU"
                   pickLocation="${info.PrefixedCode}RUPopup.push(Claim, PolicyLocation)"
                   toRemove="PolicyLocation.remove${info.PrefixedCode}RU(a${info.Code}RU, Claim.Policy)"
                   pickValue="a${info.Code}RU"
                   value="PolicyLocation.LocationBasedRisks.whereTypeIs(${info.PrefixedCode}RU)"
                   valueType="entity.${info.PrefixedCode}RU[]">
                   <Row>
                     <TextCell
                       action="${info.PrefixedCode}RUPopup.push(Claim, a${info.Code}RU, CurrentLocation.InEditMode, PolicyLocation)"
                       id="${info.Code}RU_DisplayName"
                       label="<%= DynamicDisplayKey.declare("Web.NewClaimPolicyDetails.Policy.RiskUnit." + info.PrefixedCode, riskUnitTerm.toString()).getterCode()%>"
                       value="a${info.Code}RU"
                       valueType="entity.${info.PrefixedCode}RU"/>
                   </Row>
              </RowIterator>
            </ListViewPanel>
        </PanelRef>
      </Card>
    </CardViewPanel>
  </ListDetailPanel>
</PCF>
