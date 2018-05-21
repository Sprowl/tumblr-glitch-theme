import * as html2canvas from "html2canvas";

import { random } from "./constants";
import { Canvas as cCanvas } from "./../classes/Canvas";
import { Cache as cCache } from "./../classes/Cache";


export namespace Render {
    const caches = new Array ();
    const cacheQueue = 0;
    const options = {
        allowTaint: true,
        async: true,
        backgroundColor: "transparent",
        // canvas: <HTMLCanvasElement>null,
        debug: false,
        //foreignObjectRendering: true,
        logging: false,
        removeContainer: true,
        scale: 1.0
    };

    /** Builds an image parralel to the main process and returns am Promise with that HTML canvas element.
     * 
     * Depending on what element is given, either uses the cache to create an image or the `html2canvas` module to build one from scratch and eventually save it in the cache.
     * @public
     * @async
     * @param { HTMLElement } element THe HTML element that an image is required of.
     * @param { HTMLCanvasElement } target The target canvas to paint on.
     * @returns { Promise<HTMLCanvasElement> } The Promise of the HTML canvas element.
     */
    export async function getImage (element:HTMLElement):Promise<HTMLCanvasElement> {
        const identifier = element.getAttribute("data-glitch-cache-group") || false;

        // Decide if the element even wants to be cached.
        if (identifier) {
            const prepared = findCache(identifier);

            if (prepared) {
                return getCanvasFromCache(prepared);
            }

            else {
                const cache = new cCache(identifier);
                caches.push(cache);

                return getCanvasFromCache(cache, element);
            }
            
        }

        // Elements without cached are being created live.
        else {
            return createHTML2CanvasImage(element);
        }
    }

    /** Tries to find and return a `Cache` instance in the list of caches that is available.
     * @private
     * @param { string } identifier The name of the cache-group.
     * @returns { Cache | boolean } Either the `Cache` if it could be found, or `false` if not.
     */
    function findCache (identifier:string):cCache {
        return caches.find( (cache:cCache) => cache.id === identifier ) || false;
    }

    /** Uses the html2canvas module to make images out of HTML elements.
     * @public
     * @param { HTMLElement } element The HTML element to make an image of.
     * @returns { Html2CanvasPromise<HTMLCanvasElement> } The Promise that is created by html2canvas, which resolves into an HTML canvas element.
     */
    function createHTML2CanvasImage (element:HTMLElement):Html2CanvasPromise<HTMLCanvasElement> {
        return html2canvas(element, options);
    }

    /** Tries to retrieve the canvas from the cache by either simply building it by the data the cache already offers, or by first creating the image with `html2canvas`, turning that imagedata into a string, and then storing that string in the cache.
     * @private
     * @async
     * @param { Cache } cache The `Cache` instance.
     * @param { HTMLElement } element (optional) Using `html2canvas`, builds an image with this parameter.
     * @returns { Promise<HTMLCanvasElement> } The Promise, which resolves into an HTML canvas element.
     */
    async function getCanvasFromCache (cache:cCache, element?:HTMLElement):Promise<HTMLCanvasElement> {

        if (!cache.canvas) {

            if (cache.data) {

                // Try to make an image out of the cache data.
                try {
                    const image = await createImageFromCacheData(cache);
                    cache.canvas = new cCanvas(image.width, image.height);
                    cache.canvas.ctx.drawImage(image, 0, 0);

                    return new Promise<HTMLCanvasElement> (resolve => resolve(cache.canvas.canvas) );
                }

                //Create a new image from scratch if the data is not valid.
                catch (error) {
                    return createHTML2CanvasImageAndSave(cache, element);
                }
            }

            else {
                return createHTML2CanvasImageAndSave(cache, element);
            }
        }

        else {
            return new Promise<HTMLCanvasElement> (resolve => {
                const clone = new cCanvas(cache.canvas.width, cache.canvas.height);
                clone.ctx.drawImage(cache.canvas.canvas, 0, 0);

                resolve(clone.canvas);
            });
        }
    }

    /** Builds an image from scratch, and afterwards sets up the cache to save the image data in it.
     * @private
     * @async
     * @param { Cache } cache The `Cache` instance.
     * @param { HTMLElement } element (optional) Using `html2canvas`, builds an image with this parameter.
     * @returns { Promise<HTMLCanvasElement> } The Promise, which resolves into an HTML canvas element.
     */
    async function createHTML2CanvasImageAndSave (cache:cCache, element?:HTMLElement):Promise<HTMLCanvasElement> {
        const canvas = await createHTML2CanvasImage(element);
        cache.update(canvas.toDataURL("image/png"));

        cache.canvas = new cCanvas(canvas.width, canvas.height);
        cache.canvas.ctx.drawImage(canvas, 0, 0);

        return new Promise<HTMLCanvasElement> ( resolve => resolve(canvas) );
    }

    /** Builds an image by using the cache. The image itself must be drawn onto a canvas afterwards.
     * @private
     * @async
     * @param { Cache } cache The `Cache` instance.
     * @returns { Promise<HTMLImageElement> } The Promise, which resolves into an HTML image element.
     */
    async function createImageFromCacheData (cache:cCache):Promise<HTMLImageElement> {

        return new Promise<HTMLImageElement> ( (resolve, reject) => {
            const image = new Image();

            image.onload = (event) => {
                return resolve(image);
            };
            image.onerror = event => reject(event);

            if (cache.hasValidCacheData() ) {
                image.src = cache.data;
            }
            else {
                reject("No valid cache data.");
            }
        });

    }

}
