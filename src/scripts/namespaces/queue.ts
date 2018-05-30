import { IterateThroughNodelist, usingIE } from "./constants";

import { Canvas as cCanvas } from "./../classes/Canvas";
import { Glitch } from "./classes/Glitch";
import { Render } from "./render";

type tQueueQueue = {
    nocache:Array<HTMLElement>;
    cache: {
        [key:string]:Array<HTMLElement>;
    }
}



export namespace Queue {
    const queue:tQueueQueue = {
        nocache: [],
        cache: {}
    };

    /** Feeds the queue namespace by providing a list of all glitch elements.
     * @public
     * @param { HTMLCollectionOf<Element> } list The list of all `.glitchy` elements.
     */
    export function feed (list:HTMLCollectionOf<Element>):void {

        if (usingIE() == -1) {
            IterateThroughNodelist(
                list,
                (element:HTMLElement) => { sort(element); }
            );

            workOne("nocache")
                .then ( canvas => {
                    // Uncached Elements done.
                })
                
                .catch ( error => {
                    console.error("[Queue][NoCache]: ", error);
                });

            work();
        }
    }

    /** Sorts the element into the right list inside the queue.
     * @private
     * @param { HTMLElement } element The HTML element.
     */
    function sort (element:HTMLElement):void {
        const identifier = element.getAttribute("data-glitch-cache-group") || false;

        if (typeof identifier === "string") {
            queue.cache[identifier] = queue.cache[identifier] || [];
            queue.cache[identifier].push(element);
        }

        else {
            queue.nocache.push(element);
        }
    }

    /** Returns the next (first) element in the queue.
     * @private
     * @param identifier 
     */
    function next (identifier:string):HTMLElement {
        if (identifier == "nocache") {
            return queue.nocache.shift();
        }

        return queue.cache[identifier].shift();
    }

    /** Works through all caching queue lists, telling the first element in it to work on creating its image.
     * @private
     */
    function work ():void {
        const list = queue.cache;

        for (let key in list) {
            
            workOne(key)
                .then ( canvas => {
                    //Cached Elements done.
                })
                
                .catch ( error => {
                    console.error(`[Queue][${key}]: `, error);
                });
        }
    }

    /** Works an element to create an image, calling the next afterwards.
     * @private
     * @async
     * @param { string } identifier The name of the cache group.
     * @returns { Promise<Canvas> } A member of the `Canvas` class.
     */
    async function workOne (identifier:string):Promise<cCanvas> {

        return new Promise<cCanvas> ( resolve => {
            const element = next(identifier);
            let i = 0;

            if (element) {

                Render.getImage( element )
                    .then( canvas => {
                        const image = new cCanvas (canvas.width, canvas.height);
                        image.canvas = canvas;

                        Glitch.constructOne(element, image);

                        workOne(identifier);
                        resolve(image);
                    })

                    .catch ( (error) => {
                        console.error("[Render]: Error creating image", error)
                    });
            }

        });
    }

}