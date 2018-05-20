/** Helps creating animations with the use of window.requestAnimationFrame.
 * 
 * Can simply be used by creating a new instance, with a callback function that is called every time. The callback function has to return a boolean value, which tells the instance if a new frame is needed (`true`) or not (`false`). If not, no further animation frames will be called and a new `Animator` instance will be needed to create a new animation.
 * @class
 */
export class Animator {
    /** Identifier of the current request. */
    private id:number;
    /** The frame counter. */
    private frame:number;
    /** Callback function. */
    private doCallback:Function;



    /** Creates a new `Animator` instance.
     * @constructor
     * @param { Function } callback The function that will be called with each frame. Has to return a boolean value to tell the `Animator` if a new frame should be requested (`true`) or not (`false`).
     */
    public constructor (callback:Function) {
        this.doCallback = (time:number):boolean => { return callback(time) };

        this.frame = 0;
        this.id = window.requestAnimationFrame( (time:number) => { this.step(this.frame) });

    }

    /** The step method which checks if the callback is still in need of new frames. If so, it requests a new animation frame which will call this method again. Otherwise the requests are canceled.
     * @private
     * @param {number} time The time when the frame is called.
     */
    private step (time:number):void {
        this.frame++;

        if ( this.doCallback(time) ) {
            this.id = window.requestAnimationFrame( (time:number) => this.step(this.frame) );
        }

        else {
            this.cancel();
        }
    }

    /** Cancels the animation frame requests.
     * @private
     */
    private cancel ():void {
        window.cancelAnimationFrame(this.id);
    }

    /** Returns the callback status.
     * @private
     * @param { number } time The timestamp of the request.
     * @returns boolean.
     */
    private onCallback (time:number):boolean {
        return this.doCallback(time);
    }
}