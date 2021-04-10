function drop(ev) {
  ev.preventDefault();
  var position = {
    x: ev.clientX / window.innerWidth,
    y: ev.clientY / window.innerHeight
  };
  var imageTypes = ["image/png", "image/gif", "image/bmp", "image/jpg"];
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    // ev.dataTransfer.files is a FileList
    // ev.dataTransfer.files[0].type is a Blob.type
    var fileType = ev.dataTransfer.files[0].type;
    if (imageTypes.includes(fileType)) {
      var reader = new FileReader();
      reader.onload = function(img) {
        console.log("got image drop", img.target, position);
        //displayImage(img.target);
        displayImageOnCanvas(img.target, position);
      };
      reader.readAsDataURL(ev.dataTransfer.files[0]);
    } else {
      console.log("dropped file is not an image");
    }
  }
}

function allowDrop(ev) {
  //ev.target.style.color = 'blue';
  ev.preventDefault();
}

function displayImage(imgx) {
  var cell = document.getElementById("peer-grid");
  var img = document.createElement("img");
  img.src = imgx.result;
  cell.appendChild(img);
}

function displayImageOnCanvas(imgx, pos) {
  var newx = pos.x * window.innerWidth;
  var newy = pos.y * window.innerHeight;
  if (newx > window.innerWidth || newy > window.innerHeight) {
    console.log("out of bounds!", newx, newy);
  }
  var whiteboard = document.getElementById("whiteboard");
  var ctx = whiteboard.getContext("2d");
  var img = document.createElement("img");
  img.src = imgx.result;
  img.onload = function() {
    ctx.drawImage(img, newx, newy);
    // network share
    if (ctl) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var newctx = canvas.getContext("2d");
      newctx.drawImage(img, 0, 0);
      canvas.toBlob(function(blob) {
        ctl.sendPic(blob, null, { pos: pos, peerId: ctl.peerId });
      });
    }
  };
}

var navState = false;
function openNav() {
  if(navState){ closeNav(); return }
  document.getElementById("mySidenav").style.width = "200px";
  navState = true;
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  navState = false;
}
