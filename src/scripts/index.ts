import { Bootstrap } from "./namespaces/bootstrap";

import { CreateGenerator, IterateThroughNodelist, usingIE, eventoptions } from "./namespaces/constants"
import { Resize } from "./namespaces/events/resize";
import { Scroll } from "./namespaces/events/scroll";
import { Inputs } from "./namespaces/events/inputs";
import { Glitch } from "./namespaces/classes/Glitch";
import { Post } from "./namespaces/classes/Post";
import { Queue } from "./namespaces/queue";
import { Usercard } from "./namespaces/usercard";
import { PostsResponsive } from "./namespaces/posts.responsive";



namespace Boot {
    let timer:number;
    let children:number = 0;
    let childrenTimer:number = 0;

    function checkTumblr ():void {
        if (document.body && document.body.childElementCount) {

            if (children == document.body.childElementCount) {
                childrenTimer++;

                if (childrenTimer > 5) {
                    clearInterval(timer);

                    bootApp();
                }
            }

            else {
                children = document.body.childElementCount;
                childrenTimer = 0;
            }

        }
    }

    function bootApp ():void {
        const glitches = document.getElementsByClassName("glitchy");

        Glitch.boot();
        Post.boot();
        Usercard.boot();
        PostsResponsive.boot();
        Scroll.boot();
        Resize.boot();
        Inputs.boot();

        Bootstrap.start();
        Queue.feed(glitches);

        // Call custom function.
        window.onThemeReady();
    }

    export function init ():void {
        timer = setInterval(checkTumblr, 200);
    }

}


window.addEventListener("load", Boot.init, eventoptions);
