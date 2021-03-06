/**
 * Setup the Networked-Aframe scene component based on query parameters
 */


AFRAME.registerComponent('dynamic-room', {
  init: function() {
    var el = this.el;
    var params = this.getUrlParams();
    var room = params.url.replace(/^https?\:\/\//i, '').replace(/^(www\.)/, "").toLowerCase()
    var baseURLData = ""
    $(function() {
      $.ajax({
        dataType: "json",
        url: 'https://screenshot-api.herokuapp.com/webshot?url=' + room + '&width=' + 1440,
        success: function(response) {
          // console.log(response)
          console.log(response.color)
          var popColor = {}
          var pop = 0
          
        $.each( response.color, function( key, value ) {
            $.each( value, function( ky, val ) {
                if(ky === "_population"){
                  if(pop < val){
                    pop = val
                    popColor = value
                  }
                }
            });    
        });
          
          // console.log(popColor._rgb.join())

          document.querySelector('a-scene').setAttribute("fog","type: exponential; color: rgb("+popColor._rgb.join()+")")
          
           function addcss(css){
              var head = document.getElementsByTagName('head')[0];
              var s = document.createElement('style');
              s.setAttribute('type', 'text/css');
              if (s.styleSheet) {   // IE
                  s.styleSheet.cssText = css;
              } else {                // the world
                  s.appendChild(document.createTextNode(css));
              }
              head.appendChild(s);
           }
          
          var class_01 = '.input:hover,.search.selected,.search.selected:hover'
          var class_05 = '.input,.search:hover,#switcher:hover'
          var class_025 = '.back,.info ul'
          var class_025b = 'input[type=text], textarea'
          var css='body{background-color:rgb('+popColor._rgb.join()+')}'
          
          // +class_025+'{background-color:rgba('+popColor._rgb.join()+',0.25)}'+class_05+'{background-color:rgba('+popColor._rgb.join()+',0.5)}'+class_01+'{background-color:rgba('+popColor._rgb.join()+',0.75)}'+class_025b+'{border-color:rgba('+popColor._rgb.join()+',0.0)}'

          function unhide() {
            // $('a-assets').append('<img id="website" crossorigin="anonymous" src="'+response.image+'">')
            $("#ground").attr("material", "src:#website; transparent: false; metalness:0.6; roughness: 0.4; sphericalEnvMap: #sky;");
            document.querySelector('#player').setAttribute('position', '0 50 0');
            document.querySelector('#player').removeAttribute("static-body");
            $(".loader").fadeOut("fast", function() {
              $(".loader").hide();
              addcss(css)
            });
          }

          var image = new Image();
          image.onload = cutImageUp;
          image.src = response.image;
          // console.log(image.src);

          var entity = document.querySelector('#block')
          var scene = document.querySelector('a-scene');

          function cutImageUp() {
            var imageWidth = image.width;
            var imageHeight = image.height;
            // console.log(image.width, image.height)
            var dimension = image.width + "px x " + image.height + "px"
            document.querySelector('.dimension span').innerHTML = dimension;

            var imagePieces = [];
            var numColsToCut = Math.round(image.width / 100);
            var numRowsToCut = Math.round(image.height / 100);
            var widthOfOnePiece = image.width / numColsToCut;
            var heightOfOnePiece = image.height / numRowsToCut
            var blockSize = 10

            for (var x = 0; x < numColsToCut; ++x) {
              for (var y = 0; y < numRowsToCut; ++y) {
                var canvas = document.createElement('canvas');
                canvas.width = widthOfOnePiece;
                canvas.height = heightOfOnePiece;
                var context = canvas.getContext('2d');
                context.drawImage(image, x * widthOfOnePiece, y * heightOfOnePiece, widthOfOnePiece, heightOfOnePiece, 0, 0, canvas.width, canvas.height);
                imagePieces.push(canvas.toDataURL());
                var data = context.getImageData(0, 0, widthOfOnePiece, heightOfOnePiece).data;
                // console.log(data)

                var rgb = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                  }, // Set a base colour as a fallback for non-compliant browsers
                  pixelInterval = 5, // Rather than inspect every single pixel in the image inspect every 5th pixel
                  count = 0,
                  i = -4,
                  data,
                  length;
                var length = data.length;
                var i = -4
                var pixelInterval = 5;

                while ((i += pixelInterval * 4) < length) {
                  count++;
                  rgb.r += data[i];
                  rgb.g += data[i + 1];
                  rgb.b += data[i + 2];
                  rgb.a += data[i + 3];
                }

                // floor the average values to give correct rgb values (ie: round number values)
                rgb.r = Math.floor(rgb.r / count);
                rgb.g = Math.floor(rgb.g / count);
                rgb.b = Math.floor(rgb.b / count);
                rgb.a = Math.floor(rgb.b / count);

                var intensity = Math.floor((0.2125 * rgb.r) + (0.7154 * rgb.g) + (0.0721 * rgb.b));

                var cube = document.createElement('a-box');
                var intensityChange = (1 - (intensity / 255))
                var alpha = 100

                cube.setAttribute('metalness', '0.6');
                cube.setAttribute('material', 'color:#fff');
                cube.setAttribute('roughness', '0.4');
                cube.setAttribute('sphericalEnvMap', '#sky');
                cube.setAttribute('static-body', '');
                cube.setAttribute('height', 1 + intensityChange * alpha);
                cube.setAttribute('width', blockSize);
                cube.setAttribute('depth', blockSize);
                cube.setAttribute('src', canvas.toDataURL());
                cube.setAttribute('id', 'x_' + x + 'y_' + y);
                cube.setAttribute('position', {
                  x: ((x - (numColsToCut / 2)) * blockSize),
                  y: (.2 + (1 - (intensity / 255)) * 15) / 2,
                  z: ((y - (numRowsToCut / 2)) * blockSize)
                });
                if (intensity < 100) {
                  cube.setAttribute('velocity', '0 0 0')
                  cube.setAttribute('toggle-velocity', {
                    axis: 'y',
                    min: 0,
                    max: (.2 + (1 - (intensity / 255)) * alpha) / 2
                  });
                }
                cube.setAttribute('id', 'x_' + x + 'y_' + y);
                entity.appendChild(cube);
                if (Math.round(Math.random()) === 1) {
                  // scene.appendChild(sphere);
                }
              }
            }
            // scene.appendChild(entity)
            // console.log(imagePieces)

          }
          // });
          unhide();
        },
        fail: function(xhr, textStatus, errorThrown) {
          alert('request failed');
        }
      });
    });

    // console.log(baseURLData)

    if (!room) {
      window.alert('Please add a room name in the URL, eg. ?room=myroom');
    }

    var webrtc = params.hasOwnProperty('webrtc');
    var adapter = webrtc
      ? 'easyrtc'
      : 'wseasyrtc';
    var voice = params.hasOwnProperty('voice');

    // Setup networked-scene
    var networkedComp = {
      room: room.replace(/ /g,'').replace(/\//g, ""),
      adapter: 'easyrtc',
      audio: true
    };
    console.info('Init networked-aframe with settings:', networkedComp);

    document.querySelector('a-scene').setAttribute('networked-scene', networkedComp);
    document.querySelector('#url').setAttribute('placeholder', room);
    document.querySelector('#switcher').setAttribute('href', window.location.href.replace("ar.html", "vr.html"));
  },

  getUrlParams: function() {
    var match;
    var pl = /\+/g; // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function(s) {
      return decodeURIComponent(s.replace(pl, ' '));
    };
    var query = window.location.search.substring(1).replace(/^https?\:\/\//i, '').replace(/^(www\.)/, "");
    var urlParams = {};

    match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
    }
    return urlParams;
  }
});