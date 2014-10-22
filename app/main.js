define(["Petri", "three"], function main (Petri, THREE) {

    new Petri({
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        frustumVerticalFov  : 40,
        frustumNearPlane    : .01,
        frustumFarPlane     : 20000,
        minFrameDuration    : 300
        // sporesAt            : [
        //     [-0.5, -0.5, -0.5],
        //     [0, -0.5, -0.5],
        //     [0, 0, 0],
        //     [0.5, 0.5, 0.5],
        //     [0.5, 0.5, 0]
        // ]
    });
});
