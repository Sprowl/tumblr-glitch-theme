export namespace Bootstrap {
    const inits:Array<Function> = new Array();
    const registers:Array<Function> = new Array();
    const various:Array<Function> = new Array();

    export function registerInit (callback:Function):void {
        inits.push(callback);
    }

    export function registerRegister (callback:Function):void {
        registers.push(callback);
    }

    export function registerVarious (callback:Function):void {
        various.push(callback);
    }

    export function start ():void {
        console.log("Bootstrap:Init");
        inits.forAll( init => {
            init();
        });

        console.log("Bootstrap:Register");
        registers.forAll( register => {
            register();
        });

        console.log("Bootstrap:Various");
        various.forAll( various => {
            various();
        });
    }
}