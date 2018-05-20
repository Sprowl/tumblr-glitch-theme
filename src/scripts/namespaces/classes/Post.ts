import { Bootstrap } from "./../bootstrap";

import { IterateThroughNodelist } from "./../constants";
import { Post as cPost } from "./../../classes/Post";
import { Resize } from "./../events/resize";
import { Scroll } from "./../events/scroll";



export namespace Post {

/////////////////////////////
/// Constructing.
/////////////////////////////
    /** Creates all Post-instances.
     * @public
     */
    function buildAll ():void {
        IterateThroughNodelist (
            document.getElementsByClassName("post"),
            buildOne
        );
    }

    /** Creates a new `Post` instance, if the li-HTMLElement that represents the `Post`, can be actually used for that.
     * @public
     * @param { HTMLLIElement } element The element that resembles a post. If it has replies it is valid to be used inside a Post instance.
     */
    function buildOne (element:HTMLLIElement):void {
        if (element.getAttribute("data-replies-beat") != "" && !(element.classList.contains("post-type-text") && element.getAttribute("data-replies-beat") == "1,")) {
            new cPost (element);
        }
    }



/////////////////////////////
/// Regular methods.
/////////////////////////////
    /** Alerts all instances that the user scrolled.
     * @public
     */
    function scrolled ():void {
        if (cPost.instances) {
            cPost.instances.forAll( post => {
                post.scrolled(window.scrollY, window.innerHeight);
            });
        }
    }

    let savedBodyHeight:number;
    let savedWindowHeight:number;
    /** Checks the elements of all instances to see if any changes regarding the sizes have occured. This can happen sometimes with images that take too long to load.
     * @public
     */
    function checkDOM ():void {
        if (savedBodyHeight != document.body.offsetHeight || savedWindowHeight != window.innerHeight) {
            savedBodyHeight = document.body.offsetHeight;
            savedWindowHeight = window.innerHeight;

            if (cPost.instances) {

                cPost.instances.forAll( post => {
                    post.checkBounds(Resize.viewsize.current, window.innerHeight);
                });
            }
        }
    }



/////////////////////////////
/// Bootstrapping.
/////////////////////////////
    /** Executing method for this namespace.
     * @private
     */
    function init ():void {
        cPost.instances = cPost.instances || [];
    }

    /** Adds methods to event listeners.
     * @private
     */
    function register ():void {
        Resize.registerForAlert( checkDOM );
        Scroll.registerForAlert( scrolled );
    }

    /** Executes different kinds of methods.
     * @private
     */
    function various ():void {
        buildAll();

        // Because tumblr is very slow regarding image loading, we need to constantly check which posts grew over time because of their content.
        setInterval(checkDOM, 1000);
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