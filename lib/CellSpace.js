// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

/** The cell space **/

define(["Base", "Cell"], function (Base, Cell) {
    'use strict';

    var CellSpace = function () {
        this.generation = 0;
        this.cells = [];
    };

    CellSpace.prototype = Object.create( Base.prototype  );
    CellSpace.prototype.constructor = CellSpace;
    CellSpace.prototype.options = {};

    CellSpace.prototype.add = function (cell, onAdd) {
        this.cells.push( cell );
    };

    CellSpace.prototype.setState = function () {
        // console.log("Enter CellSpace.generate %d", this.generation);
        this.generation ++;
        // Update after computation so as not to effect outcome
        for (var i in this.cells){
            this.cells[i].setState();
        }
    };

    return CellSpace;
});
