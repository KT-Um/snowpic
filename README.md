# core_gallery
Simple photo viewer based on nginx

# Installation
This is a Node.js app available through the npm registry.

Before installing, download and install Node.js.

Installation is done using the npm install command:

`$ npm install coregallery`

You will probably see the coregallery directory in node-modules.

You can leave or move it to somewhere else.

If you try to ng build in this stage, you will face an error - node-modules does not exist.

Run npm install in the coregallery directory to install node-modules.

`$ npm install`

The last step is ng build in the directory generating the dist directory.

`$ ng build`

# Nginx Configuration

This web app is simply designed to work on Nginx. But it is not mandatory.

Why Nginx?

Nginx provides autoindex that creates directories and files list including useful information such as names, type and so on as a json format.

- Properties: name, type, mtime, size

- Example:
[
{ "name":"node-modules", "type":"directory", "mtime":"Sat, 09 Apr 2019 08:51:52 GMT" },
{ "name":"dist", "type":"directory", "mtime":"Sat, 09 Apr 2020 08:52:27 GMT" },
{ "name":"helloworld", "type":"directory", "mtime":"Fri, 17 Feb 2018 22:27:21 GMT" },
{ "name":"tools.zip", "type":"file", "mtime":"Sat, 16 Apr 2016 01:34:08 GMT", "size":121592817 },
{ "name":"package.json", "type":"file", "mtime":"Sat, 16 Apr 2016 01:33:25 GMT", "size":4470 },
]

Note that all the photos you want to broswe are under 'Photo' directory.

Make sure you move photos to Photo direcotry.

Nginx will autoindex the Photo directory and create directories and files information.

Add the following lines to nginx.conf or a conf file under sites-available.

`server {
  location / {
    root [type here the directory where contains![screenshot-1](https://user-images.githubusercontent.com/118874393/204101787-6bc6fa48-fd2e-4107-9fd6-54cdc7f0c886.jpg)
![screenshot-2](https://user-images.githubusercontent.com/118874393/204101791-731f5684-e0c0-44a6-8823-0287780d2215.jpg)
 index.html];
  }

  location /Photo {
    root [type here the directory that has the Photo directory as a child];
    autoindex on;
    autoindex_format json;
  }
}`

If there is a CORS issue, add the header information as well underneath what you put above.

`add_header Access-Controll-Allow-Origin *;`
