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
        this.radius = 1;
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.set(this.x, this.y, this.z );
        this.mesh.scale.set( this.radius, this.radius, this.radius );
    };

    Cell.prototype = Object.create( Base.prototype  );
    Cell.prototype.constructor = Cell;
    Cell.prototype.options = {
        initRadius  : 1,
        maxScale    : 2,
        moving      : 0.025,
        center      : null
    };

    Cell.prototype.addToScene = function (scene) {
        console.log("Cell.addToScene at %d, %d, %d", this.x, this.y, this.z);
        scene.add( this.mesh );
    };

    Cell.prototype.render = function () {
        this.mesh.scale.set( this.radius, this.radius, this.radius );
    };

    Cell.prototype.setState = function () {
        if (this.moving > 0 && this.radius >= this.maxScale){
       //     this.moving = this.moving * -1;
       } else if (this.moving < 0 && this.radius <= 1){
       //     this.moving = Math.abs(this.moving);
           this.radius = 1;
        }
        this.radius += this.moving;
        // http://threejs.org/docs/#Reference/Math/Sphere
    };

    Cell.prototype.toggleDirection = function () {
        console.log('Toggle ', this.moving);
        this.moving = this.moving > 0? (-1*this.moving) : Math.abs(this.moving);
        this.radius += (this.moving*2);
    };

    return Cell;
});
