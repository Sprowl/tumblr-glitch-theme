import { Bootstrap } from "./bootstrap";

import { VIEW_SMARTPHONE, VIEW_TABLET, VIEW_DESKTOP, VIEW_TV, setCSSVariable, getCSSVariable } from "./constants";
import { Resize } from "./events/resize";



type tPostResponsiveAlert = {
    once:boolean;
    callbackfunction:Function;
};

export namespace PostsResponsive {
    let list:HTMLUListElement;
    let grids:HTMLCollectionOf<Element>;

    /** Replaces specific DOM elements to different spots to support different viewports.
     * @public
     * @param { number } width The width of the window.
     */
    export function onResize (width:number):void {
        let grid:Element = null;
        let boxTags:Element = null;
        let wrapper:Element = null;
        let i = 0;

        if (Resize.viewsize.previous == VIEW_SMARTPHONE && Resize.viewsize.current != VIEW_SMARTPHONE ) {

            for (i; i < grids.length; i++) {
                grid = grids[i];

                try {
                    boxTags = grid.getElementsByClassName("box-tags")[0] || null;
                    wrapper = grid.getElementsByClassName("wrapper-content")[0] || null;

                    if (boxTags && wrapper) {
                        wrapper.appendChild(boxTags);
                    }
                }
                catch (error) {
                    console.error("Error replacing the taglist on bigger screens:", error);
                }
                finally {
                }
            }

            alert();

        }

        else if (Resize.viewsize.previous != VIEW_SMARTPHONE && Resize.viewsize.current == VIEW_SMARTPHONE) {

            for (i; i < grids.length; i++) {
                grid = grids[i];

                try {
                    boxTags = grid.getElementsByClassName("box-tags")[0] || null;
                    wrapper = grid.getElementsByClassName("wrapper-tags")[0] || null;

                    if (boxTags && wrapper) {
                        wrapper.appendChild(boxTags);
                    }
                }

                catch (error) {
                    console.error("Error replacing the taglist on smaller screens:", error);
                }
                finally {
                }
            }

            alert();
        }

        applyPostWidths();
    }

    function getPostsFullwidth ():number {
        const full = document.body.offsetWidth;
        const media = Resize.viewsize.current;
        const space_usercard = Resize.REM(12) + Resize.REM(2);
        let wrapper:number;
        let size:number = 0.0;

        switch (media) {

            case VIEW_TV:
                wrapper = full - 2 * Resize.REM(3.75);
                size = (wrapper < 1920) ? wrapper - space_usercard : 1920 - space_usercard;
                break;

            case VIEW_DESKTOP:
                wrapper = full - 2 * Resize.REM(3.75);
                size = (wrapper < 1280) ? wrapper - space_usercard : 1280 - space_usercard;
                break;

            case VIEW_SMARTPHONE:
            case VIEW_TABLET:
            default:
                size = full - Resize.REM(2);
                break;
        }

        return size || 0;
    }

    function applyPostWidths ():void {
        const widthFull = Math.floor(getPostsFullwidth());
        const fractionContent = 1.0;
        const fractionComments = 0.874;
        const gap = Resize.REM();

        const percentContent = fractionContent / (fractionContent + fractionComments);
        const percentComments = fractionComments / (fractionContent + fractionComments);

        const widthContent = Math.floor((widthFull * percentContent) - (gap / 2));
        const widthComments = Math.ceil((widthFull * percentComments) - (gap / 2));

        const leftContent = list.getBoundingClientRect().left;
        const leftComments = leftContent + widthContent + Resize.REM();

        setCSSVariable(list, "--script-width-full", widthFull);
        setCSSVariable(list, "--script-width-content", widthContent);
        setCSSVariable(list, "--script-width-comments", widthComments);
        
        setCSSVariable(list, "--script-left-content", leftContent);
        setCSSVariable(list, "--script-left-comments", leftComments);

        setCSSVariable(list, "--script-media-content-height", Math.ceil( (widthContent / (16 / 9 ) ) ) );
        setCSSVariable(list, "--script-media-full-height", Math.ceil( (widthFull / (16 / 9) ) ) );
    }

/////////////////////////////
/// Alerts Methods.
/////////////////////////////
    const alerts:Array<tPostResponsiveAlert> = [];

    /** Allows external namespaces to get an alert as soon as the Resize event listeners has been triggered.
     * @public
     * @param { Function } callback The method to recieve the alert.
     */
    export function registerForAlert (callback:Function):void {
        alerts.push({
            once: false,
            callbackfunction: callback
        });
    }

    /** Allows external namespaces to get an alert as soon as the Resize event listeners has been triggered. Happens only once, afterwards the callback function is removed from the calllist.
     * @public
     * @param { Function } callback The method to recieve the alert.
     */
    export function registerForAlertOnce (callback:Function):void {
        alerts.push({
            once: true,
            callbackfunction: callback
        });
    }

    /** The external function that goes through all callbacks.
     * @private
     */
    function alert ():void {
        alerts.forAll( (alert:tPostResponsiveAlert, index:number) => {
            if (alert.once) {
                alert.callbackfunction();
                alerts.splice(index, 1);
            }

            else {
                alert.callbackfunction();
            }
        });
    }



/////////////////////////////
/// Bootstrapping.
/////////////////////////////
    /** Executing method for this namespace.
     * @private
     */
    function init ():void {
        list = <HTMLUListElement>document.getElementById("posts");
        grids = document.getElementsByClassName("grid");
    }

    /** Adds methods to event listeners.
     * @private
     */
    function register ():void {
        Resize.registerForAlert( () => { onResize(window.innerWidth) });
    }

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {
        applyPostWidths();
    }

    /** Actually registers the methods.
     * @public
     */
    export function boot ():void {
        Bootstrap.registerInit(init);
        Bootstrap.registerRegister(register);
        Bootstrap.registerVarious(various);
    }

}
