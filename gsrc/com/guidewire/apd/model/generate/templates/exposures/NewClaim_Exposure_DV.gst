<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
%>
<%@ params(info: ExposureInfo) %>
${ExposureShared_DV.renderToString(info, false)}