var data_full;
var data;
var i = 0;

function init() {

    // see all data on console to debug
    console.log(data_full);


    // listen to the resize events
    window.addEventListener('resize', onResize, false);

    var camera;
    var scene;
    var renderer;

    // initialize stats
    // var stats = initStats();


    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 100000);

    // show axes in the screen
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    // create a render and set the size and background color
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000)); // black
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // enable shadows in renderer
        
    // create the ground plane
    var planeGeometry = new THREE.PlaneGeometry(5400, 10900, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -2700.;
    plane.position.z = 8689.;

    // add the plane to the scene
    scene.add(plane);


    // DS Cryo
    var dsGeom = new THREE.CylinderGeometry( 1900., 1900., 10900., 32, 32, true );
    var dsMaterial = new THREE.MeshLambertMaterial({
        color: 0x7a7a7a,
        wireframe: false,
        side:THREE.DoubleSide,
    });
    var ds = new THREE.Mesh( dsGeom, dsMaterial );

    // Rotate and Position DS
    ds.rotation.x = -0.5 * Math.PI;
    ds.position.set(0, 0, 8689.);
    ds.castShadow = true;
    ds.receiveShadow = true;

    // add DS to the scene
    scene.add(ds);


    // Tracker Simple
    var trackerGeom = new THREE.CylinderGeometry( 810, 810, 3270, 64 );
    var trackerMaterial = new THREE.MeshLambertMaterial({ color: 0xebcb4d,
        opacity: 0.5, transparent: true});
    var tracker = new THREE.Mesh( trackerGeom, trackerMaterial );

    // Rotate and Position tracker
    tracker.rotation.x = -0.5 * Math.PI;
    tracker.position.set(0, 0, 10175.);
    tracker.castShadow = true;

    // add Tracker to the scene
    scene.add(tracker);


    // Stopping Target Simple
    var trackerGeom = new THREE.CylinderGeometry( 680, 680, 3270, 64 );
    var stopTargGeom = new THREE.CylinderGeometry( 75, 75, 800, 64 );
    var stopTargMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000,
        opacity: 0.5, transparent: true});
    var stopTarg = new THREE.Mesh( stopTargGeom, stopTargMaterial );

    // Rotate and Position stopTarg
    stopTarg.rotation.x = -0.5 * Math.PI;
    stopTarg.position.set(0, 0, 5871.);
    stopTarg.castShadow = true;

    // add Stopping Target to the scene
    scene.add(stopTarg);


    // electron!
    var electronGeometry = new THREE.SphereGeometry(40, 20, 20);
    var electronMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
    var electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.castShadow = true;

    // add the electron to the scene
    scene.add(electron);


    // electron path and points
    var epathMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    var epathGeometry = new THREE.Geometry();
    var j;
    for (j = 0; j < data.length; j++) {
        epathGeometry.vertices.push(new THREE.Vector3(data[j].X,data[j].Y,data[j].Z))
    }
    var epath = new THREE.Line( epathGeometry, epathMaterial);
    
    var materialParams = {size: 20,
                          transparent: true,
                          alphaTest: 0.9,
                          vertexColors: THREE.VertexColors };
    var pointsMaterial = new THREE.PointsMaterial( materialParams );
    var epoints = new THREE.Points(epathGeometry, pointsMaterial);

    epath.name = "epath";
    epoints.name = "epoints";
    scene.add(epath);
    scene.add(epoints);


    // Bfield Vector
    var BDir = new THREE.Vector3( data[i].Bx_scaled, data[i].By_scaled, data[i].Bz_scaled );
    var BOrigin = electron.position;
    var BArrowHelper = new THREE.ArrowHelper( BDir.normalize(), BOrigin, BDir.length() * 500, 0xff0000);

    scene.add(BArrowHelper);


    // Force Vector
    var FDir = new THREE.Vector3( data[i].Fx_scaled, data[i].Fy_scaled, data[i].Fz_scaled );
    var FOrigin = electron.position;
    var FArrowHelper = new THREE.ArrowHelper( FDir.normalize(), FOrigin, FDir.length() * 500, 0x00ff00);

    scene.add(FArrowHelper);


    // Velocity Vector
    var VDir = new THREE.Vector3( data[i].Vx_scaled, data[i].Vy_scaled, data[i].Vz_scaled );
    var VOrigin = electron.position;
    var VArrowHelper = new THREE.ArrowHelper( VDir.normalize(), VOrigin, VDir.length() * 500, 0x0000ff);

    scene.add(VArrowHelper);


    // Camera stuff
    var camLook = new THREE.Vector3(0,0, electron.position.z);
    camera.lookAt(camLook);
    
    // Lighting
    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x151515);
    scene.add(ambienLight);

    // Focused light
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(0,10,0);
    scene.add( directionalLight );

    // Very focused
    var pointLight = new THREE.PointLight();
    pointLight.position.set(0, 0, 0);
    scene.add( pointLight );

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    var clock = new THREE.Clock();
    var play = false;
    var flip = false;


    // functions that contain data for the GUI
    var controls = new function () {
        this.particleOptionsGUI = {'normal':2,
                                   'smallbounce':15,
                                   'bigbounce':6,
                                   'low-pt':12
                                }
        this.particleIndex = 2;
        this.reset = function() {
            i = 0;
        }
        this.play_pause = function () {
            if (play == false){
                play = true;
            } else {
                play = false;
            }
        }

        this.flip_cam = function () {
            if (flip == false) {
                flip = true;
            } else {
                flip = false;
            }
        }
        this.camRadius = 3000;
        this.camTheta = 1.2;
        this.camPhi = 0;
    };

    var monitor = new function () {
        this.X=0;
        this.Y=0;
        this.Z=0;
        this.Vx=0;
        this.Vy=0;
        this.Vz=0;
        this.Bx=0;
        this.By=0;
        this.Bz=0;
        this.Fx=0;
        this.Fy=0;
        this.Fz=0;
        this.time=0;
        this.i = i;
    };

    var visibility = new function () {
        this.DetectorSolenoid = function () {
            if (ds.visible == true) {
                ds.visible = false;
            } else {
                ds.visible = true;
            }
        }
        this.StoppingTarget = function () {
            if (stopTarg.visible == true) {
                stopTarg.visible = false;
            } else {
                stopTarg.visible = true;
            }
        }
        this.Tracker = function () {
            if (tracker.visible == true) {
                tracker.visible = false;
            } else {
                tracker.visible = true;
            }
        }
        this.Electron = function () {
            if (electron.visible == true) {
                electron.visible = false;
            } else {
                electron.visible = true;
            }
        }
        this.ElectronTrack = function () {
            if (epath.visible == true) {
                epath.visible = false;
            } else {
                epath.visible = true;
            }
        }
        this.ElectronTiming = function () {
            if (epoints.visible == true) {
                epoints.visible = false;
            } else {
                epoints.visible = true;
            }
        }
        this.Plane = function () {
            if (plane.visible == true) {
                plane.visible = false;
            } else {
                plane.visible = true;
            }
        }
        this.OriginAxes = function () {
            if (axes.visible == true) {
                axes.visible = false;
            } else {
                axes.visible = true;
            }
        }
        this.MagneticField = function () {
            if (BArrowHelper.visible == true) {
                BArrowHelper.visible = false;
            } else {
                BArrowHelper.visible = true;
            }
        }
        this.Velocity = function () {
            if (VArrowHelper.visible == true) {
                VArrowHelper.visible = false;
            } else {
                VArrowHelper.visible = true;
            }
        }
        this.Force = function () {
            if (FArrowHelper.visible == true) {
                FArrowHelper.visible = false;
            } else {
                FArrowHelper.visible = true;
            }
        }
    }

    var menu = new function () {
        this.mainmenu = function () {
            var x = document.getElementById("mainmenu");
            console.log(x.style.display);
            if (x.style.display == "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
            console.log(x.style.display);
        }
    }

    // GUI stuff
    var gui = new dat.GUI();
    gui.add(controls, 'particleIndex', controls.particleOptionsGUI).onChange(function() {i=0});

    var f0 = gui.addFolder('Toggle Elements');
    var f00 = f0.addFolder ('Vectors');
    f00.add(visibility, 'MagneticField');
    f00.add(visibility, 'Velocity');
    f00.add(visibility, 'Force');
    f0.add(visibility, 'DetectorSolenoid');
    f0.add(visibility, 'StoppingTarget');
    f0.add(visibility, 'Tracker');
    f0.add(visibility, 'Electron');
    f0.add(visibility, 'ElectronTrack');
    f0.add(visibility, 'ElectronTiming');
    f0.add(visibility, 'Plane');
    f0.add(visibility, 'OriginAxes');

    var f1 = gui.addFolder('Monitor');
    var f10 = f1.addFolder('Position');
    var f11 = f1.addFolder('Velocity');
    var f12 = f1.addFolder('Magnetic Field');
    var f13 = f1.addFolder('Force');

    f10.add(monitor, 'X').listen();
    f10.add(monitor, 'Y').listen();
    f10.add(monitor, 'Z').listen();

    f11.add(monitor, 'Vx').listen();
    f11.add(monitor, 'Vy').listen();
    f11.add(monitor, 'Vz').listen();

    f12.add(monitor, 'Bx').listen();
    f12.add(monitor, 'By').listen();
    f12.add(monitor, 'Bz').listen();

    f13.add(monitor, 'Fx').listen();
    f13.add(monitor, 'Fy').listen();
    f13.add(monitor, 'Fz').listen();

    f1.add(monitor, 'time').listen();

    var f2 = gui.addFolder("Camera Contols");
    f2.add(controls, 'flip_cam');
    f2.add(controls, 'camRadius', 500, 5000);
    f2.add(controls, 'camTheta', 0, Math.PI);
    f2.add(controls, 'camPhi', -Math.PI, Math.PI);

    gui.add(menu, 'mainmenu');
    gui.add(controls, 'reset');
    gui.add(controls, 'play_pause');

    render();

    function render() {
        if (play == true) {
            i ++;            
        }
        // update the stats and the controls
        // stats.update();

        // animate electron
        data = data_full.filter(function(row) {
        return row.event == controls.particleIndex;
        });
        pos = data[i % data.length];
        electron.position.set(pos.X, pos.Y, pos.Z);

        // update monitor elements
        // (there's probably a much better way to do this)
        monitor.X = pos.X;
        monitor.Y = pos.Y;
        monitor.Z = pos.Z;
        monitor.Vx = pos.Vx / 3e8;
        monitor.Vy = pos.Vy / 3e8;
        monitor.Vz = pos.Vz / 3e8;
        monitor.Bx = pos.Bx*10000;
        monitor.By = pos.By*10000;
        monitor.Bz = pos.Bz*10000;
        monitor.Fx = pos.Fx;
        monitor.Fy = pos.Fy;
        monitor.Fz = pos.Fz;
        monitor.time = pos.time*1e9;

        // color map adjust for electron path
        cmap = d3.scaleSequential(d3.interpolateViridis);
        var extent = [0.0, data[data.length-1].time];
        cmap.domain(extent).nice();

        // adjust electron path
        epathGeometry = new THREE.Geometry();
        for (j = 0; j < data.length; j++) {
            epathGeometry.vertices.push(new THREE.Vector3(data[j].X,data[j].Y,data[j].Z))
            epathGeometry.colors.push(new THREE.Color(cmap(data[j].time)))
        }
        // update the geometries
        epath.geometry = epathGeometry;
        epoints.geometry = epathGeometry;

        // update vector position and directions
        BArrowHelper.position.copy(electron.position);
        var BDir2 = new THREE.Vector3( data[i % data.length].Bx_scaled, data[i % data.length].By_scaled, data[i % data.length].Bz_scaled );
        BArrowHelper.setDirection(BDir2.normalize());

        FArrowHelper.position.copy(electron.position);
        var FDir2 = new THREE.Vector3( data[i % data.length].Fx_scaled, data[i % data.length].Fy_scaled, data[i % data.length].Fz_scaled );
        FArrowHelper.setDirection(FDir2.normalize());

        VArrowHelper.position.copy(electron.position);
        var VDir2 = new THREE.Vector3( data[i % data.length].Vx_scaled, data[i % data.length].Vy_scaled, data[i % data.length].Vz_scaled );
        VArrowHelper.setDirection(VDir2.normalize());


        // update camera position
        camera.position.x = - controls.camRadius * Math.sin(controls.camTheta) * Math.sin(controls.camPhi);
        camera.position.y = controls.camRadius * Math.cos(controls.camTheta);
        if (flip == false) {
            camera.position.z = pos.Z - controls.camRadius * Math.sin(controls.camTheta) * Math.cos(controls.camPhi);
        } else {
            camera.position.z = pos.Z + controls.camRadius * Math.sin(controls.camTheta) * Math.cos(controls.camPhi);
        };

        camLook = new THREE.Vector3(data[0].X,data[0].Y, electron.position.z);
        camera.lookAt(camLook);

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }    
}