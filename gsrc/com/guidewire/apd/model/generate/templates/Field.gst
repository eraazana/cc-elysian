<%
uses gw.apdcloud.client.model.APDAttributeTypeEnum
uses gw.apdcloud.client.model.APDFieldDTO
uses org.apache.commons.lang.StringEscapeUtils
%>
<%@ params(prefix: String, field: APDFieldDTO) %>
<% var name = field.Code.capitalize() %>
<%
var type: String;
var size: Integer;
var typelist: String;
switch(field.Type) {
    case APDAttributeTypeEnum.BOOLEAN:
        type = "bit";
        break;
    case APDAttributeTypeEnum.DATE:
        type = "datetime";
        break;
    case APDAttributeTypeEnum.BIGDECIMAL:
        type = "decimal";
        break;
    case APDAttributeTypeEnum.TYPEKEY:
        if (field.Typelist != null) {
            typelist = field.Typelist;
        } else {
            typelist = "${prefix}${field.Code.capitalize()}";
        }
        break;
    case APDAttributeTypeEnum.INTEGER:
        type = "integer";
        break;
    case APDAttributeTypeEnum.LOCATION:
        // FIXME
        break;
    case APDAttributeTypeEnum.MONEY:
        type = "money";
        break;
    case APDAttributeTypeEnum.PARTY:
        // FIXME
        break;
    case APDAttributeTypeEnum.VARCHAR:
        type = "varchar";
        size = 255;
        break;
}
if (type != null && size != null) {
%>  <column
    name="${name}"
    desc="${StringEscapeUtils.escapeXml(field.Description)}"
    nullok="true"
    type="${type}">
      <columnParam
        name="size"
        value="${size}"
      />
  </column>
<% } else if (type == "decimal") { %>
  <column
    name="${name}"
    desc="${StringEscapeUtils.escapeXml(field.Description)}"
    nullok="true"
    type="${type}">
      <columnParam
        name="precision"
        value="5"/>
      <columnParam
        name="scale"
        value="2"/>
  </column>
<% } else if (type != null) { %>  <column
    name="${name}"
    desc="${StringEscapeUtils.escapeXml(field.Description)}"
    nullok="true"
    type="${type}"/>
<% } else if (typelist != null) { %>  <typekey
    name="${name}"
    desc="${StringEscapeUtils.escapeXml(field.Description)}"
    nullok="true"
    typelist="${typelist}"/>
<%
} else {
%><!-- Unsupported field ${name} of type ${field.Type} -->
<% } %>