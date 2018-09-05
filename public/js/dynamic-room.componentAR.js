/**
 * Setup the Networked-Aframe scene component based on query parameters
 */

// AFRAME.registerComponent('suntime', {
//   schema: {
//     from: {type:'vec3', default: {x: 0, y: 1, z: -0.2}},
//     to: {type: 'vec3', default: {x: 0, y: 1, z: 0.2}},
//     duration: {type: 'int', default: 5000}
//   },
//   update: function(oldData){
//     this.sunPos = {x: this.data.from.x, y: this.data.from.y, z: this.data.from.z};
//     // this.moveSun();
//     this.tween = new AFRAME.TWEEN.Tween(this.sunPos).
//       to(this.data.to, this.data.duration).
//       start();
//   },
//    tick: function (t) {
//      var p = this.sunPos;
//      var angle = (Math.sin(t/10000)+1)/2;
//      // console.log(Math.sin(t/10000)+1)
//      this.el.setAttribute('environment', {lightPosition: {x: p.x, y: p.y*angle, z: p.z}});
//   // console.log(t)
//  }
// });

AFRAME.registerComponent('sunMove', {
 schema: {},
 tick: function (t) {
   var p = this.sunPos;
     var angle = (Math.sin(t/10000)+1)/2;
     // console.log(Math.sin(t/10000)+1)
     this.el.setAttribute('environment', {lightPosition: {x: 0, y: 0.01+0.2*angle, z: .3}});
 }
})

AFRAME.registerComponent('reality', {
 schema: {
    value: {default: 'ar'},
 },
  update: function(){
    this.el.setAttribute('reality', 'ar')
  }
})

