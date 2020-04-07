const btn_selections = {
    ESTIMATE: 'btn_estimate',
    GOAL: 'btn_goal',
    PAN: 'btn_pan',
    ZOOM: 'btn_zoom'
}

var selected_action = btn_selections.PAN;

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

NavPanner = function(options) {
    var that = this;
    options = options || {};
    var ros = options.ros;
    var serverName = options.serverName || '/move_base';
    var actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
    this.rootObject = options.rootObject || new createjs.Container();
    this.viewer = options.viewer;

    // get a handle to the stage
    var stage;
    if (that.rootObject instanceof createjs.Stage) {
      stage = that.rootObject;
    } else {
      stage = that.rootObject.getStage();
    }
  
    var pan_obj = new ROS2D.PanView({
        rootObject: that.viewer.scene
    });

    // setup a click-and-point listener (with orientation)
    var position = null;
    var mouseDown = false;

    var panMouseEventHandler = function(event, mouseState) {
  
        if (mouseState === 'down'){
          // get position when mouse button is pressed down
          position = stage.globalToRos(event.stageX, event.stageY);
          positionVec3 = new ROSLIB.Vector3(position);
          mouseDown = true;
          console.info('panning started now!');
          console.info(event.stageX);
          console.info(event.stageY);
          if (btn_selections.PAN == window.selected_action){
            pan_obj.startPan(event.stageX, event.stageY);
          };
        }
        else if (mouseState === 'move'){
          if ( mouseDown === true) {
            // if mouse button is held down:
            // - get current mouse position
            var currentPos = stage.globalToRos(event.stageX, event.stageY);
            var currentPosVec3 = new ROSLIB.Vector3(currentPos);
            if (btn_selections.PAN == window.selected_action){
                pan_obj.pan(event.stageX, event.stageY);
            };
          }
        } else if (mouseDown) { // mouseState === 'up'
          mouseDown = false;
        }
      };
  
      this.rootObject.addEventListener('stagemousedown', function(event) {
        panMouseEventHandler(event,'down');
      });
  
      this.rootObject.addEventListener('stagemousemove', function(event) {
        panMouseEventHandler(event,'move');
      });
  
      this.rootObject.addEventListener('stagemouseup', function(event) {
        panMouseEventHandler(event,'up');
      });
};

NavZoomer = function(options) {
    var that = this;
    options = options || {};
    var ros = options.ros;
    var serverName = options.serverName || '/move_base';
    var actionName = options.actionName || 'move_base_msgs/MoveBaseAction';
    this.rootObject = options.rootObject || new createjs.Container();
    this.viewer = options.viewer;

    // get a handle to the stage
    var stage;
    if (that.rootObject instanceof createjs.Stage) {
      stage = that.rootObject;
    } else {
      stage = that.rootObject.getStage();
    }
  
    var zoom_obj = new ROS2D.ZoomView({
        rootObject: that.viewer.scene
    });

    // setup a click-and-point listener (with orientation)
    var position = null;
    var mouseDown = false;
    var oldY = 0;

    var zoomMouseEventHandler = function(event, mouseState) {
  
        if (mouseState === 'down'){
          // get position when mouse button is pressed down
          position = stage.globalToRos(event.stageX, event.stageY);
          positionVec3 = new ROSLIB.Vector3(position);
          mouseDown = true;
          console.info('zooming started now!');
          console.info(event.stageX);
          console.info(event.stageY);
          if (btn_selections.ZOOM == window.selected_action){
            zoom_obj.startZoom(event.stageX, event.stageY);
            oldY = event.stageY;
          };
        }
        else if (mouseState === 'move'){
          if ( mouseDown === true) {
            // if mouse button is held down:
            // - get current mouse position
            var currentPos = stage.globalToRos(event.stageX, event.stageY);
            var currentPosVec3 = new ROSLIB.Vector3(currentPos);
            if (btn_selections.ZOOM == window.selected_action){
                zoom_obj.zoom(((oldY - event.stageY)/200) + 1);
            };
          }
        } else if (mouseDown) { // mouseState === 'up'
          mouseDown = false;
        }
      };
  
      this.rootObject.addEventListener('stagemousedown', function(event) {
        zoomMouseEventHandler(event,'down');
      });
  
      this.rootObject.addEventListener('stagemousemove', function(event) {
        zoomMouseEventHandler(event,'move');
      });
  
      this.rootObject.addEventListener('stagemouseup', function(event) {
        zoomMouseEventHandler(event,'up');
      });
};

/**
   * Setup all GUI elements when the page is loaded.
   */
