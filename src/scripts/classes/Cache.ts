import { Canvas } from "./Canvas";



/** Cache class for handeling localStorage values used by the `Glitch` class. We try to rely on locally stored images as much as possible because creating them with html2canvas each time is very demanding.
 * @class
 */
export class Cache {

    /** The unique identifier by which this cache is identifieable by. It is also used as the key inside the local storage. */
    public id:string;
    /** The raw local storage data. */
    public data:string;
    /** The `Canvas` instance, which is filled with the data of the cache to rebuild the image. Used as the source material to copy from. */
    public canvas:Canvas;



    /** Creates a new `Cache` instance.
     * @constructor
     * @param { string } identifier The key inside localStorage used to set/get the value.
     */
    public constructor (identifier:string) {
        this.id = identifier;
        this.canvas = null;
        this.data = localStorage.getItem(identifier) || null;
    }

    /** Puts new content into the localStorage.
     * @public
     */
    public update (data:string):void {
        this.data = JSON.parse(JSON.stringify(data));

        if ( this.data == "" || this.data == "data:," || this.data == "data:") {
            this.data = null;
            localStorage.setItem(this.id, "");
        }

        else {
            localStorage.setItem(this.id, this.data.toString());
        }
    }

    /** Checks if the encoded string is actually valid for image creation.
     * @public
     * @returns { boolean } Can we create an image out of that information?
     */
    public hasValidCacheData ():boolean {
        return ( this.data == "data:," || this.data == "data:") ? false : true;
    }
}