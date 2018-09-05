function getURL() {
  console.log('hi')
    var match;
    var pl = /\+/g;  // Regex for replacing addition symbol with a space
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
    var query = window.location.search.substring(1);
    var query2 = window.location.search.substring(0);
    console.log(query2)
    var urlParams = {};

    match = search.exec(query);
    while (match) {
      urlParams[decode(match[1])] = decode(match[2]);
      match = search.exec(query);
      console.log(urlParams)
    //   var networkedComp = {
    //   room: urlParams.room.replace(/^https?\:\/\//i, '').replace(/^(www\.)/,"").replace(/\//g, "-"),
    //   adapter: 'easyrtc',
    //   audio: true
    // }
    // document.querySelector('a-scene').setAttribute('networked-scene', networkedComp);
    // document.querySelector('#player .nametag').setAttribute('text', 'value:'+urlParams.username);

      
    }
    return urlParams;
  }