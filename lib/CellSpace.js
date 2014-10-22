// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell"], function (Base, Cell) {
    'use strict';

    var CellSpace = function (options) {
        Base.call(this, options);
        this.generation = 0;
        this.cells = [];
        this.cellMeshes = []
    };

    CellSpace.prototype = Object.create( Base.prototype  );
    CellSpace.prototype.constructor = CellSpace;
    CellSpace.prototype.options = {};

    CellSpace.prototype.add = function (cell, onAdd) {
        this.cells.push( cell );
        this.cellMeshes.push( cell.mesh );
    };

    CellSpace.prototype.setState = function () {
        var i;
        this.generation ++;
        for (i in this.cells){
            this.cells[i].setState();
            this.cells[i].render();
        }
        for (i in this.cells){
            this.react( i);
        }
    };

    CellSpace.prototype.react = function (thisIndex) {
        var thisPosition = new THREE.Vector3();
        thisPosition.setFromMatrixPosition( this.cells[thisIndex].mesh.matrixWorld );
        var sphere = new THREE.Sphere(
            thisPosition,
            this.maxCellRadius * this.cells[thisIndex].radius
        );

        for (var i in this.cells){
            if (i===thisIndex) {
                continue;
            }
            var position = new THREE.Vector3();
            position.setFromMatrixPosition( this.cells[i].mesh.matrixWorld );
            if ( sphere.intersectsSphere(
                new THREE.Sphere(
                    position,
                    this.maxCellRadius * this.cells[i].radius
                )
            )){
                this.cells[i].toggleDirection();
            };

        }
    };

    return CellSpace;
});
