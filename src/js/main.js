var data;
var i = 0;

function init() {

    // var data = d3Load("../assets/data/r05_sr01_e000.json");
    // d3Load("../assets/data/r05_sr01_e000.json");

    console.log(data);


    // listen to the resize events
    window.addEventListener('resize', onResize, false);

    var camera;
    var scene;
    var renderer;

    // initialize stats
    var stats = initStats();


    // create a scene, that will hold all our elements such as objects, cameras and lights.
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 100000);

    // show axes in the screen
    // var axes = new THREE.AxesHelper(20);
    var axes = new THREE.AxesHelper(1000);
    scene.add(axes);

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
        
    // create the ground plane
    // var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
    var planeGeometry = new THREE.PlaneGeometry(5400, 10900, 1, 1);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = -2700.;
    plane.position.z = 8689.; // (14139 + 3239) / 2

    // add the plane to the scene
    scene.add(plane);


    // DS Cryo
    var dsGeom = new THREE.CylinderGeometry( 1900., 1900., 10900., 16, 16, true );
    var dsMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        wireframe: true
    });
    var ds = new THREE.Mesh( dsGeom, dsMaterial );

    // Rotate and Position DS
    ds.rotation.x = -0.5 * Math.PI;
    ds.position.set(0, 0, 8689.);
    ds.castShadow = true;
    ds.receiveShadow = true;

    // scene.add(ds);


    // Tracker Simple
    // var trackerGeom = new THREE.CylinderGeometry( 680, 680, 3270, 64 );
    var trackerGeom = new THREE.CylinderGeometry( 810, 810, 3270, 64 );
    var trackerMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff,
        opacity: 0.5, transparent: true});
    var tracker = new THREE.Mesh( trackerGeom, trackerMaterial );

    // tracker.materials.opacity = 0.5;
    // tracker.materials[0].transparent = true;

    // Rotate and Position tracker
    tracker.rotation.x = -0.5 * Math.PI;
    tracker.position.set(0, 0, 10175.);
    tracker.castShadow = true;


    scene.add(tracker);

    // Stopping Target Simple
    // var trackerGeom = new THREE.CylinderGeometry( 680, 680, 3270, 64 );
    var stopTargGeom = new THREE.CylinderGeometry( 75, 75, 800, 64 );
    var stopTargMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00,
        opacity: 0.5, transparent: true});
    var stopTarg = new THREE.Mesh( stopTargGeom, stopTargMaterial );

    // Rotate and Position stopTarg
    stopTarg.rotation.x = -0.5 * Math.PI;
    stopTarg.position.set(0, 0, 5871.);
    stopTarg.castShadow = true;


    scene.add(stopTarg);



    // electron!
    var electronGeometry = new THREE.SphereGeometry(40, 20, 20);
    var electronMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var electron = new THREE.Mesh(electronGeometry, electronMaterial);

    // position the electron
    var pos = data[0];
    console.log(pos);
    electron.position.set(pos.X, pos.Y, pos.Z);
    electron.castShadow = true;

    // add the electron to the scene
    scene.add(electron);




    // LOAD DATA test 1
    // var objectLoader = new THREE.JSONLoader();
    // console.log(objectLoader);
    // objectLoader.load("../assets/data/r05_sr01_e000.json", function (obj) {
    //     console.log(obj);
    //     return obj;
    // });
    // var data = objectLoader.parse("../assets/data/r05_sr01_e000.json");

    // console.log(data);




    // text sprites!
    // var spriteTrack = makeTextSprite( "Tracker", 
    //     { fontsize: 24, borderColor: {r:0, g:0, b:255, a:1.0}, backgroundColor: {r:0, g:0, b:100, a:0.6} } );
    // spriteTrack.position.set(tracker.position);
    // scene.add( spriteTrack );

/*    var spritey = makeTextSprite( " World! ", 
        { fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
    spritey.position.set(55,105,55);
    scene.add( spritey );
*/


    // create a cube
    var cubeGeometry = new THREE.BoxGeometry(400, 400, 400);
    var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 300 - 2700;
    cube.position.z = 0;//8689.;

    // add the cube to the scene
    // scene.add(cube);

    var sphereGeometry = new THREE.SphereGeometry(400, 20, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = -2700;
    sphere.position.z = 1000;//8689. + 1000;
    sphere.castShadow = true;

    // add the sphere to the scene
    // scene.add(sphere);

    // scene.translateZ(8689.);

    // position and point the camera to the center of the scene
    camera.position.x = 0;//1000;//1000;
    camera.position.y = 1000;//2000;
    camera.position.z = 0;//6000;//9000;  
    //camera.position.set(-13500., 850., 8000.)
    
    // camera.position.set(electron.position);
    // camera.translateZ(-50);
    // camera.position.set(0, -2700, 86)

    // camera.lookAt(scene.position);
    // camera.lookAt(plane.position);
    camera.lookAt(electron.position);

    // add subtle ambient lighting
    var ambienLight = new THREE.AmbientLight(0x353535);
    scene.add(ambienLight);

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 0, 2000);//8689+1000);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(-.25,1,-1);
    scene.add( directionalLight );

    // add the output of the renderer to the html element
    document.getElementById("webgl-output").appendChild(renderer.domElement);

     // initialize the trackball controls and the clock which is needed
    // var trackballControls = initTrackballControls(camera, renderer);
    // var clock = new THREE.Clock();
    // trackballControls.target = new THREE.Vector3(0,-2700,8689);
    //trackballControls.target = plane.position
    // trackballControls.target = sphere.position

    // call the render function
    var step = 0;

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.outputPlanePos = function () {
            console.log(plane.position);
        }
        this.outputCamPos = function () {
            console.log(camera.position);
        }
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);
    gui.add(controls, 'outputPlanePos');
    gui.add(controls, 'outputCamPos');

    render();

    function render() {
        i ++;
        // console.log(data);
        // console.log(i);
        // update the stats and the controls
        // trackballControls.update(clock.getDelta());
        stats.update();

        // animate electron
        pos = data[i % data.length];
        // console.log(p);
        electron.position.set(pos.X, pos.Y, pos.Z);
        camera.position.x = pos.X;
        camera.position.y = pos.Y + 200;
        camera.position.z = pos.Z - 500;

        camera.lookAt(electron.position);



        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (100 * (Math.cos(step)));
        sphere.position.y = 2-2700 + (1000 * Math.abs(Math.sin(step)));

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }    
}


// var data;

function d3Load( filename )
{
    var data = d3.json(filename)
        .then(function(d) {
            //defineParams();
            // params.data = d;
            // console.log(d);
            // WebGLStart();
            // return d;
            // console.log(d);
            // data = d;
            // console.log(data);
            // return data;
            return d;
        })
        .catch(function(error){
            console.log('ERROR:', error)
        })

    // console.log(data);
    return data;
// 
// 
// 
        // , function(json) {
// 
    // });
}


/*function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    
    var fontface = parameters.hasOwnProperty("fontface") ? 
        parameters["fontface"] : "Arial";
    
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
        parameters["fontsize"] : 18;
    
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
        parameters["borderThickness"] : 4;
    
    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    var spriteAlignment = THREE.SpriteAlignment.topLeft;
        
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;
    
    // background color
    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                                  + backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                                  + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    
    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText( message, borderThickness, fontsize + borderThickness);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( 
        { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100,50,1.0);
    return sprite;  
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
}
*/