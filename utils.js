 function drop(ev) {
  ev.preventDefault();
  var imageTypes = ['image/png', 'image/gif', 'image/bmp', 'image/jpg'];
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    // ev.dataTransfer.files is a FileList
    // ev.dataTransfer.files[0].type is a Blob.type
    var fileType = ev.dataTransfer.files[0].type;
    if (imageTypes.includes(fileType)) {
      var reader = new FileReader();
      reader.onload = (function (img) { 
          console.log('got img',img.target);
          displayImage(img.target.result); 
          ctl.sendCmd({ peerId: ctl.peerId, cmd: "img", data: img.target });
      });
      reader.readAsDataURL(ev.dataTransfer.files[0]);
      
      
    } else {
      console.log('dropped file is not an image');
    }
  } 
}

function allowDrop(ev) {
  //ev.target.style.color = 'blue';
  ev.preventDefault();
}


function displayImage(imgx){
    var cell = document.getElementById("peer-grid");
    var img = document.createElement("img");
    img.src = imgx;
    cell.appendChild(img);
}