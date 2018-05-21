import { GLITCH_PADDING, GLITCH_FULLPADDING, GLITCH_ACCELERATION_TIME, random, Tween, VIEW_SMARTPHONE, VIEW_TABLET, VIEW_DESKTOP, VIEW_TV }from "../namespaces/constants";
import { Resize } from "./../namespaces/events/resize";
import { Render } from "./../namespaces/render";
import { Animator } from "./Animator";
import { Canvas } from "./Canvas";
import { Channels } from "./Channels";
import { Events, EVENT_HOVER_START, EVENT_HOVER_END, EVENT_CLICK } from "./Events";



/** Glitch class to create the special visual effect on some elements. Can be used an basically any element, as long as it is not too complex.
 * @class
 */
export class Glitch {
    /** Wether this instance is ready to function normally yet or not. */
    private ready:boolean;
    /** The HTML element that contains the `glitchy` css-class. */
    private element:HTMLElement;
    /** The Canvas element displayed above the HTML element. */
    private display:Canvas;
    /** The pre-built image of the HTML element. Made by the html2canvas function. */
    private memory:Canvas;
    /** The temporary memory between the display and the prebuilt image of the HTML element. */
    private boiler:Canvas;
    /** The seperated channels of the memory. */
    private channels:Channels;
    /** Helper class to simplify the Mouse- and Touch-events. */
    private events:Events;
    /** A list of chunks. */
    private chunks:Array<number>;
    /** The timeout, that would tell the animation to stop completely. */
    private stopdelay:number;
    /** If the animation is told to fade out, we use the latest 'regular' framenumber to count down. */
    private maxframe:number;
    /** Does the animation play out with full force? */
    private reachedMaxVelocity:boolean;
    /** List of view states this glitch effect will deactivate on. */
    private deactivateOn:Array<number>;
    /** Wheter this Glitch effect is allowed to run or not. Used for the avatar image, which is disabled on mobile devices. */
    private isDeactivated:boolean;
    /** If the glitch element also has the class `glitch-auto` applied to it, the glitch effect will autoplay and stop when interacted with. */
    private isAuto:boolean;
    /** Wether the animation should start or fade out. */
    private isStopping:boolean;
    /** Wether the animation has stopped and no new frames should be drawn. */
    private hasStopped:boolean;
    /** Can be set with the `glitch-once` class. Will play the animation until the image completely glitched out, and then stops suddenly. Interacting with the element again will fade the animation out. */
    private freeze:boolean;
    /** List of all `Glitch` instances created. */
    public static instances:Array<Glitch>;



    /** Creates a new `Glitch` instance.
     * @constructor
     * @param { HTMLElement } element The HTML element, that acts as a wrapper for the soon-to-be canvas ans holder of all event listeners.
     * @param { Canvas } image An instance of the `Canvas` class, that will be used as the base image for the animation.
     */
    public constructor (element:HTMLElement, image:Canvas) {
        Glitch.instances = Glitch.instances || [];
        Glitch.instances.push(this);

        this.deactivateOn = [];
        this.ready = false;
        this.isDeactivated = false;
        this.reachedMaxVelocity = false;
        this.isStopping = true;
        this.hasStopped = true;
        this.isAuto = (element.classList.contains("glitch-auto")) ? true : false;
        this.freeze = (element.classList.contains("glitch-freeze")) ? true : false;
        this.element = element;
        this.display = new Canvas(element.offsetWidth + GLITCH_FULLPADDING, element.offsetHeight + GLITCH_FULLPADDING, "_display");
        this.memory  = image;

        if (element.classList.contains("glitch-disable-smartphone")) { this.deactivateOn.push(VIEW_SMARTPHONE); }
        if (element.classList.contains("glitch-disable-laptop")) { this.deactivateOn.push(VIEW_TABLET); }
        if (element.classList.contains("glitch-disable-desktop")) { this.deactivateOn.push(VIEW_DESKTOP); }
        if (element.classList.contains("glitch-disable-tv")) { this.deactivateOn.push(VIEW_TV); }

        this.build(image);
    }

    /** Build the base image using the html2canvas module, and seperates the channels of that base image.
     * @private
     */
    public build (image:Canvas):void {
        const children = this.element.children;

        for (let i = 0; i < children.length; i++) {
            children[i].classList.add("_subglitch");
        }

        if (image instanceof Canvas) {
            this.splitChannels();
        }

        else {
            console.error("[Glitch]: Image feeded not instance of class `Canvas`. Can not create Glitch effect.")
        }
    }


