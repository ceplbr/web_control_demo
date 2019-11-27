# web_control_demo
This is demo project showcasing tablet (or any browser) control of Breach robot.

## Configuration info
* [Configuring Django with Apache on Raspberry Pi](https://mikesmithers.wordpress.com/2017/02/21/configuring-django-with-apache-on-a-raspberry-pi/)
* Optional: [Writing your first Django app](https://docs.djangoproject.com/en/2.2/intro/tutorial01/)

## External ROS modules
This runs on target robot
* [rosbridge_suite](http://wiki.ros.org/rosbridge_suite)
* [web_video_server](https://wiki.ros.org/web_video_server)
* [cv_camera](http://wiki.ros.org/cv_camera)

## Installation (not tested)
1. Clone this repo
2. Configure python virtual enviroment (Python 3.6.8)
3. Install and Configure Django
4. Configure Apache (example config in `external_files` can be used)
5. Run needed nodes on robot (example launchfile in `external_files` can be used)
6. Site can be accesed at `localhost` or via target IP address

## Ports
Main server runs on port 80 (default)

rosbridge_server runs on `localhost:9090` (rosbridge default), Apache provides proxy route from port `9191` (for outside access)

Web_video_server runs on `localhost:8181` (default=8080, changed in launchfile), Apache provides proxy route from port `8282` (for outside access)