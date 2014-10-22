// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["Base", "three"], function (Base, THREE) {
    'use strict';

    // Initiated with its maximum size
    // See: https://github.com/mrdoob/three.js/wiki/Updates
    var Cell = function Cell (options) {
        Base.call(this, options);
        console.debug('New cell', this);
        // this.center = new THREE.Vector3( this.x, this.y, this.z );
        this.mesh   = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.set(this.x, this.y, this.z );
        // this.mesh.matrixAutoUpdate = false;
    };

    Cell.prototype = Object.create( Base.prototype  );
    Cell.prototype.constructor = Cell;
    Cell.prototype.options = {
        radius      : 1,
        radiusMax   : window.innerWidth,
        moving      : 1,
        center      : null
    };

    Cell.prototype.addToScene = function (scene) {
        console.log("Cell.addToScene at %d, %d, %d", this.x, this.y, this.z);
        scene.add( this.mesh );
    };

    Cell.prototype.render = function () {
        // this.geometry.scale = this.radius;
        // this.mesh.position.set(this.x, this.y, this.z );
        this.mesh.visible = true;
        this.mesh.updateMatrix();
    };

    Cell.prototype.setState = function () {
        if (this.moving > 0){
            if (this.radius >= this.radiusMax){
                this.moving = this.moving * -1;
            }
        } else {
            if (this.radius < 1){
                this.moving = this.moving * 1;
            }
        }
        this.radius += this.moving;
        // console.log('Raidus %d', this.radius );
        // http://threejs.org/docs/#Reference/Math/Sphere
    };

    return Cell;
});
