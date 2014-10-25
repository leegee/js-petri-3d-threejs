define(["lib/Petri", "three", "lib/Cell"],
function main (Petri, THREE, Cell) {

    new Petri(
        Cell,
        {
            sporesAt : [
                [-0.5, -0.5, -0.5],
                [0, -0.5, -0.5],
                [0, 0, 0],
                [0.5, 0.5, 0.5],
                [0.5, 0.5, 0]
            ]
        }
    );
});