AFRAME.registerComponent('dynamic-room', {
  init: function () {
    var el = this.el;
    var params = this.getUrlParams();
    var room = params.url.replace(/^https?\:\/\//i, '').replace(/^(www\.)/,"")
    var baseURLData = ""
     $(function() {
            console.log( "ready!" );
          $.ajax({
            dataType: "json",
 url: 'https://screenshot-api.herokuapp.com/webshot?url='+room+'&width='+1440,
            success: function(response) {
           console.log(response)
                  
              function unhide(){
                // $('a-assets').append('<img id="website" crossorigin="anonymous" src="'+response.image+'">')
                $("#ground").attr("material","src:#website; transparent: false; metalness:0.6; roughness: 0.4; sphericalEnvMap: #sky;");
                document.querySelector('#player').setAttribute('position', '0 50 0');
                document.querySelector('#player').removeAttribute("static-body");
                $(".loader").fadeOut( "slow", function() {
                  $(".loader").hide();
                });  
              }
              
              // function toDataUrl(url, callback) {
              // var xhr = new XMLHttpRequest();
              // xhr.onload = function() {
              //   var reader = new FileReader();
              //   reader.onloadend = function() {
              //       callback(reader.result);
              //   }
              //   reader.readAsDataURL(xhr.response);
              // };
              // xhr.open('GET', url);
              // xhr.responseType = 'blob';
              // xhr.send();
              // }
              
              // toDataUrl(response.image, function(myBase64) {
              // unhide();
              // console.log(myBase64); // myBase64 is the base64 string

              var image = new Image();
              image.onload = cutImageUp;
              image.src = response.image;
              console.log(image.src);
              
              var entity = document.querySelector('#block')
              var scene = document.querySelector('a-scene');

              function cutImageUp() {
                 var imageWidth = image.width;
                  var imageHeight = image.height;
                  // console.log(image.width, image.height)
                  var dimension = image.width + "px x " + image.height + "px"
                  document.querySelector('.dimension span').innerHTML = dimension;    
                
                  var imagePieces = [];
                  var numColsToCut = Math.round(image.width/100);
                  var numRowsToCut = Math.round(image.height/100);
                  var widthOfOnePiece = image.width/numColsToCut;
                  var heightOfOnePiece = image.height/numRowsToCut
                  var blockSize = 10
                  
                  for(var x = 0; x < numColsToCut; ++x) {
                      for(var y = 0; y < numRowsToCut; ++y) {
                          var canvas = document.createElement('canvas');
                          canvas.width = widthOfOnePiece;
                          canvas.height = heightOfOnePiece;
                          var context = canvas.getContext('2d');
                          context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
                          imagePieces.push(canvas.toDataURL());
                          var data = context.getImageData(0, 0, widthOfOnePiece, heightOfOnePiece).data;
                          // console.log(data)
                        
                        var rgb = {r:0,g:0,b:0,a:0}, // Set a base colour as a fallback for non-compliant browsers
                            pixelInterval = 5, // Rather than inspect every single pixel in the image inspect every 5th pixel
                            count = 0,
                            i = -4,
                            data, length;
                           var length = data.length;
                            var i = -4
                            var pixelInterval = 5;
                            
                            while ((i += pixelInterval * 4) < length) {
                              count++;
                              rgb.r += data[i];
                              rgb.g += data[i+1];
                              rgb.b += data[i+2];
                              rgb.a += data[i+3];
                            }

                            // floor the average values to give correct rgb values (ie: round number values)
                            rgb.r = Math.floor(rgb.r/count);
                            rgb.g = Math.floor(rgb.g/count);
                            rgb.b = Math.floor(rgb.b/count);
                            rgb.a = Math.floor(rgb.b/count);
                        
                          var intensity = Math.floor((0.2125 * rgb.r) + (0.7154 * rgb.g) + (0.0721 * rgb.b));
                        
                          var cube = document.createElement('a-box');
                          var intensityChange = (1-(intensity/255))
                          var alpha = 100
                          
                          cube.setAttribute('metalness', '0.6');
                          cube.setAttribute('material', 'color:#fff');
                          cube.setAttribute('roughness', '0.4');
                          cube.setAttribute('sphericalEnvMap', '#sky');
                          cube.setAttribute('static-body','');
                          cube.setAttribute('height', 1+intensityChange*alpha);
                          cube.setAttribute('width', blockSize);
                          cube.setAttribute('depth', blockSize);
                          cube.setAttribute('src', canvas.toDataURL()); 
                          cube.setAttribute('id', 'x_'+x+'y_'+y);
                          cube.setAttribute('position', {
                              x: ((x-(numColsToCut/2))*blockSize),
                              y: 0,
                              z: ((y-(numRowsToCut/2))*blockSize)
                            });
                          if(intensity < 100){
                            cube.setAttribute('velocity','0 0 0')
                            cube.setAttribute('toggle-velocity', {
                              axis: 'y',
                              min: 0,
                              max: (.2+ (1-(intensity/255))*alpha)/2
                            });
                          }
                          cube.setAttribute('id', 'x_'+x+'y_'+y);
                          entity.appendChild(cube);
                          if(Math.round(Math.random()) === 1){
                            // scene.appendChild(sphere);
                          }
                      }
                  }
                  scene.appendChild(entity)
                // console.log(imagePieces)
           
              }
         // });
            unhide();
          },
            fail: function(xhr, textStatus, errorThrown){
               alert('request failed');
            }
          });
          });
         
      console.log(baseURLData)

    
    
    if (!room) {
      window.alert('Please add a room name in the URL, eg. ?room=myroom');
    }

    var webrtc = params.hasOwnProperty('webrtc');
    var adapter = webrtc ? 'easyrtc' : 'wseasyrtc';
    var voice = params.hasOwnProperty('voice');
    
    // Setup networked-scene
    var networkedComp = {
      room: room.replace(/\//g, "-"),
      adapter: 'easyrtc',
      audio: true
    };
    console.info('Init networked-aframe with settings:', networkedComp);
    
    document.querySelector('a-scene').setAttribute('networked-scene', networkedComp);
    document.querySelector('#url').setAttribute('placeholder', room);
    document.querySelector('#switcher').setAttribute('href', window.location.href.replace("ar.html", "vr.html"));
  },

 getUrlParams: function () {
    var match;
    var pl = /\+/g;  // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    var query = window.location.search.substring(1).replace(/^https?\:\/\//i, '').replace(/^(www\.)/,"");
    var urlParams = {};

    match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }
    return urlParams;
  }
});