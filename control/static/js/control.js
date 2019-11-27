 
  GlobalPathHandler = function(options) {
    var that = this;
    options = options || {};
    var ros = options.ros;

    var topic = options.topic || '/move_base/NavfnROS/plan';
    this.rootObject = options.rootObject || new createjs.Container();
    var continuous = options.continuous;
    var strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    var strokeSize = options.strokeSize || 3;
  
    this.currentGlobalPath = new ROS2D.PathShape();
    this.rootObject.addChild(this.currentGlobalPath);
    
    var rosTopic = new ROSLIB.Topic({
      ros : ros,
      name : topic,
      messageType : 'nav_msgs/Path'
    });

    rosTopic.subscribe(function(message) {
      var index = null;
      if (that.currentGlobalPath) {
        index = that.rootObject.getChildIndex(that.currentGlobalPath);
        that.rootObject.removeChild(that.currentGlobalPath);
      }

      that.currentGlobalPath = new ROS2D.PathShape({
        ros: ros,
        path: message,
        rootObject : that.rootObject,
        strokeSize : strokeSize,
        strokeColor : strokeColor,
      });

      if (index !== null) {
        that.rootObject.addChildAt(that.currentGlobalPath, index);
      }
      else {
        that.rootObject.addChild(that.currentGlobalPath);
      }

    });
  };
  GlobalPathHandler.prototype.__proto__ = EventEmitter2.prototype;

   
LocalPathHandler = function(options) {
    var that = this;
    options = options || {};
    var ros = options.ros;
    var topic = options.topic || '/move_base/NavfnROS/plan';
    this.rootObject = options.rootObject || new createjs.Container();
    var continuous = options.continuous;
    var strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
    var strokeSize = options.strokeSize || 3;
  
    this.currentLocalPath = new ROS2D.PathShape();
    this.rootObject.addChild(this.currentLocalPath);

    var rosTopic = new ROSLIB.Topic({
      ros : ros,
      name : topic,
      messageType : 'nav_msgs/Path'
    });

    rosTopic.subscribe(function(message) {
      var index = null;
      if (that.currentLocalPath) {
        index = that.rootObject.getChildIndex(that.currentLocalPath);
        that.rootObject.removeChild(that.currentLocalPath);
      }

      that.currentLocalPath = new ROS2D.PathShape({
        ros: ros,
        path: message,
        rootObject : that.rootObject,
        strokeSize : strokeSize,
        strokeColor : strokeColor
      });

      if (index !== null) {
        that.rootObject.addChildAt(that.currentLocalPath, index);
      }
      else {
        that.rootObject.addChild(that.currentLocalPath);
      }

    });
 };
LocalPathHandler.prototype.__proto__ = EventEmitter2.prototype;

/**
   * Setup all GUI elements when the page is loaded.
   */
function init() {
// Connect to ROS.
    var target_ip = location.hostname;
    var target_url = 'ws://' + String(target_ip) + ':9191';
    var ros = new ROSLIB.Ros({
        url : target_url
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

    var global_plan_color = createjs.Graphics.getRGB(0, 255, 0);
    var local_plan_color = createjs.Graphics.getRGB(255, 0, 0);

    /* Setup path handlers */
    var global_path = GlobalPathHandler({
        ros : ros,
        rootObject : viewer.scene,
        strokeColor : global_plan_color,
        strokeSize : 0.02
    });

    var local_path = LocalPathHandler({
        ros : ros,
        rootObject : viewer.scene,
        topic : '/move_base/TebLocalPlannerROS/local_plan',
        strokeColor : local_plan_color,
        strokeSize : 0.02
    });
    
    var target_iframe = '<iframe class="videoframe" src="http://' + target_ip + ':8282/stream?topic=/cv_camera/image_raw"></iframe>';
    document.getElementById("videofeed").innerHTML=target_iframe;
}

window.onload = function(e) { init(); }
