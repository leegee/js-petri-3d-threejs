require.config({
    baseUrl: "",
    paths: {
        "components"        : "bower_components",
        "dat-gui"           : "bower_components/dat-gui/build/dat.gui.min",
        "three"             : "bower_components/threejs/build//three.min",
        "TrackballControls" : "bower_components/threejs-controls/controls/TrackballControls",
        "OrbitControls"     : "bower_components/OrbitControls/index"
    },
    shim: {
        "three": {
            exports: "THREE"
        },
        "dat-gui": {
            deps: ["three"],
            exports: "dat.gui"
        },
        "TrackballControls": {
            deps: ["three"]
        },
        "OrbitControls": {
            deps: ["three"]
        }
    }
});



