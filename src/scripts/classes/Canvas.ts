/** Easily and fast creates new HTML canvases.
 * @class
 */
export class Canvas {
    /** HTML canvas element. */
    private _canvas:HTMLCanvasElement;
    /** Rendering context. */
    private _ctx:CanvasRenderingContext2D;



    /** Creates a new `Canvas` instance.
     * @constructor
     * @param { number } width Defaults to 0. The width of the canvas.
     * @param { number } height Defaults to 0. Height of the canvas.
     * @param { string } classname Optional. The CSS classname the HTMLCanvasElement shoudl get.
     */
    public constructor (width:number = 0, height:number = 0, classname?:string) {
        this.canvas = document.createElement("canvas");
        this.ctx    = this.canvas.getContext("2d");

        this.width = width;
        this.height = height;

        if (classname) {
            this.canvas.classList.add( classname );
        }
    }

    /** Clears the image on the canvas, leaving it blank.
     * @public
     */
    public clear ():void {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /** Releases the canvas, letting the GC collect it.
     * @public
     */
    public flush ():void {
        this.width  = 0;
        this.height = 0;
        this.ctx    = null;
        this.canvas = null;
    }

    /** Sets / Gets the HTML canvas element of this instance.
     * @public
     * @param { HTMLCanvasElement } canvas The canvas element.
     * @returns { HTMLCanvasElement } The canvas element.
     */
    public set canvas (canvas:HTMLCanvasElement) {
        this._canvas = canvas;

        if (canvas != null) {
            this._ctx = this._canvas.getContext("2d");
        }
    }
    public get canvas ():HTMLCanvasElement {
        return this._canvas;
    }

    /** Sets / Gets the HTML rendering context of this instance.
     * @public
     * @param { CanvasRenderingContext2D } ctx The rendering context.
     * @returns { CanvasRenderingContext2D } The rendering context.
     */
    public set ctx (ctx:CanvasRenderingContext2D) {
        this._ctx = ctx;
    }
    public get ctx ():CanvasRenderingContext2D {
        return this._ctx;
    }

    /** Sets / Gets the width of the canvas element of this instance.
     * @public
     * @param { number } width The HTML canvas element width.
     * @returns { number } The HTML canvas element width.
     */
    public set width (width:number) {
        this.canvas.width = width;
    }
    public get width ():number {
        return this.canvas.width;
    }

    /** Sets / Gets the height of the canvas element of this instance.
     * @public
     * @param { number } height The HTML canvas element height.
     * @returns { number } The HTML canvas element height.
     */
    public set height (height:number) {
        this.canvas.height = height;
    }
    public get height ():number {
        return this.canvas.height;
    }

}