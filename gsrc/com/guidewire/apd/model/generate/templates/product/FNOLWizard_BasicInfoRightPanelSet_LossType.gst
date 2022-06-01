<%
uses com.guidewire.apd.model.DynamicDisplayKey
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
  <PanelSet
    id="FNOLWizard_BasicInfoRightPanelSet"
    mode="${mode}">
    <Require
      name="Claim"
      type="Claim"/>
    <Require
      name="Wizard"
      type="gw.api.claim.NewClaimWizardInfo"/>
<% for (var line in info.OrderedLines) { %>
<% for (var riskUnit in line.OrderedChildren) { %>
<% /*

    <Variable
      initialValue="Claim.Policy.RiskUnits.whereTypeIs(entity.${riskUnit.PrefixedCode}RU)"
      name="Trips"
      recalculateOnRefresh="true"
      type="entity.TripRU[]"/>
    <DetailViewPanel>
      <InputColumn>
        <Label
          label="DisplayKey.get(&quot;Web.BasicInfoScreen.TripPanelColumn.InvolvedTripLabel&quot;)"/>
        <Label
          id="NoTripsFound"
          label="DisplayKey.get(&quot;Web.BasicInfoScreen.TripPanelColumn.NoTripsFound&quot;)"
          visible="Trips.length &lt; 1"/>
      </InputColumn>
    </DetailViewPanel>
 */ %>
    <PanelRef
      def="FNOLWizard_BasicInfoRight_${riskUnit.PrefixedCode}PanelSet(Claim, Wizard)"
      id="${riskUnit.Code}Info"
    />
<%   } %>
<% } %>
    <DetailViewPanel
      visible="Claim.Policy.Coverages.length &gt; 0">
      <InputColumn>
        <Label
          label="<%= DynamicDisplayKey.declare("Web.BasicInfoScreen." + mode + "PanelColumn.PolicyCoverages", "Policy Coverages").getterCode()%>"/>
        <InputIterator
          elementName="coverage"
          value="Claim.Policy.Coverages.sortBy(\ coverage -&gt; coverage.Type)"
          valueType="entity.PolicyCoverage[]">
          <Label/>
          <TextInput
            id="CoverageDetails"
            label="coverage.Type"
            value="coverage.DetailsSummary"/>
        </InputIterator>
      </InputColumn>
    </DetailViewPanel>
  </PanelSet>
</PCF>