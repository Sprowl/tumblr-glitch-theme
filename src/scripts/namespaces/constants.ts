declare global {
    interface Window { onThemeReady:Function }
}

export const GLITCH_PADDING = 10;
export const GLITCH_FULLPADDING = GLITCH_PADDING * 2;
export const GLITCH_ACCELERATION_TIME = 0.5;
export const VIEW_SMARTPHONE = 1;
export const VIEW_TABLET = 2;
export const VIEW_DESKTOP = 4;
export const VIEW_TV = 8;

export const eventoptions = {
    once: false,
    passive: true
};
/** Adjusts the contrast level of an image.
 * @param {ImageData} imageData The image data.
 * @param {number} contrast The contrast level.
 * @returns {ImageData} The image.
 */
export const contrast = function (imageData:ImageData, contrast:number):ImageData {
    let data = imageData.data;
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for(let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;
        data[i+1] = factor * (data[i+1] - 128) + 128;
        data[i+2] = factor * (data[i+2] - 128) + 128;
    }

    return imageData;
}

/** Picks a random number between `min` and `max`. Either of them can be chosen too.
 * @param {number} min The minimal value.
 * @param {number} max The maximum value.
 * @returns {number} A number between `min` and `max`.
 */
export const random = function (min:number, max:number):number {
    return Math.floor( Math.random() * (max - min + 1) + min );
}

/** Removes unwanted values from an array.
 * @returns {array} The filtered array.
 * 
 */
Array.prototype.clean = function ():void {
    let i = 0

    for (i; i < this.length; i++) {

        if (this[i] == 0 || this[i] == null) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

/** Removes unwanted values from an array.
 * @returns {array} The filtered array.
 * 
 */
Array.prototype.forAll = function (callback:Function):void {
    let i = 0

    for (i; i < this.length; i++) {
        callback(this[i], i);
    }

    return this;
};

/** Applies a CSS variable to a specific element.
 * @public
 * @param { HTMLElement } element The HTML element that gets the variable.
 * @param { string } variable The name of the variable.
 * @param { string|number } value The value of the variable. Strings are directly set, but numbers will be set as pixels.
 */
export function setCSSVariable (element:HTMLElement, variable:string, value:string|number):void {

    if (typeof value === "number") {
        element.style.setProperty(variable, `${value}px`);
    }

    else {
        element.style.setProperty(variable, `${value}`);
    }
    
}

/** Returns the value of a global CSS variable
 * @public
 * @param { string } variable  The name of the variable. Must be set in body or higher in the DOM tree.
 */
export function getCSSVariable (variable:string):string {
    return getComputedStyle(document.body).getPropertyValue(variable);
}

/** Tweening library.
 * @see Code: http://www.gizma.com/easing/
 * @see Documentation: http://upshots.org/actionscript/jsas-understanding-easing
 * @param {number} t 0.5 (halfway through the tween, so 0.5 of 1 second)
 * @param {number} b 50 (the beginning value of the property being tweened)
 * @param {number} c 150 (the change in value – so the destination value of 200 minus the start value of 50 equals 150)
 * @param {number} d 1 (total duration of 1 second)
 */
export const Tween = {
    /** To not go over the designated goal of `b + c`, we stop the frame counter at a max setting. Normally that would not be needed, as an animation would be stopped when the tweening is done, but in this case where the glitch effect still continues on, it is very much needed. */
    maxTime (t:number, max:number):number {
        return (t <= max) ? t : max;
    },

    /** simple linear tweening - no easing, no acceleration */
    linearTween (t:number, b:number, c:number, d:number):number {
        return c*t/d + b;
    },

    /** quadratic easing in - accelerating from zero velocity */
    easeInQuad (t:number, b:number, c:number, d:number):number {
        t /= d;
        return c*t*t + b;
    },

    /** quadratic easing out - decelerating to zero velocity */
    easeOutQuad (t:number, b:number, c:number, d:number):number {
        t /= d;
        return -c * t*(t-2) + b;
    },

    /** quadratic easing in/out - acceleration until halfway, then deceleration */
    easeInOutQuad (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    },

    /** cubic easing in - accelerating from zero velocity */
    easeInCubic (t:number, b:number, c:number, d:number):number {
        t /= d;
        return c*t*t*t + b;
    },

    /** cubic easing out - decelerating to zero velocity */
    easeOutCubic (t:number, b:number, c:number, d:number):number {
        t /= d;
        t--;
        return c*(t*t*t + 1) + b;
    },

    /** cubic easing in/out - acceleration until halfway, then deceleration */
    easeInOutCubic (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t + 2) + b;
    },

    /** quartic easing in - accelerating from zero velocity */
    easeInQuart (t:number, b:number, c:number, d:number):number {
        t /= d;
        return c*t*t*t*t + b;
    },

    /** quartic easing out - decelerating to zero velocity */
    easeOutQuart (t:number, b:number, c:number, d:number):number {
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    },

    /** quartic easing in/out - acceleration until halfway, then deceleration */
    easeInOutQuart (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t + b;
        t -= 2;
        return -c/2 * (t*t*t*t - 2) + b;
    },

    /** quintic easing in - accelerating from zero velocity */
    easeInQuint (t:number, b:number, c:number, d:number):number {
        t /= d;
        return c*t*t*t*t*t + b;
    },

    /** quintic easing out - decelerating to zero velocity */
    easeOutQuint (t:number, b:number, c:number, d:number):number {
        t /= d;
        t--;
        return c*(t*t*t*t*t + 1) + b;
    },

    /** quintic easing in/out - acceleration until halfway, then deceleration */
    easeInOutQuint (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return c/2*t*t*t*t*t + b;
        t -= 2;
        return c/2*(t*t*t*t*t + 2) + b;
    },

    /** sinusoidal easing in - accelerating from zero velocity */
    easeInSine (t:number, b:number, c:number, d:number):number {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },

    /** sinusoidal easing out - decelerating to zero velocity */
    easeOutSine (t:number, b:number, c:number, d:number):number {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },

    /** sinusoidal easing in/out - accelerating until halfway, then decelerating */
    easeInOutSine (t:number, b:number, c:number, d:number):number {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },

    /** exponential easing in - accelerating from zero velocity */
    easeInExpo (t:number, b:number, c:number, d:number):number {
        return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
    },

    /** exponential easing out - decelerating to zero velocity */
    easeOutExpo (t:number, b:number, c:number, d:number):number {
        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
    },
        
    /** exponential easing in/out - accelerating until halfway, then decelerating */
    easeInOutExpo (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
        t--;
        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
    },

    /** circular easing in - accelerating from zero velocity */
    easeInCirc (t:number, b:number, c:number, d:number):number {
        t /= d;
        return -c * (Math.sqrt(1 - t*t) - 1) + b;
    },

    /** circular easing out - decelerating to zero velocity */
    easeOutCirc (t:number, b:number, c:number, d:number):number {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t*t) + b;
    },

    /** circular easing in/out - acceleration until halfway, then deceleration */
    easeInOutCirc (t:number, b:number, c:number, d:number):number {
        t /= d/2;
        if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        t -= 2;
        return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
    }
};

