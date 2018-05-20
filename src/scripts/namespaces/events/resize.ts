import { Bootstrap } from "./../bootstrap";

import { eventoptions, VIEW_SMARTPHONE, VIEW_TABLET, VIEW_DESKTOP, VIEW_TV } from "./../constants";

type tView = {
    current:number;
    previous:number;
}



export namespace Resize {
/////////////////////////////
/// Input Methods.
/////////////////////////////
    export let viewsize:tView = {
        current: VIEW_SMARTPHONE,
        previous: VIEW_SMARTPHONE
    };
    export let size:number;

    /** Enables the usage of the CSS REM unit in JS. Depending on the view size, the REM value is higher on bigger screens, so we need a function to detect that.
     * @public
     * @param { number } multiplicator multiplicator * REM.
     * @returns { number } The multiplied number.
     */
    export function REM (multiplicator:number = 1):number {
        return (viewsize.current < VIEW_TV) ? multiplicator * 16 : multiplicator * 22;
    }

/////////////////////////////
/// Alerts Methods.
/////////////////////////////
    const alerts:Array<Function> = [];

    /** Allows external namespaces to get an alert as soon as the Resize event listeners has been triggered.
     * @public
     * @param { Function } callback The method to recieve the alert.
     */
    export function registerForAlert (callback:Function):void {
        alerts.push(callback);
    }

    /** The external function that goes through all callbacks.
     * @private
     */
    function alert ():void {
        alerts.forAll( (callback:Function) => {
            callback();
        });
    }



/////////////////////////////
/// Resize Methods.
/////////////////////////////
    const doDeviceWindowResize:EventListener = (event:Event) => { onDeviceWindowResize(event) };
    let resizeTimeout:number = 0;

    /** Fired whenever the event listener notices that the window has been resized.
     * @private
     * @param { Event } event The resize event.
     */
    function onDeviceWindowResize (event:Event):void {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout((event:Event) => {
            onDeviceWindowResizeSet()
        } , 250);
    }

    /** Fired whenever the event listener has noticed the last change 250ms ago.
     * @private
     */
    function onDeviceWindowResizeSet ():void {
        determineView();
        alert();
    }

    /** Depending on the breakpoints and current window width, this method determines what the current view is.
     * @private
     */
    function determineView ():void {
        size = window.innerWidth;
        viewsize.previous = viewsize.current;

        if (size < 550) {
            viewsize.current = VIEW_SMARTPHONE;
        }
        else if (size >= 1921) {
            viewsize.current = VIEW_TV;
        }
        else if(size >= 1224) {
            viewsize.current = VIEW_DESKTOP;
        }
        else if (size >= 550) {
            viewsize.current = VIEW_TABLET;
        }

    }



/////////////////////////////
/// Bootstrapping.
/////////////////////////////
    /** Executing method for this namespace.
     * @private
     */
    function init ():void {
        determineView();
    }

    /** Adds methods to event listeners.
     * @private
     */
    function register ():void {
        window.addEventListener("resize", doDeviceWindowResize, eventoptions);
    }

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {
        alert();
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