import { IterateThroughNodelist, VIEW_SMARTPHONE, VIEW_TABLET, VIEW_DESKTOP, VIEW_TV } from "../namespaces/constants";
import { Resize } from "./../namespaces/events/resize";
import { Scroll } from "./../namespaces/events/scroll";
import content from "*.svg";

const TRESHOLD:number = Resize.REM(5);
const CONTENT:string = "content";
const COMMENTS:string = "comments";



/** Helps manage the posts on the blog by finding out if there are parts of a post that need to scroll along the users view. And if so, it does just that.
 * @class
 */
export class Post {
    /** The HTML LI Element, which is listed as a post. */
    private element:HTMLLIElement;
    /** The content column (left). */
    private content:HTMLElement;
    /** The comments column (right). */
    private comments:HTMLElement;
    /** The tags-wrapper. Needed for the calculation of the entire height. */
    private tags:HTMLElement;
    /** The meta-wrapper. Needed for the calculation of the entire height. */
    private meta:HTMLElement;
    /** The side that scrolls with the view. */
    private scrolling:string;
    /** The listing of all posts in the DOM. */
    private static list:HTMLUListElement;
    /** A list of all `Post` instances. */
    public static instances:Array<Post>;



    /** Creates a new `Post` instance.
     * @constructor
     * @param { HTMLLIElement } element The actual post on the blog.
     */
    public constructor (element:HTMLLIElement) {
        Post.list = Post.list || <HTMLUListElement>document.getElementById("posts");
        Post.instances = Post.instances || new Array();
        this.element = element;

        IterateThroughNodelist (
            element.firstElementChild.getElementsByClassName("box"),
            (element:HTMLElement) => { this.getChildren(element); }
        );

        Post.instances.push(this);
    }

    /** Called by the Node iterator, this method finds the correct HTMLElements for this `content` and `comments`.
     * @private
     * @param { HTMLElement } element The current HTML element that this method looks at.
     */
    private getChildren (element:HTMLElement):void {
        if ( element.classList.contains("box-content")) {
            this.content = <HTMLElement>element;
        }

        if ( element.classList.contains("box-tags")) {
            this.tags = <HTMLElement>element;
        }

        if ( element.classList.contains("box-meta")) {
            this.meta = <HTMLElement>element;
        }

        if ( element.classList.contains("box-comments")) {
            this.comments = <HTMLElement>element;
        }

    }

    /** The user scrolled, which means we need to decide if and in what way exactly this post needs to be manipulated.
     * @public
     * @param { number } scrolled The scrolled distance.
     * @param { number } view The viewport height.
     */
    public scrolled (scrolled:number, view:number):void {
        const side = this.scrolling;

        if (side) {
            const distanceIntoPost = Math.floor(scrolled - this.getPosition() + TRESHOLD);
            const distanceIntoPostMax = Math.floor( (this.getSize() - this.getSideSize(side) ) );

            // Check if we are inside the post.
            if ( distanceIntoPost >= 0 && distanceIntoPost < distanceIntoPostMax) {
                this.element.classList.remove(`_stop-${side}`);
                this.element.classList.add(`_scrolling-${side}`);
            }

            // Check if we are past the post.
            else if ( distanceIntoPost >= distanceIntoPostMax) {
                this.element.classList.remove(`_scrolling-${side}`);
                this.element.classList.add(`_stop-${side}`);
                this.element.style.setProperty("--post-scroll-margin", `${distanceIntoPostMax}px`);
            }

            // Check if we did not reach the post yet.
            else if (distanceIntoPost < 0) {
                this.element.classList.remove(`_stop-${side}`);
                this.element.classList.remove(`_scrolling-${side}`);
            }

        }

    }

    /** Returns the size of the whole post.
     * @private
     * @returns { number } The height.
     */
    private getSize ():number {
        return this.element.offsetHeight;
    }

    /** Returns the aboslut postiion of this post.
     * @private
     * @returns { number } The position.
     */
    private getPosition ():number {
        const body = document.body.getBoundingClientRect();
        const post = this.element.getBoundingClientRect();
        return post.top - body.top;
    }

    /** Returns the height of all elements of either side.
     * @private
     * @param { string } Side The side.
     * @returns { number } The height of the desired side.
     */
    private getSideSize (side:string):number {
        switch (side) {
            case CONTENT:
                return Math.floor(this.content.offsetHeight + this.tags.offsetHeight);
            case COMMENTS:
                return Math.floor( this.comments.offsetHeight + this.meta.offsetHeight );
            default:
                return null;
        };
    }

    /** Returns where the element is located on the Y-Axis of this page.
     * @private
     * @param { string } Side The side.
     * @return { number } The position.
     */
    private getSidePosition (side:string):number {
        const body = document.body.getBoundingClientRect();
        const content = this.content.getBoundingClientRect();
        const comments = this.comments.getBoundingClientRect();

        switch (side) {
            case CONTENT:
                return Math.floor( content.top - body.top );
            case COMMENTS:
                return Math.floor( comments.top - body.top );
            default:
                return null;
        };
    }

    /** Returns the element that will scroll.
     * @private
     * @param { string } Side The side.
     * @return { HTMLElement } The element.
     */
    private getWhichSideScrolling (side:string):HTMLElement {
        switch (side) {
            case CONTENT:
                return this.content;
            case COMMENTS:
                return this.meta;
            default:
                return null;
        };
    }

    /** Returns the element that is static. Reverse from `getScrolling`
     * @param { string } Side The side.
     * @return { HTMLElement } The element.
     */
    private getWhichSideStatic (side:string):HTMLElement {
        switch (side) {
            case CONTENT:
                return this.meta;
            case COMMENTS:
                return this.content;
            default:
                return null;
        };
    }

    /** Check the height of the content and comments and the height of the window, to decide what element needs to scroll.
     * @public
     * @param { number } scrolled The scrolled distance.
     * @param { number } height The viewport height.
     */
    public checkBounds (viewsize:number, height:number):void {
        this.element.classList.remove(`_stop-${CONTENT}`);
        this.element.classList.remove(`_scrolling-${CONTENT}`);
        this.element.classList.remove(`_stop-${COMMENTS}`);
        this.element.classList.remove(`_scrolling-${COMMENTS}`);

        if (viewsize == VIEW_SMARTPHONE) {
            this.scrolling = null;
            return;
        }

        if (this.element.offsetHeight > (height + TRESHOLD)) {

            if (this.getSideSize(CONTENT) > height && this.getSideSize(COMMENTS) > height) {
                this.scrolling = null;
            }

            else {

                if (this.getSideSize(COMMENTS) > (this.getSideSize(CONTENT) + TRESHOLD)) {
                    this.scrolling = CONTENT;
                    
                }

                else if (this.getSideSize(CONTENT) > (this.getSideSize(COMMENTS) + TRESHOLD) ) {
                    this.scrolling = COMMENTS;
                }

                else {
                    this.scrolling = null;
                }

            }

            this.scrolled(window.scrollY, window.innerHeight);
        }

        else {
            this.scrolling = null;
        }

    }

}