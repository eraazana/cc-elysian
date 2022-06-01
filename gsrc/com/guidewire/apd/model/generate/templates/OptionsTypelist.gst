<%
uses gw.apdcloud.client.model.APDDropdownOptionDTO
%>
<%@ params(name: String, codes: List<APDDropdownOptionDTO>) %>
<?xml version="1.0"?>
<typelist
  xmlns="http://guidewire.com/typelists"
  desc="${name}"
  final="false"
  name="${name}">
<% for (var code in codes) {
    var typeCodeName = code.Name.replace("&", "and")
%>
  <typecode
    code="${code.Code}"
    desc="${typeCodeName}"
    name="${typeCodeName}"/>
<% } %>
</typelist>