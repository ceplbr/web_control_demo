  /**
   * Setup all GUI elements when the page is loaded.
   */
function init() {
// Connect to ROS.
    var ros = new ROSLIB.Ros({
        url : 'ws://localhost:9090'
    });

    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID : 'nav',
        width : 684,
        height : 524
    });

    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
        serverName : '/move_base',
        withOrientation: 'True'
    });

    path = new ROSLIB.Topic({
        ros: ros,
        name: '/move_base/NavfnROS/plan',
        messageType: 'nav_msgs/Path',
        rootObject : viewer.scene
    });

    path.subscribe(function (message) {
        //alert('Received message on ' + path.name + ': ' + JSON.stringify(message));
        targetPath = new ROS2D.PathShape({
            ros: ros,
            path: message,
            rootObject : viewer.scene,
            strokeSize : 0.01
        });
        viewer.scene.addChild(targetPath);
        targetPath.setPath(message);

        //path.unsubscribe();
    });
}

window.onload = function(e) { init(); }
