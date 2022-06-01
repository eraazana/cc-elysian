import { GwDomNode, GwMap } from "../types/gwTypes";
import { GwInitializableSystem } from "../core/util/GwInitializableSystem";
/**
 * Guidewire's TypeScript APIs are an early-stage feature and are subject to change in a future release.
 */
export declare class GwMessages extends GwInitializableSystem {
    getSystemName(): string;
    private readonly NAV_ATTR;
    private readonly ERROR_CLASS;
    private readonly WARNING_CLASS;
    private readonly ERROR_QUICK_BUTTON_ID;
    private readonly LIVE_REGION_ID;
    private focusElementOnNextPageLoad;
    private errorsOnCurrentPage;
    private possiblyHighlightErrorButton;
    private numErrorsOnPage;
    private numWarningsOnPage;
    private numInfosOnPage;
    private readonly MESSAGE_SELECTOR_PARENT;
    private readonly ERROR_MESSAGE_SELECTOR;
    private readonly WARNING_MESSAGE_SELECTOR;
    private readonly INFO_MESSAGE_SELECTOR;
    /**
     * @Optimize, could do this entire init method server side and mark elements there, instead of modifying the dom here
     * Marks any widgets that lead to the destination of the errors as being in an error state.
     * If there's a focusElementOnNextPageLoad, then moves the focus to that element.
     */
    init(): void;
    /**
     * File download errors are awkward because they occur when we are "rendering" to a different
     * window. So in such cases we end up having to apply an error message to an existing error
     * widget on the client side. The server sends us the HTML for an entire error group, so we
     * currently clear out the entire existing contents of the messages widget and replace whatever
     * was there with the new error group.
     *
     * @param {string | null} html for the error group in which the error should appear
     */
    addFileDownloadError(dangerousHTML: string | null): void;
    private updateWebMessageIndicators();
    private updateQuickErrorButton();
    willFocusElementOnNextPageLoad(): boolean;
    private getQuickErrorButtonOrThrow();
    private getLiveRegion();
    private iterateMessagesWidgetsWithErrors(cb);
    private countAllMessagesBySeverityAndUpdateLiveRegion();
    /**
     * The constructed message will not appear on the page but will instead inhabit a region with role="alert", a "live-region",
     * which causes screen readers to read these messages aloud.
     * Example messages:
     * * This page contains error and warning messages. Errors: (3). Warnings: (1).
     * * This page contains informational messages. Infos: (1).
     * * This page contains error, warning, and informational messages. Errors: (2). Warnings: (3). Infos: (2).
     */
    private updateMessagesLiveRegion();
    quickErrorButton(el: GwDomNode, args: GwMap): void;
    toggleGroup(el: GwDomNode, args: GwMap): void;
    /**
     * Toggles the group of messages open or closed.
     */
    toggleSubGroup(el: GwDomNode, args: GwMap): void;
    private markNavElementAsHavingErrors(navId, hasOnlyWarnings?);
    /**
     * Move the focus to a field, animate it to show it, which will also scroll the page to include it if not currently visible.
     */
    highlight(el: GwDomNode | null, args: GwMap): void;
    /**
     * Requires the NAV_ATTR to be present on the element.
     * If present, then fires the event of the associated navigation element.
     */
    navigate(el: GwDomNode, args: GwMap): void;
    /**
     * If the web message widget has an action listener, then it has specific functionality to fire an event,
     * passing the parameter of the the WebMessage source id.
     */
    action(el: GwDomNode, args: GwMap): void;
}
export declare const gwMessages: GwMessages;
