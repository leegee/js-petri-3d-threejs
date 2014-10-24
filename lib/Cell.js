// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define(["Base", "three"], function (Base, THREE) {
    'use strict';

    var Instances = 0;

    // Initiated with its maximum size
    // See: https://github.com/mrdoob/three.js/wiki/Updates
    var Cell = function Cell (options) {
        Base.call(this, options);
        console.debug('New cell', this);
        // this.center = new THREE.Vector3( this.x, this.y, this.z );
        this.id = ++Instances;
        this.toggle = false;
        this.radius = this.moving;
        this.initRadius = this.radius;
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.position.set(this.x, this.y, this.z );
        this.mesh.scale.set( this.radius, this.radius, this.radius );
    };

    Cell.prototype = Object.create( Base.prototype  );
    Cell.prototype.constructor = Cell;
    Cell.prototype.options = {
        initRadius  : null,
        maxScale    : 3.5,
        moving      : 0.025,
        center      : null,
        sound       : null,
        soundPath   : null
    };

    Cell.prototype.addToScene = function (scene) {
        console.log("Cell.addToScene at %d, %d, %d", this.x, this.y, this.z);
        scene.add( this.mesh );
    };

    Cell.prototype.render = function () {
       this.mesh.scale.set( this.radius, this.radius, this.radius );
    };

    Cell.prototype.getRadius = function () {
        return this.geometry.parameters.radius * this.mesh.scale.x;
    };

    Cell.prototype.setState = function () {
        if (this.moving > 0 && this.radius+this.moving >= this.maxScale){
           // this.moving = this.moving * -1;
           // this.radius = this.maxScale + this.moving;
           this.toggleDirection();
           // console.log('Played, too big');
       } else if (this.moving < 0 && this.radius-this.moving <= 0){
           this.toggleDirection();
           // this.moving = Math.abs(this.moving);
           // this.radius = 0.00001;
           // this.sound.play();
           // console.log('Played, too small');
        } else {
            this.radius += this.moving;
        }
    };

    Cell.prototype.maybeToggle = function () {
        if (this.toggle) this.toggleDirection();
    };

    Cell.prototype.toggleDirection = function () {
        this.moving = this.moving > 0? (-1*this.moving) : Math.abs(this.moving);
        this.radius += (this.moving*2);
        this.sound.play();
    };

    return Cell;
});
