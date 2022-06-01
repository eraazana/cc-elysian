import { GwRegisteredSystem } from "../../core/util/GwRegisteredSystem";
import { GwDomNode, GwMap } from "../../types/gwTypes";
/**
 * Guidewire's TypeScript APIs are an early-stage feature and are subject to change in a future release.
 */
export declare class GwPassword extends GwRegisteredSystem {
    getSystemName(): string;
    readonly hiddenClass: string;
    clearValue(triggerNode: GwDomNode, args: GwMap): void;
}
export declare const gwPassword: GwPassword;
