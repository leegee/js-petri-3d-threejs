define(["lib/Petri", "three"], function main (Petri, THREE) {

    new Petri({
        sporesAt            : [
            [-0.5, -0.5, -0.5],
            [0, -0.5, -0.5],
            [0, 0, 0],
            [0.5, 0.5, 0.5],
            [0.5, 0.5, 0]
        ]
    });
});
