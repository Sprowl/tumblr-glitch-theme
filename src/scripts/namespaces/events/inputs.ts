import { Bootstrap } from "./../bootstrap";

import { eventoptions } from "./../constants";



export namespace Inputs {
/////////////////////////////
/// Input Methods.
/////////////////////////////
    export let touch = "ontouchstart" in window;



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
        window.addEventListener("mousemove", () => { touch = false }, eventoptions);
        window.addEventListener("touchstart", () => { touch = true }, eventoptions);
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