// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell"], function (Base, Cell) {
    'use strict';

    var CellSpace = function (options) {
        Base.call(this, options);
        this.generation     = 0;
        this.cells          = [];
        this.cellMeshes     = [];
        this._position      = new THREE.Vector3();
        this._thisPosition  = new THREE.Vector3();
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
            this.cells[i].toggle = false;
        }
        for (i in this.cells){
            this.cells[i].setState();
            this.cells[i].render();
            this.react(i);
        }

        for (i in this.cells){
            this.cells[i].maybeToggle();
        }

    };

    CellSpace.prototype.react = function (thisIndex) {
        if (this.cells[thisIndex].toggle) {
            return;
        }

        this._thisPosition.setFromMatrixPosition( this.cells[thisIndex].mesh.matrixWorld );

        var i,
            sphere = new THREE.Sphere(
            this._thisPosition,
            this.cells[thisIndex].getRadius() + 4
        );

        for (i in this.cells){
            if (i!==thisIndex) {
                this._position.setFromMatrixPosition( this.cells[i].mesh.matrixWorld );
                if ( sphere.intersectsSphere(
                    new THREE.Sphere(
                        this._position,
                        this.cells[i].getRadius()
                    )
                )){
                    this.cells[thisIndex].toggle = true;
                    this.cells[i].toggle = true;
                }
            }
        }
    };

    return CellSpace;
});
