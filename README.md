## 🎉 Congratulations Virtual tryon converted to node.js environment & working with latest browser, removed the flash fallback & many more 🎉

# Virutal-tryon
A virtual tryon(mirror) script for optical ecommerce

This Try on solution has server so many Eyeglasses Stratup and companies around the world but now it is free and open source.

You can change the design and appearance of Tryon as per your website looks. It's also mobile and tablets ready. This script can help your customers clients to save so much money on rejections of glasses by providing them Try before by buy solution.

### Automatically detects eyes and put the frame
![Auto Eye detection](https://raw.githubusercontent.com/ninesystems/Virtual-tryon/master/showcase/eyedetection.jpg)

### Easily customizable 
![Customization options](https://raw.githubusercontent.com/ninesystems/Virtual-tryon/master/showcase/customize.png)

### Works on Mobile devices as well
![Works with mobile](https://raw.githubusercontent.com/ninesystems/Virtual-tryon/master/showcase/mobileready.png)


## Tasks List

- [x] Change the structure, add webpack to complie JS files 
- [x] Add PD measurement & frame fitting algorithm
- [x] Remove License Screen, previously added when it was a paid software.
- [x] Add a logo so we can grow community
- [x] Make easily integrateable like any jquery plugin.
- [x] Remove junk files & data.
- [ ] Make analytics working so people could know which frame has highest hits.


### How to Build
clone the repo
```
git clone https://github.com/ninesystems/Virtual-tryon
```
then 
``` cd Virutal-tryon ```
then 

```
npm install

or

yarn
```

Once done

run the command

```
npm run build

or

yarn build
```

It will make a public folder which is your files to run the tryon.

### how to try
Open the public folder & run the index.html file in browser, make sure if you can roll index.html from a server, like localhost

or use http-server to run the index.html file.

here is the sequence to roll the server
```
npm i -g http-server
or 
yarn global add http-server
````

once done run the command (assuming you are in Virtual-tryon folder)
``` 
http-server -p 3000 ./public -o http://localhost:3000/index.html
```

### For Developers 
```
npm run dev
or
yarn dev
```
the above command will roll the server & you can start making changes to tryon.

### Settings options

there is a ``` settings.js ``` file in ``` assets/js ``` folder, feel free to edit that as thats selef explainatory.
will add some docuement on those settings soon.

### Problems & Solutions
if your build in not running as you want, please feel free to open an issue. i will try to respond you ASAP.

### Marketing & Help
If possible please help me to promote this virtual tryon, I am continously working with development from now. i would be happy if you join my hand to promote this so maximum people can take benefit of this piece of code without paying a single panny.

### We are looking for contributors
if you know how to make wordpress or magento or shopify modules, you can contribute to this repo, we are planing to launch these modules, so the optician community can launch their ecommerce easily & quickly.

## this tryon is sponcered by [NineSystems](https://ninesystems.in)
NineSystems is a company working with engineering in Optical vision, IoT devices & Cloud Infra.
