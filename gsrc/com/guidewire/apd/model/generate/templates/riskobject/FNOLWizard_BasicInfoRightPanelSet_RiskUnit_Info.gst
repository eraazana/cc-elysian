<%
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params( info : RiskObjectInfo ) %>
<?xml version="1.0"?>
<PCF
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="../../../../../../pcf.xsd">
  ${OverwriteWarning.renderToString(ContentType.PCF)}
  <PanelSet
    id="FNOLWizard_BasicInfoRight_${info.PrefixedCode}PanelSet">
    <Require
      name="Claim"
      type="Claim"/>
    <Require
      name="Wizard"
      type="gw.api.claim.NewClaimWizardInfo"/>
    <Variable
      initialValue="Claim.Policy.RiskUnits.whereTypeIs(${info.PrefixedCode}RU)"
      name="a${info.Code}List"
      recalculateOnRefresh="true"
      type="entity.${info.PrefixedCode}RU[]"/>
    <Layout
      columns="1"
      type="table"/>
    <PanelIterator
      elementName="a${info.Code}"
      id="a${info.Code}Iterator"
      value="a${info.Code}List"
      valueType="entity.${info.PrefixedCode}RU[]">
      <IteratorSort
        sortBy="a${info.Code}.RUNumber"
        sortOrder="1"/>
      <DetailViewPanel
        id="${info.Code}IncidentDV"
        inline="true"
        visible="a${info.Code}List.length &gt; 0">
        <InputColumn>
          <TextInput
            boldValue="true"
            id="${info.Code}"
            labelAbove="true"
            value="a${info.Code}.DisplayName"/>
          <ListViewInput
            id="${info.Code}CoveragesInput"
            labelAbove="true"
            visible="a${info.Code}.Coverages.length &gt; 0">
            <Toolbar/>
            <ListViewPanel
              id="${info.Code}CoveragesLV">
              <RowIterator
                editable="false"
                elementName="anRUCoverage"
                value="a${info.Code}.Coverages"
                valueType="entity.RUCoverage[]">
                <Row>
                  <TextCell
                    id="CoverageType"
                    value="anRUCoverage.Type"
                    valueType="typekey.CoverageType"
                    wrap="true"/>
                  <TextCell
                    id="CoverageDetails"
                    value="anRUCoverage.DetailsSummary"
                    wrap="true"/>
                </Row>
              </RowIterator>
            </ListViewPanel>
          </ListViewInput>
        </InputColumn>
      </DetailViewPanel>
      <PanelDivider
        visible="a${info.Code}List.length &gt; 1"/>
    </PanelIterator>
  </PanelSet>
</PCF>