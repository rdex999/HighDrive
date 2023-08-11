# HomeDrive
A "cloud" drive on your local network that you can sign in to using a user-name and a password to store files.  
Writen in Html and Javascript, using Mongodb as the database and Nodejs with Express for the server.  
  
The server can be accessed on your local network, `http://<ServersIp>:8080`  
Replace `<ServersIp>` with the servers ip address.  

## Installation instructions
First install mongodb (depending on your os, this step could be different)  
example for arch linux:  
```
sudo pacman -S yay
yay -S mongodb-bin
```
Then enable and start the mongodb service (again, this may be different depending on your os.)  
example for arch linux:  
```
sudo systemctl enable --now mongodb
```

Clone the repo:  
```
git clone https://github.com/rdex999/HomeDrive.git
```

Cd into the HomeDrive directory  
```
cd HomeDrive
```

Install npm and nodejs (again, this may be different depending on your os.)  
example for arch linux:  
```
sudo pacman -S nodejs npm
```

Install the npm pakages:  
```
npm install
```

Install mongodb-compass for a graphical user interface for managing the database  
(again, this may be different depending on your os.)  
example for arch linux:  
```
yay -S mongodb-compass
```

Launch mongodb-compass and click on connect,  
in the left panel click on the plus (+) icon,  
under "Database Name" type exactly "HomeDrive",  
under "Collection Name" type exacly "users",  
click on "Create Database".  

And thats it!  

you can start the server by running:  
```
node Server.js
```

to access the website enter the following:  
`http://<ServersIp>:8080`
Replace `<ServersIp>` with the Servers ip address (can be obtained from running `ifconfig` on linux)  
