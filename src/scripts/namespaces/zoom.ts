import { Bootstrap } from "./bootstrap";

import { IterateThroughNodelist, eventoptions } from "./constants";
import { Resize } from "./events/resize";


/** Responsible for the clicking and zooming on images inside the reply-section to the right.
 * @namespace
 */
export namespace Zoom {
    let images:NodeListOf<HTMLElement>|NodeList;

    /** Enables the clicking of images in the comment-section to view them in their original size.
     * @class
     */
    class Toggle {
        public original:HTMLImageElement;
        public copy:HTMLImageElement;

        public static instances:Array<Toggle>;

        /** Creates a new `Toggle` instance.
         * @constructor
         * @param { HTMLImageElement } original The image that is displayed on the site.
         */
        public constructor (original:HTMLImageElement) {
            Toggle.instances = Toggle.instances || [];
            Toggle.instances.push(this);

            this.original = original;
            this.copy = null;

            this.original.classList.add("_zoom-original");
            this.original.addEventListener("click", (event:Event) => { this.activate() }, eventoptions);
        }

        /** Activates the copy.
         * @private
         */
        private activate ():void {
            Toggle.deactivateAll();

            if (!!this.copy === false) {
                this.build();
            }

            this.copy.classList.add("_active");
        }

        /** Deactivates the copy.
         * @private
         */
        private deactivate ():void {
            if (!!this.copy !== false) {
                this.copy.classList.remove("_active");
            }
        }

        /** Sets up a copy of the original image which overlays the original image. This is the one that is displayed at full size.
         * @private
         */
        private build ():void {
            const copy = document.createElement("img");
            copy.src         = this.original.src;
            copy.style.top   = `${this.original.offsetTop}px`;
            copy.style.right = "0px";
            copy.classList.add("_zoom-copy");

            this.copy = copy;
            this.copy.addEventListener("click", (event:Event) => { this.deactivate() }, eventoptions);
            this.original.parentElement.appendChild(copy);
        }

        /** Hides all copied images.
         * @private
         * @static
         */
        private static deactivateAll ():void {
            Toggle.instances.forAll( toggle => {
                toggle.deactivate();
            });
        }

    }



/////////////////////////////
/// Bootstrapping.
/////////////////////////////
    /** Executing method for this namespace.
     * @private
     */
    function init ():void {
        images = document.querySelectorAll(".box-comments .text img") || new NodeList();
    }

    /** Adds methods to event listeners.
     * @private
     */
    function register ():void {}

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {
        IterateThroughNodelist(images, (image:HTMLImageElement) => {

            if ( image.offsetWidth < image.naturalWidth ) {
                new Toggle(image);
            }

        });

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