/** Checks if the user is using Internet Explorer to view the site or not. All return values above -1 are the version of IE.
 * @public
 * @returns { number } The Version of Internet Explorer. Otherwise `-1`
 */
export function usingIE ():number {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    return -1;
}

/** Goes through a list of things using a generator.
 * @public
 * @param { HTMLCollection|NodeList|Array<any> } collection The HTMLCollection, e.g. `document.getElementsByClassname`
 * @param { Function } callbackfn The function that is used on every element.
 */
export function CreateGenerator (collection:HTMLCollection|HTMLCollectionOf<any>|NodeList|Array<any>):IterableIterator<HTMLCollection|HTMLCollectionOf<any>|NodeList|Array<any>> {

    function* nextEntry ():IterableIterator<HTMLCollection|HTMLCollectionOf<any>|NodeList|Array<any>> {
        let index = 0;
        while (index < collection.length) {
            yield collection[index];
            index++;
        }
    }

    return nextEntry();
}

export function IterateThroughNodelist (collection:HTMLCollection|NodeList, callbackfn:Function):void {
    let i = 0;
    let length = collection.length;

    for (i; i < length; i++) {
        if (collection[i]) {
            callbackfn(collection[i]);
        }
    }
}

export function debugImage (image:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap):void {
    const c = <HTMLCanvasElement>document.getElementById("dsc");
    const x = c.getContext("2d");

    x.drawImage(image, random(0, c.width - image.width), random(0, c.height - image.height));
}
export function debugImageData (imagedata:ImageData):void {
    let i = 0;
    let length = imagedata.data.length;
    const outputRed:Array<number> = [];
    const outputGreen:Array<number> = [];
    const outputBlue:Array<number> = [];


    for (i; i < length; i += 4) {
        if (imagedata.data[i + 0] != 0) { outputRed.push(imagedata.data[i + 0])}
        if (imagedata.data[i + 1] != 0) { outputGreen.push(imagedata.data[i + 1])}
        if (imagedata.data[i + 2] != 0) { outputBlue.push(imagedata.data[i + 2])}
    }

    console.log("New Debug Image Data");
    console.log(outputRed);
    console.log(outputGreen);
    console.log(outputBlue);
    console.log(null);
}
