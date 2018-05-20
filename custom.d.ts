declare module "*.svg" {
    const content:any;
    export default content;
}

interface Array<T> {
    clean():T;
    forAll(callbackfn: (value:T, index:number) => void):void;
}
