<%
uses com.guidewire.apd.model.generate.generators.info.ExposureInfo
uses com.guidewire.pl.modules.rest.framework.v1.util.PluralNameUtil
uses com.guidewire.apd.model.generate.generators.templates.TemplateConfig.ContentType
uses com.guidewire.apd.model.generate.templates.OverwriteWarning
%>
<%@ params(info: ExposureInfo) %>
<%
  var pluralCode = PluralNameUtil.pluralize(info.RiskObject.Code)
  var singularCode = info.RiskObject.Code
  var lowercaseCode = info.RiskObject.Code.uncapitalize()
%>
${OverwriteWarning.renderToString(ContentType.GOSU)}
package ${info.IncidentGenRestPackage}

uses com.guidewire.pl.modules.rest.framework.v1.updater.config.JsonUpdaterPropertyImpl
uses gw.api.modules.rest.framework.v1.updater.BadPropertyValueException
uses gw.api.modules.rest.framework.v1.updater.config.ConfigurationErrorReporter
uses gw.api.modules.rest.framework.v1.updater.config.HandlerConfig
uses gw.api.modules.rest.framework.v1.updater.config.JsonUpdaterConfigurableTypeReference
uses gw.api.modules.rest.framework.v1.updater.handler.ObjectUpdateContext
uses gw.api.modules.rest.framework.v1.updater.resolver.JsonValueResolver
uses gw.api.rest.exceptions.BadInputException
uses com.guidewire.cc.rest.claim.v1.updater.PolicyObjectReferenceValueResolver
uses ${info.RiskObject.RiskUnitGenRestPackage}.Claim${info.RiskObject.PrefixedCode}

@ReadOnly
class ${info.RiskObject.PrefixedCode}JsonValueResolver implements JsonValueResolver {

  private var _delegate = new ValueResolverDelegate()

  override function configure(config : HandlerConfig, parseObject : JsonUpdaterConfigurableTypeReference, errorReporter : ConfigurationErrorReporter) {
    _delegate.configure(config, parseObject, errorReporter)
  }

  override function resolveValue(jsonValue : Object, propertyKey : String, context : ObjectUpdateContext) : Object {
    return _delegate.resolveValue(jsonValue, propertyKey, context)
  }

  private static class ValueResolverDelegate extends PolicyObjectReferenceValueResolver {

    @SuppressWarnings("HiddenPackageReference")
    override function resolveReferenceById(id : String, propertyKey : String, resolutionRoot : Object, context : ObjectUpdateContext) : Object {
      var incident = (resolutionRoot as ${info.PrefixedIncidentType })
      var policy${pluralCode} = incident.Claim.Policy.RestV1.Policy${PluralNameUtil.pluralize(info.RiskObject.PrefixedCode)}
      var matching${singularCode} = policy${pluralCode}.firstWhere(\v -> v.${info.RiskObject.Code}.RestId == id)
      if (matching${singularCode} == null) {
        // Allow the update if the id matches the current ${info.RiskObject.DisplayName}, even if it's not part of the policy
        var currentValue = (this.UpdaterProp as JsonUpdaterPropertyImpl).evaluatePath(context.SymbolTable, propertyKey) as Claim${info.RiskObject.PrefixedCode}
        if (currentValue != null && currentValue.RestId == id) {
          return currentValue
        }

        // Otherwise it's an error
        throw new BadPropertyValueException(propertyKey + ".id", "Rest.Claim.V1.${info.RiskObject.PrefixedCode}JsonValueResolver.NoMatchForId", {id})
      }
      return matching${singularCode}
    }

    override function resolveReferenceByPolicySystemId(policySystemId : String, propertyKey : String, context : ObjectUpdateContext) : Object {
      var policy${pluralCode} = (context.DestRoot as ${info.PrefixedIncidentType }).Claim.Policy.RestV1.Policy${PluralNameUtil.pluralize(info.RiskObject.PrefixedCode)}
      for (${lowercaseCode} in policy${pluralCode}) {
        if (${lowercaseCode}.${info.RiskObject.Code}.PolicySystemId == policySystemId) {
          return ${lowercaseCode}
        }
      }
      throw new BadInputException("Bad input, policySystemId '" + policySystemId + "' not found in Policy RiskUnits")
    }
  }
}