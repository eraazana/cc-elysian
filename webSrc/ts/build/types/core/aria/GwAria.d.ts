import { GwRegisteredSystem } from "../util/GwRegisteredSystem";
import { GwAriaRole } from "./GwAriaRole";
import { GwDomNode, GwDomNodeList, GwInputElement } from "../../types/gwTypes";
import { GwAriaPropertiesAndState, GwAriaProperty, GwAriaRelationshipPropertiesAndState } from "./GwAriaPropertiesAndState";
export declare class GwAria extends GwRegisteredSystem {
    getSystemName(): string;
    addRoleAttributeToElement(role: GwAriaRole, domEl: GwDomNode): void;
    addAriaPropertyToElement<T extends GwAriaProperty>(property: T, value: GwAriaPropertiesAndState[T], domEl: GwDomNode): void;
    /**
     * This has no real difference in functionality to the "add" version at this time.
     */
    setAriaPropertyForElement<T extends GwAriaProperty>(property: T, value: GwAriaPropertiesAndState[T], domEl: GwDomNode): void;
    getAriaAttributeAndValue<T extends GwAriaProperty>(property: T, value: GwAriaPropertiesAndState[T]): {
        attribute: string;
        value: string;
    };
    addAriaPropertyWithReferencesToElement<T extends keyof GwAriaRelationshipPropertiesAndState>(property: T, ownerEl: GwDomNode, elementsWithId: GwDomNodeList): void;
    /**
     * Add an aria label with value <prefix + current value + suffix> to the input element.
     * @param el An editable (probably text) input.
     */
    addAriaLabelToInputIfPrefixedOrSuffixed(el: GwInputElement): void;
}
export declare const gwAria: GwAria;
