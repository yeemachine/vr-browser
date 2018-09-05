# VR/AR Browser

VR/AR Browser is an interactive multi-user web experience that transforms websites into navigable 3D environments. The size of each environment depends on the user's browser size and the length of each webpage. Users that load up the same webpage are able to see and voice chat one another. This experiment is heavily inspired by [World Wide Maze](https://experiments.withgoogle.com/world-wide-maze) and the ever popular [VR Chat](https://vrchat.net/). 

In addition to its VR components, AR mode gives the user a top-down admin-like view of all the players on a particular website. 

Demo the site at [vr-browser.herokuapp.com](https://vr-browser.herokuapp.com/).

Project started in Erin Sparling's class at Cooper Union.

Sources
-------

**Networked A-Frame**

Built with [Networked-A-Frame](https://github.com/haydenjameslee/networked-aframe), a web framework for building multi-user virtual reality experiences. Works on Vive, Rift, desktop, mobile platforms.
Networked-A-Frame also uses [WebRTC](https://webrtc.org/) for multi-user voice chatting.

Click and use 'WASD' keys on desktop. Open it on a smartphone and use the device motion sensors. Or [plug in a VR headset](https://webvr.rocks)!


**AR.js**

AR mode built with [AR.js](https://github.com/jeromeetienne/AR.js), a library that brings AR to Aframe. 


**Node Webshot**

Web screenshots are taken with [Node-Webshot](https://github.com/brenden/node-webshot), used in this simple single-use api [screenshot-api](https://github.com/yeemachine/screenshot-api).

**Glitch**

Prototype made on [Glitch](https://glitch.com/edit/#!/vr-browser).