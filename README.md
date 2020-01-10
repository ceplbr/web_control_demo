# web_control_demo
This is demo project showcasing tablet (or any browser) control of Breach robot.

## Configuration info
* [Configuring Django with Apache on Raspberry Pi](https://mikesmithers.wordpress.com/2017/02/21/configuring-django-with-apache-on-a-raspberry-pi/)
* [Apache mod_proxy guide](https://www.digitalocean.com/community/tutorials/how-to-use-apache-as-a-reverse-proxy-with-mod_proxy-on-ubuntu-16-04)
* Optional: [Writing your first Django app](https://docs.djangoproject.com/en/2.2/intro/tutorial01/)

## External ROS modules
This runs on target robot
* [rosbridge_suite](http://wiki.ros.org/rosbridge_suite)
* [web_video_server](https://wiki.ros.org/web_video_server)
* [cv_camera](http://wiki.ros.org/cv_camera)
* [robot_pose_publisher](https://github.com/GT-RAIL/robot_pose_publisher.git)
    * `git clone https://github.com/GT-RAIL/robot_pose_publisher.git` in `~/catkin_ws/src/`
    * `catkin_make`

## Installation (not tested)
1. Clone this repo into home directory
2. Configure python virtual enviroment (Python 3.6.8)
    * (run `virtualenv venv` in web_control_demo folder)
3. Install and Configure Django
4. Configure Apache (example config in `external_files` can be used, change paths to correct user)
    * `sudo a2enmod proxy`
    * `sudo a2enmod proxy_http`
    * `sudo a2enmod proxy_balancer`
    * `sudo a2enmod lbmethod_byrequests`
    * To put these changes into effect, restart Apache.
    * `sudo systemctl restart apache2`

5. Run needed nodes on robot (example launchfile in `external_files` can be used)
 * `roslaunch 
6. Site can be accesed at `localhost` or via target IP address

## Ports
Main server runs on port 80 (default)

rosbridge_server runs on `localhost:9090` (rosbridge default), Apache provides proxy route from port `9191` (for outside access)

Web_video_server runs on `localhost:8181` (default=8080, changed in launchfile), Apache provides proxy route from port `8282` (for outside access)