function init() {
// Connect to ROS.
    var target_ip = location.hostname;
    var target_url = 'ws://' + String(target_ip) + ':9090';
    var ros = new ROSLIB.Ros({
        url : target_url
    });
    var tpc = new ROSLIB.Topic({
        ros : ros,
        name : '/map_metadata',
        messageType : 'nav_msgs/MapMetaData'
    });

    tpc.subscribe(function(message) {
        console.log('Received message on ' + tpc.name + ': ' + console.dir(message));
        tpc.unsubscribe();
    });
    
    var canvas_w = Math.round(screen.width*0.8);
    var canvas_h = Math.round(screen.height*0.75);

    document.getElementById("l-controls").style.height = String(canvas_h)+'px'; 
    document.getElementById("r-controls").style.height = String(canvas_h)+'px'; 
    
    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
        divID : 'nav',
        width : canvas_w,
        height : canvas_h,
        background: '#7F7F7F'
    });
    
    function color_active_button(button_id) {
        document.getElementById('btn_estimate').style.backgroundColor = 'blue';
        document.getElementById('btn_goal').style.backgroundColor = 'blue';
        document.getElementById('btn_pan').style.backgroundColor = 'blue';
        document.getElementById('btn_zoom').style.backgroundColor = 'blue';
        document.getElementById(button_id).style.backgroundColor = 'green';
    };

    var panner = new NavPanner({
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
    });

    var zoomer = new NavZoomer({
        ros : ros,
        rootObject : viewer.scene,
        viewer : viewer,
    });

    color_active_button(selected_action);

    document.getElementById('btn_estimate').addEventListener("click", function(){ 
        selected_action = btn_selections.ESTIMATE;
        color_active_button(selected_action);
    });

    document.getElementById('btn_goal').addEventListener("click", function(){ 
        selected_action = btn_selections.GOAL;
        color_active_button(selected_action);
    });

    document.getElementById('btn_pan').addEventListener("click", function(){ 
        selected_action = btn_selections.PAN;
        color_active_button(selected_action);
    });

    document.getElementById('btn_zoom').addEventListener("click", function(){ 
        selected_action = btn_selections.ZOOM;
        color_active_button(selected_action);
    });

    document.getElementById('btn_estimate').addEventListener("touchend", function(){ 
        selected_action = btn_selections.ESTIMATE;
        color_active_button(selected_action);
    });

    document.getElementById('btn_goal').addEventListener("touchend", function(){ 
        selected_action = btn_selections.GOAL;
        color_active_button(selected_action);
    });

    document.getElementById('btn_pan').addEventListener("touchend", function(){ 
        selected_action = btn_selections.PAN;
        color_active_button(selected_action);
    });

    document.getElementById('btn_zoom').addEventListener("touchend", function(){ 
        selected_action = btn_selections.ZOOM;
        color_active_button(selected_action);
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

    var global_localization_client = new ROSLIB.Service({
        ros : ros,
        name : '/global_localization',
        serviceType : 'std_srvs/Empty'
    });

    var start_motor_client = new ROSLIB.Service({
        ros : ros,
        name : '/start_motor',
        serviceType : 'std_srvs/Empty'
    });

    var stop_motor_client = new ROSLIB.Service({
        ros : ros,
        name : '/stop_motor',
        serviceType : 'std_srvs/Empty'
    });

    var lidar_state = true;
    function toggle_lidar(){
        if (true == lidar_state){
            lidar_state = false;
            stop_motor_client.callService();
        }
        else {
            lidar_state = true;
            start_motor_client.callService();
        }
    };

    function shutdown(){
        var shutdown_pub = new ROSLIB.Topic({
            ros : ros,
            name : '/shutdown_signal',
            messageType : 'std_msgs/String'
          });
        
        var sd_msg = new ROSLIB.Message({
            data: 'Shutdown'
          });
        var proceed = confirm('Are you sure?');
        if (proceed) {
            console.info('shutting down the robot');
            shutdown_pub.publish(sd_msg);
        };
    }

    document.getElementById('btn_localize').addEventListener("click", function(){ 
        global_localization_client.callService();
    });

    document.getElementById('btn_localize').addEventListener("touchend", function(){ 
        global_localization_client.callService();
    });

    document.getElementById('btn_lidar').addEventListener("click", function(){ 
        toggle_lidar();
    });

    document.getElementById('btn_lidar').addEventListener("touchend", function(){ 
        toggle_lidar();
    });

    document.getElementById('btn_shutdown').addEventListener("click", function(){ 
        shutdown();
    });

    document.getElementById('btn_shutdown').addEventListener("touchend", function(){ 
        shutdown();
    });
    
    
    //var target_iframe = '<iframe class="videoframe" src="http://' + target_ip + ':8282/stream?topic=/cv_camera/image_raw"></iframe>';
    //document.getElementById("videofeed").innerHTML=target_iframe;
}

window.onload = function(e) { init(); }
