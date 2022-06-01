import { GwPartialReloadDetails } from "../types/gwTypes";
import { GwOrderDependentInitializableSystem } from "./util/GwOrderDependentInitializableSystem";
/**
 * Guidewire's TypeScript APIs are an early-stage feature and are subject to change in a future release.
 */
export declare class GwResizer extends GwOrderDependentInitializableSystem {
    getSystemName(): string;
    private navBarIsVisible;
    private _lastCenterScrollTop;
    private _lastCenterScrollHeight;
    private clearScrollTimeoutId;
    private resizerTimeoutId;
    private currentHamburger;
    private currentHamburgerSubMenu;
    private currentTabHolder;
    private _windowHeight;
    private _windowWidth;
    private _forceRecalcOnNextPartialPageLoad;
    private readonly _resizeCallbacks;
    orderSpecificInit(isFullPageReload: boolean, partialReloadDetails?: GwPartialReloadDetails): void;
    readonly windowHeight: number;
    readonly windowWidth: number;
    private updateWindowHeightAndWidth();
    forceRecalcOnNextPartialPageLoad(): void;
    /**
     * Called by resize event.
     */
    recalcPanelSizing(isFullPageReload?: boolean): void;
    /**
     * Needs to be called any time the screen size changes, or the south or west panel change their size.
     */
    recalcCenterPanel(): void;
    private recalcTabBarSizing(centerPanelTopSectionRect);
    private canLiveInTabBar(child);
    /**
     * Walks the currentHamburgerSubMenu.children and removes all classes relating to being in the top nav bar.
     * If the subMenu has no children, then hides the hamburger menu.
     */
    private processTabsInBarAndHamburger();
    private isCompactHamburgerMenu();
    private topNavIsFullyCollapsed();
    /**
     * Adds all tabs back into the tab bar
     */
    private addTabsBack();
    /**
     * Called by the resize event listener on the window.
     */
    private onResize();
    /**
     * Do the details of the given partial reload indicate that something in the tab bar area may have changed?
     * @param partialReloadDetails details of the partial page reload
     * @returns {boolean} true if any of the ids refer to items in the tab bar
     */
    private containsTabChanges(partialReloadDetails?);
    check(): void;
    addResizeCallback(callback: () => void): void;
    private getCenterTabBar();
    setNavToShow(): void;
    setNavToHide(): void;
    /**
     * Returns true if nav bar was hidden and element was child
     * @param possibleChild
     */
    showNavBarIfElementIsChild(possibleChild: HTMLElement): boolean;
    /**
     * Function called by gwEvent global scroll handler when the scroll target is the center page area.
     * If the preference scrollingCenterHidesTopNav is set to true, then this method will show/hide the top nav based on user scroll direction
     * @param centerPanelDiv
     */
    onCenterPanelScroll(centerPanelDiv: HTMLDivElement): void;
}
export declare const gwResizer: GwResizer;
