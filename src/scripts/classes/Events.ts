import { eventoptions } from "./../namespaces/constants";

type tEventTrigger = {
    mouse:string;
    touch:string;
}
type tEventsCallbackTriggers = {
    event:tEventTrigger;
    callback:Function;
}
type tEventsCallbacks = {
    start: tEventsCallbackTriggers;
    stop:tEventsCallbackTriggers;
}
type tEventTriggers = {
    start:tEventTrigger;
    stop:tEventTrigger;
}

export const EVENT_HOVER_START:tEventTrigger = {
    mouse: "mouseenter",
    touch: "touchend"
};
export const EVENT_HOVER_END:tEventTrigger = {
    mouse: "mouseleave",
    touch: "touchend"
};
export const EVENT_CLICK:tEventTrigger = {
    mouse: "mouseup",
    touch: "touchend"
};



/** Class to support a range of events for HTML elements, which when triggered, will fire a specified function.
 * @class
 */
export class Events {
    /** The HTML element with all the event listeners. */
    private element:HTMLElement;
    /** The triggers of this batch of events. */
    private triggers:tEventTriggers;
    /** The scope-keeping function for when the mouse-event has been triggered. */
    public doMouseStart:EventListenerOrEventListenerObject = (event:MouseEvent) => this.onMouseStart(event);
    /** The scope-keeping function for when the mouse-event has been triggered. */
    public doMouseStop:EventListenerOrEventListenerObject = (event:MouseEvent) => this.onMouseStop(event);
    /** The scope-keeping function for when the touch-event has been triggered. */
    public doTouchStart:EventListenerOrEventListenerObject = (event:TouchEvent) => this.onTouchStart(event);
    /** The scope-keeping function for when the touch-event has been triggered. */
    public doTouchStop:EventListenerOrEventListenerObject = (event:TouchEvent) => this.onTouchStop(event);
    /** The callback function for when the event "starts". */
    private doCallbackStart:Function;
    /** The callback function for when the event "stops". */
    private doCallbackStop:Function;

    /** Creates two (`start`, `stop`) new sets (`mouse`, `touch`) of events for an HTML element, which this class will switch between before calling a callback function.
     * @constructor
     * @param { HTMLElement } element An HTML Element that recieves the event listeners.
     * @param { tEventsCallbacks } callbacks The callbacks. Takes an object with 2 properties `start` and `stop`, which then hold the type of trigger (`event`) and the callback function (`callback`). If one state is fired, the other will be untriggerable until the current one has been triggered.
     */
    public constructor (element:HTMLElement, callbacks:tEventsCallbacks) {
        this.element = element;

        this.triggers = {
            start: {
                mouse: callbacks.start.event.mouse,
                touch: callbacks.start.event.touch,
            },
            stop: {
                mouse: callbacks.stop.event.mouse,
                touch: callbacks.stop.event.touch,
            }
        };

        this.doCallbackStart = (event:MouseEvent|TouchEvent) => callbacks.start.callback(event);
        this.doCallbackStop = (event:MouseEvent|TouchEvent) => callbacks.stop.callback(event);

        this.element.addEventListener(this.triggers.start.mouse, this.doMouseStart, eventoptions);
        this.element.addEventListener(this.triggers.start.touch, this.doTouchStart, eventoptions);
    }

    /** Fired when the cursor is above the element.
     * @private
     * @param { MouseEvent } event The mouse event.
     */
    private onMouseStart (event:MouseEvent) {
        this.listenersStartTriggered();

        this.doCallbackStart(event);
    }

    /** Fired when the cursor leaves the element.
     * @private
     * @param { MouseEvent } event The mouse event.
     */
    private onMouseStop (event:MouseEvent) {
        this.listenersStopTriggered();
        
        this.doCallbackStop(event);
    }

    /** Fired when the finger taps the element.
     * @private
     * @param { MouseEvent } event The touch event.
     */
    private onTouchStart (event:TouchEvent) {
        this.listenersStartTriggered();

        this.doCallbackStart(event);
    }

    /** Fired when the finger taps a different element.
     * @private
     * @param { MouseEvent } event The touch event.
     */
    private onTouchStop (event:TouchEvent) {
        this.listenersStopTriggered();

        this.doCallbackStop(event);
    }

    /** Removes the current (`start`) Event listeners and adds the new (`stop`) ones.
     * @private
     */
    private listenersStartTriggered ():void {
        this.element.removeEventListener(this.triggers.start.mouse, this.doMouseStart);
        this.element.removeEventListener(this.triggers.start.touch, this.doTouchStart);
        this.element.addEventListener(this.triggers.stop.mouse, this.doMouseStop, eventoptions);
        this.element.addEventListener(this.triggers.stop.touch, this.doTouchStop, eventoptions);
    }

    /** Removes the current (`stop`) Event listeners and adds the new (`start`) ones.
     * @private
     */
    private listenersStopTriggered ():void {
        this.element.removeEventListener(this.triggers.stop.mouse, this.doMouseStop);
        this.element.removeEventListener(this.triggers.stop.touch, this.doTouchStop);
        this.element.addEventListener(this.triggers.start.mouse, this.doMouseStart, eventoptions);
        this.element.addEventListener(this.triggers.start.touch, this.doTouchStart, eventoptions);
    }

}