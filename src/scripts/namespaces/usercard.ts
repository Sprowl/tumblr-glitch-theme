import { Bootstrap } from "./bootstrap";
import * as colorcolor from "colorcolor";

import { Canvas } from "./../classes/Canvas";
import { Glitch } from "./classes/Glitch";
import { GLITCH_PADDING, GLITCH_FULLPADDING, eventoptions, Tween, getCSSVariable, setCSSVariable, usingIE } from "./constants";
import { Resize } from "./events/resize";
import { Scroll } from "./events/scroll";



export namespace Usercard {
    /////////////////////////////
    /// Style Classes.
    /////////////////////////////
    class StyleColorVariable {
        private _variable:string;
        private _color:string;
        private _array:RegExpMatchArray;

        private static search = new RegExp(/[.?\d]+/g);

        /** Takes the name of a css variable to get its color information.
         * @constructor
         * @param { string } variable The css variable name.
         */
        public constructor (variable:string) {
            this.variable = variable;
        }

        /** Gets / Sets the name of the CSS variable. */
        public get variable ():string {
            return this._variable;
        }
        public set variable (variable:string) {
            this._variable = variable;
        }

        /** Gets / Sets the value of the css variable. */
        public get color ():string {
            if (this._color) {
                return this._color;
            }

            const raw = getCSSVariable(this.variable);
            this._color = colorcolor(raw.trim(), "rgba");
            return this._color;
        }
        public set color (color:string) {
            this._color = color;
        }

        /** Gets / Sets the interpreted values of each channel of the color. */
        public get array ():RegExpMatchArray {
            if (this._array) {
                return this._array;
            }

            this._array = this.color.match(StyleColorVariable.search) || "rgba(0, 0, 0, 0.0)".match(StyleColorVariable.search);
            return this._array;
        }
        public set array (array:RegExpMatchArray) {
            if (!this._array) {
                this._array = array;
            }
        }

        /** Gets the red channel value. */
        public get red ():number {
            return Number(this.array[0]);
        }

        /** Gets the green channel value. */
        public get green ():number {
            return Number(this.array[1]);
        }

        /** Gets the blue channel value. */
        public get blue ():number {
            return Number(this.array[2]);
        }

        /** Gets the alpha channel value. */
        public get alpha ():number {
            return parseFloat(this.array[3]);
        }
    }

    class StyleColorScrolling {

        public top:StyleColorVariable;
        public bottom:StyleColorVariable;

        /** Creates a new instance.
         * @constructor
         */
        public constructor () { }

        /** Accepts the names of two css variables, which will be used to create two instances of the class `StyleColorVariable`. With that, adn the help of the Tweening library, we can easily find out what the color is between the two at any point.
         * @constructor
         * @param { string } top The name of the CSS variable, which holds color information.
         * @param { string } bottom The name of the CSS variable, which holds color information.
         */
        public build (top:string, bottom:string):void {
            this.top = new StyleColorVariable(top);
            this.bottom = new StyleColorVariable(bottom);
        }

        /**
         * 
         * @param { number } top The value of the top color
         * @param { number } bottom The value of the bottom color.
         * @returns { number } The value between both positions.
         */
        private getPosition (top:number, bottom:number):number {
            return Tween.linearTween(Scroll.percentage, top, (bottom - top), 100);
        }

        /** Calculates and returns the value of the red channel.
         * @returns { number } The value of the position of the red channel between top and bottom.
         */
        public getPositionRed ():number {
            return Math.floor( this.getPosition(this.top.red, this.bottom.red) );
        }

        /** Calculates and returns the value of the green channel.
         * @returns { number } The value of the position of the green channel between top and bottom.
         */
        public getPositionGreen ():number {
            return Math.floor( this.getPosition(this.top.green, this.bottom.green) );
        }

        /** Calculates and returns the value of the blue channel.
         * @returns { number } The value of the position of the blue channel between top and bottom.
         */
        public getPositionBlue ():number {
            return Math.floor( this.getPosition(this.top.blue, this.bottom.blue) );
        }

        /** Calculates and returns the value of the alpha channel.
         * @returns { number } The value of the position of the alpha channel between top and bottom.
         */
        public getPositionAlpha ():number {
            return this.getPosition(this.top.alpha, this.bottom.alpha);
        }
    }



/////////////////////////////
/// Avatar Loading.
/////////////////////////////
    function avatarReady (src:string) {
        const size = 192;
        const image = new Image();
        const canvas = new Canvas(size, size);
        const avatar = document.getElementById("avatar-container");

        image.onload = (event:Event) => {
            canvas.width = size;
            canvas.height = size;
    
            canvas.ctx.globalCompositeOperation = "source-over";
            canvas.ctx.beginPath();
            canvas.ctx.arc(
                (size / 2),
                (size / 2),
                (size / 2),
                0,
                Math.PI * 2
            );
            canvas.ctx.closePath();
            canvas.ctx.fill();
    
            canvas.ctx.globalCompositeOperation = "source-atop";
            canvas.ctx.drawImage(image, 1.75, 1.75, size - 3.5, size - 3.5);

            canvas.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            canvas.ctx.lineWidth = 3;
            canvas.ctx.beginPath();
            canvas.ctx.arc(
                (size / 2),
                (size / 2),
                (size / 2) - 1,
                0,
                Math.PI * 2
            );
            canvas.ctx.closePath();
            canvas.ctx.stroke();

            if (avatar) {
                avatar.classList.add("glitchy");
                Glitch.constructOne(avatar, canvas);
            }
        };

        image.crossOrigin = "Anonymous";
        image.src = src;
    }



/////////////////////////////
/// Scroll Methods.
/////////////////////////////
    const glowBorder = new StyleColorScrolling ();
    const glowLightStart = new StyleColorScrolling ();
    const glowLightEnd = new StyleColorScrolling ();

    /** Fired whenever the event listener has noticed the last change 250ms ago.
     * @private
     */
    function onDeviceScrollSet ():void {
        setCSSVariable(document.body, glowBorder.top.variable, `rgba(${glowBorder.getPositionRed()}, ${glowBorder.getPositionGreen()}, ${glowBorder.getPositionBlue()}, 0.8)`);
        setCSSVariable(document.body, glowLightStart.top.variable, `rgba(${glowLightStart.getPositionRed()}, ${glowLightStart.getPositionGreen()}, ${glowLightStart.getPositionBlue()}, 1.0)`);
        setCSSVariable(document.body, glowLightEnd.top.variable, `rgba(${glowLightEnd.getPositionRed()}, ${glowLightEnd.getPositionGreen()}, ${glowLightEnd.getPositionBlue()}, 0.0)`);
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
        Resize.registerForAlert( () => { onDeviceScrollSet() } );
        Scroll.registerForAlert( () => { onDeviceScrollSet() } );
    }

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {
        const image = <HTMLImageElement>document.getElementById("avatar-img");

        glowBorder.build("--color-glow-border-top", "--color-glow-border-bottom");
        glowLightStart.build("--color-glow-light-top-start", "--color-glow-light-bottom-start");
        glowLightEnd.build("--color-glow-light-top-end", "--color-glow-light-bottom-end");

        if (image && usingIE() == -1) {

            if (image.complete) {
                avatarReady(image.src);
            }
        
            else {
                image.onload = (event:Event) => { avatarReady(image.src) };
            }

        }

        onDeviceScrollSet();
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
