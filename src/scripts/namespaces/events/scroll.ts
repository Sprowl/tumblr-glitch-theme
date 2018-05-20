import { Bootstrap } from "./../bootstrap";

import { eventoptions } from "./../constants";



export namespace Scroll {

    export let percentage = 0;



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
/// Scroll Methods.
/////////////////////////////
    const doDeviceScroll:EventListener = (event:Event) => { onDeviceScrollSet(event) };
    let scrollTimeout:number = 0;

    /** Fired whenever the event listener notices that the window has been resized.
     * @private
     * @param { Event } event The resize event.
     */
    function onDeviceScroll (event:Event):void {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout((event:Event) => { onDeviceScrollSet(event) }, 60);
    }

    /** Fired whenever the event listener notices that the user scrolled.
     * @private
     * @param { Event } event The scroll event.
     */
    function onDeviceScrollSet (event:Event):void {
        determineScrollPercent();
        alert();
    }

    /** Calculates the percentage of how far the user scrolled along the y-axis on the page.
     * @private
     */
    function determineScrollPercent():void {
        const html = <HTMLHtmlElement>document.documentElement;
        const body = <HTMLBodyElement>document.body;

        percentage = (html.scrollTop||body.scrollTop) / ((html.scrollHeight||body.scrollHeight) - html.clientHeight) * 100;
    }



/////////////////////////////
/// Bootstrapping.
/////////////////////////////

    /** Executing method for this namespace.
     * @private
     */
    function init ():void {}

    /** Adds methods to event listeners.
     * @private
     */
    function register ():void {
        window.addEventListener("scroll", doDeviceScroll, eventoptions);
    }

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {}

    /** Actually registers the methods.
    * @public
    */
   export function boot ():void {
       Bootstrap.registerInit(init);
       Bootstrap.registerRegister(register);
       Bootstrap.registerVarious(various);
   }

}