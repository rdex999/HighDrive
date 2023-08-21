# HighDrive
A "cloud" drive on your local network that you can sign in to using a user-name and a password to store files.  
I used Nodejs for the server, Express for the api, Mongodb for the database, React for the frontend framework, and bootstrap for styling.  

![Screenshot from 2023-08-21 16-21-26](https://github.com/rdex999/HighDrive/assets/78908040/bef2986c-6210-4849-82c5-563f7f5acc2d)

The server can be accessed on your local network, `http://<ServersIp>:8080`  
Replace `<ServersIp>` with the servers ip address.  

## Installation instructions
First install mongodb (depending on your os, this step could be different)  
example for arch linux:  
```
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
yay -S mongodb-bin
```
Then enable and start the mongodb service (again, this may be different depending on your os.)  
example for arch linux:  
```
sudo systemctl enable --now mongodb
```

Clone the repo:  
```
git clone https://github.com/rdex999/HighDrive.git
```

Cd into the HighDrive/backend directory  
```
cd HighDrive/backend
```

Install npm and nodejs (again, this may be different depending on your os.)  
example for arch linux:  
```
sudo pacman -S nodejs npm
```

Install the npm pakages for the server:  
```
npm install
```

Cd to the frontend directory:
```
cd ../frontend
```

Install the npm packages for the frontend:
```
npm install
```

Cd again into the backend directory:
```
cd ../backend
```

Install mongodb-compass for a graphical user interface for managing the database  
(again, this may be different depending on your os.)  
example for arch linux:  
```
yay -S mongodb-compass
```

Launch mongodb-compass and click on connect,  
in the left panel click on the plus (+) icon,  
under "Database Name" type exactly: "HighDrive",  
under "Collection Name" type exacly: "users",  
click on "Create Database".  

And thats it!  

you can start the server by running:  
```
node Server.js
```

to access the website enter the following:  
`http://<ServersIp>:8080`
Replace `<ServersIp>` with the Servers ip address (can be obtained from running `ifconfig` on linux)  
