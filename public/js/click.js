var button = document.querySelector("i.search");
button.addEventListener("click",function(e){
  this.classList.toggle('selected');
   document.querySelector(".info").classList.toggle('selected');
},false);