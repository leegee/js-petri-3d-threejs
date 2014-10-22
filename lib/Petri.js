// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define([
    "Base", "Cell","CellSpace", "three", "TrackballControls"
], function (
    Base, Cell, CellSpace, THREE
) {
    'use strict';

    var Petri = function  (options) {
        var self = this;
        Base.call(this, options);

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( {antialias:true} );
        this.renderer.setSize( this.screenWidth, this.screenHeight );
        document.body.appendChild(this.renderer.domElement);

        var intensity = 0.9,
            distance  = 0,
            light     = new THREE.PointLight(0xffffff, intensity, distance);

        light.position.set( this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.scene.add(light);

        console.info("Cell radius will be %d", this.maxCellRadius);

        var geometry = new THREE.SphereGeometry(
            this.maxCellRadius, 30, 30 // , 8, 6
        );
        var material = new THREE.MeshLambertMaterial( { color: 0xFFDD88 } );

        var aspectRatio = this.screenWidth / this.screenHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.frustumVerticalFov,
            aspectRatio,
            this.frustumNearPlane,
            this.frustumFarPlane
        );
        this.scene.add(this.camera);
        this.camera.position.set(
            this.cameraPosition.x,
            this.cameraPosition.y,
            this.cameraPosition.z
        );
        this.camera.lookAt(this.scene.position);

        var render = function () {
            // requestAnimationFrame(render);
            self.renderer.render(self.scene, self.camera);
            // self.controls.update();
        };

        // this.controls = new THREE.OrbitControls( this.camera );
        // this.controls.addEventListener( 'change', render );
        this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.2;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = false;
        this.controls.dynamicDampingFactor = 0.1;

        window.addEventListener( 'resize', this.onWindowResize, false );

        console.group();
        this.cellSpace = new CellSpace({});

        for (var i=0; i<this.sporesAt.length; i++){
            console.log("Create spore %i", i);
            var cell = new Cell({
                geometry: geometry.clone(),
                material: material,
                tone: 1,
                x: this.sporesAt[i][0]==0? 0 : this.screenWidth  / this.sporesAt[i][0],
                y: this.sporesAt[i][1]==0? 0 : this.screenHeight / this.sporesAt[i][1],
                z: this.sporesAt[i][2]==0? 0 : this.screenDepth  / this.sporesAt[i][2],
                screenWidth  : this.screenWidth,
                screenHeight : this.screenHeight
            });
            this.cellSpace.add(cell);
            cell.render();
            cell.addToScene( this.scene );
        }

        render();
        console.groupEnd();

        var play = function play () {
            var t = new Date().getTime();
            // console.time('generate');
            self.cellSpace.setState();
            // console.timeEnd('generate');

            requestAnimationFrame(render);
            self.controls.update();
            // Too fast using
            //      requestAnimationFrame(play);
            var d = new Date().getTime() - t;
            var pause = (d < self.minFrameDuration)? self.minFrameDuration - d : 0;
            setTimeout( play, pause );
        };
        setTimeout( play, this.minFrameDuration );
    };

    Petri.prototype.onWindowResize = function () {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };

    Petri.prototype = Object.create( Base.prototype  );
    Petri.prototype.constructor = Petri;

    Petri.prototype.options = {
        sporesAt            : [[0,0,0]],
        maxCellRadius       : window.innerWidth,
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        screenDepth         : window.innerHeight,
        frustumVerticalFov  : 40,
        frustumNearPlane    : 0.01,
        frustumFarPlane     : 20000,
        minFrameDuration    : 800,
        cameraPosition: {
            x: window.innerWidth,
            y: window.innerHeight,
            z: window.innerHeight * 20, // (window.innerWidth / 2) * -20
        },
        lightPosition : {
            x : window.innerWidth ,
            y : window.innerHeight ,
            z : window.innerHeight * 20
        }
    };

    Petri.prototype.addTestShape = function () {
        var geometry = new THREE.SphereGeometry( 30, 32, 16 );
        var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0,40,0);
        this.scene.add(mesh);
    };

    return Petri;
});
