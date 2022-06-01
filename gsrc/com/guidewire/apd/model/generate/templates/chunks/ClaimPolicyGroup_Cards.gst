<%
uses com.guidewire.apd.model.generate.generators.info.ProductInfo
%>
<%@ params( product: ProductInfo ) %>
<% for (var line in product.OrderedLines) { %>
<%  for (var info in line.OrderedChildren) { %>
${RiskUnit_LocationRef.renderToString(info)}
<%  }%>
<% } %>