    /** Splits the created / recieved image into its seperated channels.
     * @private
     */
    private splitChannels ():void {
        this.channels = new Channels(this.memory);

        this.channels.split()
            .then( debug => {
                this.element.appendChild(this.display.canvas);
                this.ready = true;

                this.applyEvents();
                this.startEvents();
            })

            .catch( (error:Error) => {
                console.error("Error creating RGB channels.", error)
            });
    }

    /** Sets up the event listeners.
     * @private
     */
    private applyEvents ():void {

        if (this.isAuto) {
            this.events = new Events (this.element,
                {
                    start: {
                        event: EVENT_HOVER_START,
                        callback: (event:MouseEvent|TouchEvent) => { this.callEnd(event) }
                    },
                    stop: {
                        event: EVENT_HOVER_END,
                        callback: (event:MouseEvent|TouchEvent) => { this.start(event) }
                    }
                }
            );
        }

        else if (this.freeze) {
            this.events = new Events (this.element,
                {
                    start: {
                        event: EVENT_CLICK,
                        callback: (event:MouseEvent|TouchEvent) => { this.start(event) }
                    },
                    stop: {
                        event: EVENT_CLICK,
                        callback: (event:MouseEvent|TouchEvent) => { this.callEnd(event) }
                    }
                }
            );
        }

        else {
            this.events = new Events (this.element,
                {
                    start: {
                        event: EVENT_HOVER_START,
                        callback: (event:MouseEvent|TouchEvent) => { this.start(event) }
                    },
                    stop: {
                        event: EVENT_HOVER_END,
                        callback: (event:MouseEvent|TouchEvent) => { this.callEnd(event) }
                    }
                }
            );
        }
    }

    /** Starts events automatically if `auto` is set to `true`.
     * @private
     */
    private startEvents ():void {
        if (this.isAuto) {
            this.start(null);
        }
    }

    /**
     * @private
     * @param { number } length The entire range that needs to be chopped up.
     * @param { number } divisor (default: 4) The mathematical size minimum of each chunk. Example: length / divisor = probable number of chunks.
     * @returns { Array<number> } An array of numbers with absolute numbers to splice the image with later.
     */
    private getChunks (length:number, divisor:number = 4):Array<number> {
        const splits = Math.floor(length / divisor);
        const chunks = [];
        let i;

        for (i = 0; i < splits; i++) {
            let currentmin = random(0, length);
            chunks.push(currentmin);
        }

        chunks.sort( (a:number, b:number) => {
            return a - b;
        });

        for (i = 0; i <= chunks.length; i++) {

            while ( typeof chunks[i] == "number" && typeof chunks[i + 1] == "number" && chunks[i] == chunks[i + 1] ) {
                chunks.splice(i, 1);
            }

            if (chunks[i] == length || chunks[i] == 0) {
                chunks.splice(i, 1);
            }
        }

        return chunks;
    }

    /**  Uses the chunks of the divided image and moves them around.
     * @private
     * @param { number } frame The current frame.
     * @returns { boolean } Wether a next frame is required or not.
     */
     private frame (frame:number):boolean {
    
        if (frame % 5 === 0 && this.boiler != null) {
            let calculatedFrame = frame;

            this.reachedMaxVelocity = (Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1) >= 1) ? true : false;

            if ( this.isStopping || !(this.freeze && this.reachedMaxVelocity) ) {
                this.display.clear();
                this.boiler.clear();
                this.boiler.ctx.save();
                this.boiler.ctx.translate(GLITCH_PADDING, GLITCH_PADDING);
            }

            if (this.isStopping) {

                if (this.maxframe == null) {
                    this.maxframe = frame;
                }

                calculatedFrame = (this.maxframe < (GLITCH_ACCELERATION_TIME * 100)) ? this.maxframe - (frame - this.maxframe) : (GLITCH_ACCELERATION_TIME * 100) - (frame - this.maxframe); //50: 100 / 0.02
                this.stopdelay = calculatedFrame;
            }

            if ( !this.freeze || (this.freeze && this.isStopping) || (this.freeze && !this.reachedMaxVelocity) ) {
                this.colorShift(calculatedFrame);
                this.moveX(calculatedFrame);
                this.moveY(calculatedFrame);
            }

            if ( this.isStopping || !(this.freeze && this.reachedMaxVelocity) ) {
                this.boiler.ctx.restore();
            }

            if (this.stopdelay == 0) {
                this.stop();
            }

        }

