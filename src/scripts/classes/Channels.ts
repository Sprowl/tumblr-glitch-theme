import { Canvas } from "./Canvas";

type tChannels = Array<ImageData>;
type tCanvases = Array<Canvas>;



/** A supporting classed use by the `Glitch` class, which takes an image and splits it into its three main color channels (Red, Green, Blue).
 * @class
 */
export class Channels {
    /** The raw imagedata of an image. */
    private imagedata:ImageData;
    /** Buffer the size of the imagedata-length. */
    private buffer:ArrayBuffer;
    /** An array that holds the cahnnel data of all three color channels. */
    private channels:tChannels;
    /** An array of `Canvas` instances, that are simply the images if each seperated channel. */
    private canvases:tCanvases;
    /** The length of the imagedata. */
    private imglength:number;



    /** Creates a new `Channels` instance.
     * @constructor
     * @param { ImageData|Canvas } imagedatasource The image to split.
     */
    public constructor (imagedatasource:ImageData|Canvas) {
        let imagedata:ImageData;

        if (imagedatasource instanceof Canvas) {
            imagedata = imagedatasource.ctx.getImageData(0, 0, imagedatasource.width, imagedatasource.height);
        }

        else {
            imagedata = imagedatasource;
        }

        this.imagedata = imagedata;
        this.imglength = imagedata.data.length;
        this.buffer = new ArrayBuffer(this.imglength);
        this.channels = new Array(3);
            //protoype.slice(0) creates indiependent copies of the arrays.
            this.channels[0] = new ImageData (new Uint8ClampedArray(this.buffer.slice(0)), imagedatasource.width, imagedatasource.height); // red
            this.channels[1] = new ImageData (new Uint8ClampedArray(this.buffer.slice(0)), imagedatasource.width, imagedatasource.height); // green
            this.channels[2] = new ImageData (new Uint8ClampedArray(this.buffer.slice(0)), imagedatasource.width, imagedatasource.height); // blue
        this.canvases = new Array(3);
        this.buffer = null;
    }

    /** Prepares the splitting of the image in its three channels. Because that is a demanding task depending on the image size, this method is executed asynchronous.
     * @public
     * @returns { Promise<tChannels> } The list of all channels for debugging.
     */
    public split ():Promise<tChannels> {
        return new Promise<tChannels> ( resolve => {

            setTimeout(() => {
                this.doSplit();
                this.createCanvases();
                resolve(this.channels);
            }, 33);

        });
    }

    /** Splits the image in its three seperate channels.(Alpha is not needed as a seperate channel).
     * @private
     */
    private doSplit ():void {
        let i = 0;

        for (i; i < this.imglength; i += 4) {
            /** Red */
            this.channels[0].data[i + 0] = this.imagedata.data[i + 0];
            this.channels[0].data[i + 1] = 0;
            this.channels[0].data[i + 2] = 0;
            this.channels[0].data[i + 3] = this.imagedata.data[i + 3];

            /** Green */
            this.channels[1].data[i + 0] = 0;
            this.channels[1].data[i + 1] = this.imagedata.data[i + 1];
            this.channels[1].data[i + 2] = 0;
            this.channels[1].data[i + 3] = this.imagedata.data[i + 3];

            /** Blue */
            this.channels[2].data[i + 0] = 0;
            this.channels[2].data[i + 1] = 0;
            this.channels[2].data[i + 2] = this.imagedata.data[i + 2];
            this.channels[2].data[i + 3] = this.imagedata.data[i + 3];
        }

    }

    /** Creates an seperate Canvas of each channel.
     * @private
     */
    private createCanvases ():void {
        this.channels.forAll( (array:ImageData, channel:number) => {
            this.canvases[channel] = new Canvas (array.width, array.height);
            this.canvases[channel].ctx.putImageData(this.channels[channel], 0, 0);
        });
    }

    /** Sets / Gets the image data of the red channel.
     * @param { ImageData } red Red image data.
     * @returns { ImageData } Image data.
     */
    public set red (imagedata:ImageData) {}
    public get red ():ImageData {
        return this.channels[0];
    }

    /** Sets / Gets the image data of the green channel.
     * @param { ImageData } green Green image data.
     * @returns { ImageData } Image data.
     */
    public set green (imagedata:ImageData) {}
    public get green ():ImageData {
        return this.channels[1];
    }

    /** Sets / Gets the image data of the blue channel.
     * @param { ImageData } blue Blue image data.
     * @returns { ImageData } Image data.
     */
    public set blue (imagedata:ImageData) {}
    public get blue ():ImageData {
        return this.channels[2];
    }

    /** Gets the red `Canvas` instance. Cannot be overwritten.
     * @param { Canvas } canvas Cannot be overwritten.
     * @returns { Canvas } Red `Canvas`.
     */
    public set redCanvas (canvas:Canvas) {}
    public get redCanvas ():Canvas {
        return this.canvases[0];
    }

    /** Gets the green `Canvas` instance. Cannot be overwritten.
     * @param { Canvas } canvas Cannot be overwritten.
     * @returns { Canvas } Green `Canvas`.
     */
    public set greenCanvas (canvas:Canvas) {}
    public get greenCanvas ():Canvas {
        return this.canvases[1];
    }

    /** Gets the blue `Canvas` instance. Cannot be overwritten.
     * @param { Canvas } canvas Cannot be overwritten.
     * @returns { Canvas } Blue `Canvas`.
     */
    public set blueCanvas (canvas:Canvas) {}
    public get blueCanvas ():Canvas {
        return this.canvases[2];
    }

}