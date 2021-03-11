 function drop(ev) {
  ev.preventDefault();
  try {
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  } catch(e){
    console.log(e, data);
  }
  
}

function allowDrop(ev) {
  ev.target.style.color = 'blue';
  ev.preventDefault();
}