        return !this.hasStopped;
    }

    /** Moves chunks around along the X axis.
     * @private
     * @param { number } frame The frame number.
     */
    private moveX (frame:number):void {
        let start:number;
        let end:number;
        let i = 0;

        // Moves chunks around along the X-Axis.
        for (i = 0; i <= this.chunks.length; i++) {
            start = Math.abs(this.chunks[i - 1] || 0);
            end = Math.abs(this.chunks[i] || this.memory.height);
            const diff = ( end - start < 1) ? 1 : end - start;
            const rand = random(-GLITCH_PADDING, GLITCH_PADDING) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1);
            const fixed = Math.floor(rand * 100) / 100;

            this.boiler.ctx.drawImage(this.memory.canvas,
                0, //start at
                start,
                ( (this.memory.width < 1) ? 1 : this.memory.width), //expand area for
                diff,
                
                ( (fixed < 0) ? 0 : fixed), //place area at
                start,
                ( (this.memory.width < 1) ? 1 : this.memory.width), //expand area for
                diff
            );
        }
    }

    /** Moves chunks around along the Y axis.
     * @private
     * @param { number } frame The frame number.
     */
    private moveY (frame:number):void {
        const chunks = this.getChunks(this.width, 15);
        let start:number;
        let end:number;
        let i = 0;

        // Moves chunks around along the Y-Axis.
        for (i = 0; i <= chunks.length; i++) {
            start = Math.abs(chunks[i - 1] || 0);
            end = Math.abs(chunks[i] || this.width);
            const diff = ( end - start < 1) ? 1 : end - start;
            const rand = random(-GLITCH_PADDING / 2, GLITCH_PADDING / 2) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1);
            const fixed = Math.floor(rand * 100) / 100;

            this.display.ctx.drawImage(this.boiler.canvas,
                start,
                0,
                diff,
                ( (this.height < 1) ? 1 : this.height),
                
                start,
                ( (fixed < 0) ? 0 : fixed), //0.02
                diff,
                ( (this.height < 1) ? 1 : this.height)
            );

        }
    }

    /** Moves the seperated RGB channels around.
     * @private
     * @param { number } frame The frame number.
     */
    private colorShift (frame:number):void {
        this.memory.clear();

        this.memory.ctx.globalCompositeOperation = "source-over";
        this.memory.ctx.drawImage(this.channels.redCanvas.canvas,
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1), //start at
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1) //start at,
        );

        this.memory.ctx.globalCompositeOperation = "screen";

        this.memory.ctx.drawImage(this.channels.greenCanvas.canvas,
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1), //start at
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1) //start at,
        );

        this.memory.ctx.drawImage(this.channels.blueCanvas.canvas,
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1), //start at
            random(-6, 6) * Tween.easeInQuad(Tween.maxTime(frame * (0.01 / GLITCH_ACCELERATION_TIME), 1), 0, 1, 1) //start at,
        );

        // const displaydata = this.memory.ctx.getImageData(0, 0, this.memory.width, this.memory.height);
        // this.memory.ctx.putImageData(contrast(displaydata, 33), 0, 0);
    }

    /** Animation begin.
     * @private
     * @param { MouseEvent|TouchEvent } event The event that triggered this method.
     */
    private start (event:MouseEvent|TouchEvent):void {
        this.isStopping = false;

        if (this.stopdelay == null && this.isDeactivated == false) {

            if (this.hasStopped) {
                this.hasStopped = false;

                this.chunks = this.getChunks(this.memory.height);
                this.boiler = new Canvas(this.width, this.height);
                this.boiler.ctx.globalCompositeOperation = "source-over";

                this.addClasses();

                new Animator(
                    (frame:number) => this.frame(frame)
                );
            }
        }

        else {
            this.maxframe = null;
            this.stopdelay = null;
        }
    }

    /** Signals the animation to end. The animation itself will become more stable over time, until no new frames are rendered ultimately.
     * @private
     * @param { MouseEvent|TouchEvent } event The event that triggered this method.
     */
    private callEnd (event:MouseEvent|TouchEvent):void {
        this.isStopping = true;
    }

    /** The animation stopped completely.
     * @private
     */
    private stop ():void {
        this.stopdelay = null;
        this.maxframe = null;
        this.isStopping = false;
        this.hasStopped = true;

        // this.display.clear();
        this.removeClasses();
        
        if (this.boiler) {
            this.boiler.flush();
            this.boiler = null;
        }
    }

    /** Fired whenever the window is rezised.
     * @public
     * @param { number } viewsize The view size.
     */
    public onResize (viewsize:number):void {
        if (this.deactivateOn.length > 0 && this.ready) {
            const deactivate = this.deactivateOn.find( condition => condition == viewsize) || false;

            if (deactivate) {
                this.isDeactivated = true;
                this.callEnd(null);
            }

            else {
                this.isDeactivated = false;
                this.startEvents();
            }
        }

    }

    private addClasses ():void {
        this.element.classList.add("_active");
    }

    private removeClasses():void {
        this.element.classList.remove("_active");
    }



    public get width ():number {
        return this.display.width;
    }

    public get height ():number {
        return this.display.height;
    }

}