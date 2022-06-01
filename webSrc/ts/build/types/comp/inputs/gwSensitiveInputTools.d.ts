import { GwDomNode, GwMap } from "../../types/gwTypes";
/**
 * Guidewire's TypeScript APIs are an early-stage feature and are subject to change in a future release.
 */
export declare class GwSensitiveInputTools {
    readonly hiddenClass: string;
    clearValue(triggerNode: GwDomNode, dropMenuClass: string, valueFieldClass: string, args: GwMap): void;
    setValueProgammatically(widgetNode: GwDomNode, dropMenuClass: string, valueFieldClass: string, value: string): boolean;
}
export declare const gwSensitiveInputTools: GwSensitiveInputTools;
