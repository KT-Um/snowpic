# snowpic
Simple web-based media viewer

# Key Features
## Enjoy your images and videos on the web anywhere
- Browse directories, images and videos on the web
- Show images and videos
- Mobile, PC and TV compatible

[Show image]

<img src="https://user-images.githubusercontent.com/118874393/211566275-00104370-c540-43c4-9d5d-a659c90d6d1c.jpg" width="700px" />

[Browse directories and files]

<img src="https://user-images.githubusercontent.com/118874393/211566637-f15daf27-f561-49f6-af0e-47b26c2e7df4.jpg" width="700px" />

[Show image on mobile]

<img src="https://user-images.githubusercontent.com/118874393/211568272-eb660420-458b-4ea2-bf8a-7e778f0b57d5.jpg" width="300px" />

## It`s easy, just use it now
- Finger touch, mouse wheel, keyboard and touchpad inputs are available
- Thumbnails helps the easy navigation
- Video control and autoplay are supported

[Video play]

<img src="https://user-images.githubusercontent.com/118874393/211565848-9398c982-b4f6-490e-b210-710ba148e9a6.jpg" width="700px" />

[Video play on mobile]

<img src="https://user-images.githubusercontent.com/118874393/211568315-a8d15e37-8b69-4c48-896a-2b6653d1442f.jpg" width="300px" />

## Easy to deploy
- No server app required - Nginx, that's all!
- Download once and deploy anywhere - sub-path is supported (see Path-independency Configuration)

# Installation
This is a Node.js app available through the npm registry.
Before installing, download and install Node.js.
Installation is is easily done using the npm install command:
`$ npm i snowpic`
The command downloads and installs snowpic under node_modules directory.
You can leave snowpic there or move it to somewhere else.
# Web Server Configuration
This web app is originally designed to work on Nginx, however, using Nginx is not mandatory.
But why Nginx?
With a few config lines, Nginx provides the autoindex function that creates directories and files data list including useful information such as name, type and so on in the json format.
- Properties: name, type, mtime, size
- JSON Data Example:
```
[
	{ "name":"node-modules", "type":"directory", "mtime":"Sat, 09 Apr 2019 08:51:52 GMT" },
	{ "name":"dist", "type":"directory", "mtime":"Sat, 09 Apr 2020 08:52:27 GMT" },
	{ "name":"helloworld", "type":"directory", "mtime":"Fri, 17 Feb 2018 22:27:21 GMT" },
	{ "name":"tools.zip", "type":"file", "mtime":"Sat, 16 Apr 2016 01:34:08 GMT", "size":121592817 },
	{ "name":"package.json", "type":"file", "mtime":"Sat, 16 Apr 2016 01:33:25 GMT", "size":4470 },
]
```
Note that all the images and videos you want to browse are placed under a certain directory.
Make sure you move all your images and videos to a direcotry.
Nginx will autoindex the directory and generate directories and files information.
Add the following lines to nginx.conf or another conf file under sites-available.
```
server {
	location / {
		root [type here the full path of directory where contains index.html];
	}

	location [type here the directory name that contains image files ] {
		root [type here the full path directory excluding the last directory name];
		autoindex on;
		autoindex_format json;
	}
}
```
For example, if all your images and videos are stored in the path of /media/storage/images, you want to set:
```
location /images {
    root /media/storage;
    autoindex on;
    autoindex_format json;
}
```
# Environment Configuration
You need to set snowpic to know where to send a request to get directories and files data.
Find and define some of these parameters from environment.json file in assets directory.
```
[
    {
        "category": "server",
        "content_location": "specify the directory name that contains your photos",
        "server_address": "specify the IP address of your server",
        "protocol": "http"
    },
    {
        "category": "app",
        "app_name": "snowpic",
        "app_title_bar": "true",
        "supported_formats" : "jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|mp4|MP4",
        "supported_image_formats" : "jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF",
        "supported_video_formats" : "mp4|MP4",
        "dialog" : {
            "dialog_close_button": "true",
            "content_width": "100vw",
            "content_height": "100vh",
            "content_max_width": "100vw",
            "content_max_height": "100vh",
            "show_thumbnails": "true"
        }
    }
]
```
content_location must match the location configuration of your web server above.
Make sure that you do not add '/' character before and after content_location.
server_address means where you send a request to and get a response from.
If your web server and image directory are under the same IP address, you can use localhost.
Otherwise, type a specific IP address.
protocol is either of http or https depending on your web server configuration.
If you already set up SSL on the server, https is highly recommended.
# Path-independency Configuration
If you want to deploy this application to serveral paths, it is now available.
Without setting each base-href and rebuilding(ng build), you can deploy it right away under serveral sub-paths like as below.
```
http://localhost/a
http://localhost/b
http://localhost/c
```
What you only need is to edit the web server configuration to specify the sub-paths you want to deploy under.
```
location [type here a sub-path where the app is installed] {
	root [type here the full path of directory where contains index.html];
}
```
For example, this below configuration means that index.html of the app is under /var/www/snowpic/ directory and you can access it through *http(s)://url/snowpic*.
```
location /snowpic/ {
	root /var/www;
}
```
# Supported Media Formats
Currently, snowpic supports both of image and video.
You can extend or shrink it. See Environment Configuration.
- Supported image formats: jpg, jpeg, png, and gif
- Supported video formats : mp4, ogg, webm
# Supported Input Event handling
For mobile, left and right touch slide events are implemented.
For PC, keyboard input, touchpad and mouse wheel work as well.
# CORS issue
To handle the CORS issue, add the header information as well underneath what you put in the web server configuration.
`add_header Access-Controll-Allow-Origin *;`
# LICENSE
<a href="https://github.com/KT-Um/core_gallery/wiki/MIT-License">MIT</a>