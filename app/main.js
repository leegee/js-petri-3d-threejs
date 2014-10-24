define(["lib/Petri", "three"], function main (Petri, THREE) {

    new Petri({
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        // sporesAt            : [
        //     [-0.5, -0.5, -0.5],
        //     [0, -0.5, -0.5],
        //     [0, 0, 0],
        //     [0.5, 0.5, 0.5],
        //     [0.5, 0.5, 0]
        // ]
    });
});
