# snowpic
Simple web image viewer

<img src="https://user-images.githubusercontent.com/118874393/204802281-0cf713d2-bd8d-4638-b456-3f171e3fee11.jpg" width="700px" />
<img src="https://user-images.githubusercontent.com/118874393/204802310-da857614-6705-4339-8462-c60771759442.jpg" width="700px" />

# Installation
This is a Node.js app available through the npm registry.

Before installing, download and install Node.js.

Installation is is easily done using the npm install command:

`$ npm i snowpic`

The command probably downloads and installs snowpic under node_modules directory.

You can leave snowpic there or move it to somewhere else.

# Web Server Configuration

This web app is originally designed to work on Nginx, however, using Nginx is not mandatory.

But why Nginx?

With a few config lines, Nginx provides autoindex that creates directories and files data list including useful information such as name, type and so on in the json format.

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

Note that all the images you want to browse are placed under a certain directory.

Make sure you move all your images to a direcotry.

Nginx will autoindex the directory and create directories and files information.

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

For example, if all your images are stored in the path of /media/storage/images, you want to set:

```
location /images {
    root /media/storage;
    autoindex on;
    autoindex_format json;
}
```

# Environment Configuration

You need to set snowpic to know where to send a request to get directories and files data.

Add these lines to env.ts file in assets directory.

```
export const IMAGE_LOCATION = {
    "name": "images"
}

export const SERVER_ADDRESS = {
    "address": "localhost"
}

export const PROTOCOL = {
    "protocol": "http"
}
```

IMAGE_LOCATION must match the location configuration of your web server above.

Do not add '/' character before and after IMAGE_LOCATION.

SERVER_ADDRESS means where you send a request to and get a response from.

If your web server and image directory are under the same IP address, you can use localhost.

Otherwise, type a specific IP address.

PROTOCOL is either of http or https depending on your web server configuration.

If you already set up SSL on the server, https is highly recommended. 

# Supported Image Formats

Currently, snowpic supports jpg, jpeg, png, and gif so far.

# Issues

If there is a CORS issue, add the header information as well underneath what you put in the web server configuration.

`add_header Access-Controll-Allow-Origin *;`

# LICENSE
<a href="https://github.com/KT-Um/core_gallery/wiki/MIT-License">MIT</a>
