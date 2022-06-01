<%
uses gw.apdcloud.client.model.APDAttributeTypeEnum
uses gw.apdcloud.client.model.APDFieldDTO
uses com.guidewire.apd.model.DynamicDisplayKey
uses com.guidewire.apd.model.generate.generators.info.RiskObjectInfo
%>
<%@ params(info: RiskObjectInfo, field: APDFieldDTO, entityVar: String) %>
<% var name = field.Code.capitalize()
%>
<%
var widget: String
var valueType: String;
switch(field.Type) {
    case APDAttributeTypeEnum.BOOLEAN:
        widget = "BooleanRadioInput";
        break;
    case APDAttributeTypeEnum.DATE:
        widget = "DateInput";
        break;
    case APDAttributeTypeEnum.BIGDECIMAL:
        widget = "TextInput";
        valueType = "java.math.BigDecimal";
        break;
    case APDAttributeTypeEnum.TYPEKEY:
        widget = "TypeKeyInput";
        if (field.Typelist != null) {
            valueType = "typekey.${field.Typelist}"
        } else {
            valueType = "typekey.${info.PrefixedCode}${field.Code.capitalize()}";
        }
        break;
    case APDAttributeTypeEnum.INTEGER:
        widget = "TextInput";
        valueType = "java.lang.Integer";
        break;
    case APDAttributeTypeEnum.LOCATION:
        // FIXME
        break;
    case APDAttributeTypeEnum.MONEY:
        widget = "TextInput";
        valueType = "java.math.BigDecimal";
        break;
    case APDAttributeTypeEnum.PARTY:
        // FIXME
        break;
    case APDAttributeTypeEnum.VARCHAR:
        widget = "TextInput";
        break;
}
%>
<% if (widget != null) { %>
<${widget}
  editable="true"
  id="${info.Code}_${name}"
  label="<%= DynamicDisplayKey.declare("Web.APD." + info.PrefixedCode + ".Input." + name + ".Label", field.NameL10NARRAY).getterCode()%>"
  helpText="<%= DynamicDisplayKey.declare("Web.APD." + info.PrefixedCode + ".Input." + name + ".Description", field.NameL10NARRAY).getterCode()%>"
  value="${entityVar}.${name}"
<% if (valueType != null) { %>    valueType="${valueType}"<% } %>/>
<% } %>
