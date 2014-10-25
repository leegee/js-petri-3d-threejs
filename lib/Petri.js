// to depend on a bower installed component:
// define(['bower_components/componentName/file'])

define([
    "lib/Base", "lib/CellSpace", "three", "../lib/Sound", "dat-gui", "TrackballControls"
], function (
    Base, CellSpace, THREE, Sound, DAT
) {
    'use strict';

    var Cell;

    var Petri = function  (cellPrototype, options) {
        Cell = cellPrototype;

        var i, self = this;
        Base.call(this, options);

        this.soundsLoaded = 0;

        if (this.sporesAt === null || typeof this.sporesAt === 'number'){
            var todo = (typeof this.sporesAt === 'number')? this.sporesAt : 5;
            this.sporesAt = [];
            for (i = 0; i < todo; i++){
                var at = [0,0,0];
                for (var j = 0; j < 2; j++){ // leave z
                    at[j] = (Math.random(1)*2)-1;
                    // TODO Check not too near existing spore
                }
                this.sporesAt.push(at);
            }
        }

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
            this.maxCellRadius, 60, 60 // , 8, 6
        );
        var material = new THREE.MeshNormalMaterial({color: 0xBAE8E6 });

        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.screenWidth / this.screenHeight,
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

        // this.controls = new THREE.OrbitControls( this.camera );
        // this.controls.addEventListener( 'change', render );
        this.controls = new THREE.TrackballControls( this.camera,
            document.body.appendChild(this.renderer.domElement )
        );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.2;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = false;
        this.controls.dynamicDampingFactor = 0.1;

        var gui = new DAT.GUI({
            height : 200,
        });
        var params = {
            minFrameDuration: this.minFrameDuration,
            x : this.cameraPosition.x,
            y : this.cameraPosition.y,
            z : this.cameraPosition.z
        };
        gui.add(params, 'minFrameDuration').onFinishChange(function(v){
            self.minFrameDuration = v;
        });
        gui.add(params, 'x')
            .min(-1*this.screenWidth)
            .max(this.screenWidth)
            .step(10)
            .onFinishChange(function(v){
                self.cameraPosition.x = v;
                self.camera.position.set(self.cameraPosition.x, self.cameraPosition.y, self.cameraPosition.z );
            }
        );
        gui.add(params, 'y').min(-1*self.screenHeight).max(self.screenHeight).step(10).onFinishChange(function(v){
            self.cameraPosition.y = v;
            self.camera.position.set(self.cameraPosition.x, self.cameraPosition.y, self.cameraPosition.z );
        });
        gui.add(params, 'z').min(-1*self.screenDepth).max(self.screenDepth).step(10).onFinishChange(function(v){
            self.cameraPosition.z = v;
            self.camera.position.set(self.cameraPosition.x, self.cameraPosition.y, self.cameraPosition.z );
        });

        window.addEventListener( 'resize', this.onWindowResize, false );

        console.group();
        this.cellSpace = new CellSpace({
            maxCellRadius: this.maxCellRadius
        });

        for (i=0; i<this.sporesAt.length; i++){
            console.log("Create spore %i", i);
            var cell = new Cell({
                sound       : this.getSound(
                    parseInt(Math.random(1)*this.samplesSubDirs.length),
                    parseInt(Math.random(1)*this.samplesScale.length)
                ),
                geometry     : geometry,
                material     : material,
                x            : this.sporesAt[i][0]===0? 0 : (this.screenWidth  / this.sporesAt[i][0]),
                y            : this.sporesAt[i][1]===0? 0 : (this.screenHeight / this.sporesAt[i][1]),
                z            : this.sporesAt[i][2]===0? 0 : (this.screenDepth  / this.sporesAt[i][2]),
                screenWidth  : this.screenWidth,
                screenHeight : this.screenHeight
            });
            this.cellSpace.add(cell);
            cell.render();
            cell.addToScene( this.scene );
        }

        console.groupEnd();
        // this.run();
    };

    Petri.prototype = Object.create( Base.prototype  );
    Petri.prototype.constructor = Petri;
    Petri.prototype.options = {
        samplesDir          : 'lib/samples/',
        samplesSubDirs      : ['pluck', 'darkbass', 'pluck'],
        samplesScale        : [1,3,5,6,8,10,11],
        sporesAt            : null,
        maxCellRadius       : window.innerWidth,
        fullscreen          : true,
        screenWidth         : window.innerWidth,
        screenHeight        : window.innerHeight,
        screenDepth         : window.innerHeight*10,
        fov                 : 45,
        frustumNearPlane    : 0.01,
        frustumFarPlane     : 70000,
        minFrameDuration    : 50,
        cameraPosition: {
            x: 0,
            y: window.innerHeight / 4,
            z: window.innerHeight * -20,
        },
        lightPosition : {
            x : 0,
            y : window.innerHeight * 2,
            z : window.innerHeight * 20
        }
    };

    Petri.prototype.getSize = function () {
        return this.sporesAt.length;
    };

    Petri.prototype.soundLoaded = function () {
        this.soundsLoaded ++;
        console.info(this);
        console.info("Loaded sound %d of %d", this.soundsLoaded, this.getSize() );
        if (this.soundsLoaded===this.getSize() ){
            this.run();
        }
    };

    Petri.prototype.run = function () {
        var self = this;
        var t = new Date().getTime() ;
        this.cellSpace.setState();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        var d = new Date().getTime() - t;

        // Too fast using just requestAnimationFrame(play);?
        var pause = (self.minFrameDuration && d < self.minFrameDuration)? self.minFrameDuration - d : 0;
        setTimeout(
           function(){ requestAnimationFrame( self.run.bind(self) ); },
           pause
        );
        // requestAnimationFrame( this.run.bind(this) );
     };

    Petri.prototype.onWindowResize = function () {
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };

    Petri.prototype.addTestShape = function () {
        var geometry = new THREE.SphereGeometry( 30, 32, 16 );
        var material = new THREE.MeshLambertMaterial( { color: 0x000088 } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0,40,0);
        this.scene.add(mesh);
    };

    Petri.prototype.getSound = function (samplesSubDirs, i) {
        var path = this.samplesDir +'/'+
            this.samplesSubDirs[samplesSubDirs] +'/'+
            this.samplesScale[i] +
             ".wav";

        if (typeof this.samplesScale[i]==='undefined'){
            throw new TypeError('No sample in scale at subdir number '+samplesSubDirs+' '+this.samplesSubDirs[samplesSubDirs]+' index '+i);
        }

        var self = this;
        console.log('Load tone %d, %s',i, path);
        return new Sound( path, 1024, function () {
            self.soundLoaded();
        });
    };

    return Petri;
});
