import { GwRegisteredSystem } from "./core/util/GwRegisteredSystem";
import { GwPartialReloadDetails } from "./types/gwTypes";
export declare class GwApp extends GwRegisteredSystem {
    /** Timeout in milliseconds, longest time we're prepared to wait for a new theme file to load */
    readonly MAX_WAIT_FOR_THEME: number;
    maxElementsToReplacePerFrame: number;
    shouldFlash: boolean;
    showDevLogs: boolean;
    showEventLogs: boolean;
    showTraceInLogs: boolean;
    newSession: boolean;
    enableWebsocket: boolean;
    EVENT_THROTTLE_MAX_REQUESTS_PER_SECOND: number | null;
    THEME_NAME_SEARCH_PARAM: string;
    getSystemName(): string;
    fireAfterFullPageReload(): void;
    fireAfterPartialPageReload(details: GwPartialReloadDetails): void;
    fireAfterGwBodyReplace(): void;
    showBody(): void;
    hideBody(): void;
    private resetInitOnlyValues();
    _dev_showBodyAfterReloadChunk(): void;
    popupAboutWindow(): Window | null;
    /**
     * Used to store and later re-focus on whatever the user was working on before they opened the shortcut help popup.
     * See {@link #gwPrefPanel.restoreUnderlyingPageFocus} for a similar implementation.
     * Right now there are only two modal elements in Pebbles. If we ever create a third,
     * care should be taken to consolidate the three components into one system.
     */
    private _shortcutHelpFocusRestore;
    openShortcutHelp(): void;
    onOpenShortcutHelp(): void;
    closeShortcutHelp(): void;
    private isNavigating;
    /**
     * Prepares the app for Nav, which cancels all remaining initialization. If navigating within the Cluster,
     * the onbeforeunload is cleared. Otherwise, we only stop initialization if there is no
     * onbeforeunload registered.
     */
    prepareForExitPointNavigation(preventUnloadAlert?: boolean): void;
    private getPreInitializationOrderSpecificSystems();
    private getPostInitializationOrderSpecificSystems();
    /**
     * @private
     * method used by both fullPage and partialPage reload. Passes the isFullPageReload
     * parameter in to any init method it calls, so the system or widget can do different things
     * based on whether it's a full or partial page reload.
     * @param isFullPageReload
     * @param partialReloadDetails an object containing a reason field and, if the reason is REPLACE_ITEMS,
     *        and ids field containing the ids of the items that were replaced
     */
    private abstractReload(isFullPageReload, partialReloadDetails?);
    /**
     *
     * @param isFullPageReload
     * @param partialReloadDetails
     * @return {boolean} true if initialized system as begun navigating
     */
    private initializeAllSystemsReturnTrueIfNavigating(isFullPageReload, partialReloadDetails?);
    private finalizeReloading(isFullPageReload);
    private handleReloadNotInIframe(isFullPageReload, partialReloadDetails?);
    private handleReloadWhileInIframe(isFullPageReload, partialReloadDetails?);
    /**
     * Fires before every server event.
     * Eventually, if many systems begin using this, it should be converted into a
     * "walkAllDomNodesBeforeServerEvent" where each node is passed into the methods defined in it.
     */
    beforeEachFireEventToServer(): void;
    private namedNoFormInputs;
    private revertNamedNoFormInputs();
    private registerAjaxForm();
    private possiblyLoadInMockLauncher();
    /**
     * The currently displayed theme is determined by the id of the document element,
     * which will be set to the id of one of the themes. For the theme to work the
     * corresponding style sheet must be loaded (each theme has a separately generated
     * style sheet).
     *
     * After a full page reload the server will have already set up the correct id on
     * the document element and added a link to the corresponding style sheet. But
     * after a partial reload the value stored in user preferences may differ from the
     * currently displayed theme, in which case we have to ensure the corresponding
     * style sheet is loaded and then change the document element id.
     *
     * @param {boolean} isFullPageReload is this a full reload or a partial reload?
     * @param {GwMap} partialReloadDetails details of why the partial reload happened
     * @returns {boolean} if the theme is being changed
     */
    private checkForThemeChange(isFullPageReload, partialReloadDetails?);
    private addIE11Polyfills();
}
export declare function handleNewThemeFromPartialOrIframe(newTheme: string): void;
/**
 * This is a brittle implementation, but there's too much changing to bother with something more solid, like a direct mapping.
 * For now, if the frame passes in a theme name with the word dark in it, then we give em dark
 * If they pass in a theme with the name banff in it, we give em banff
 * else, we give em cloud
 *
 * @param cmTheme
 * @return {string} a valid PL cloud theme name
 */
export declare function convertConfigManagerThemeNameToPLThemeName(cmTheme: string): string;
export declare const gwApp: GwApp;
