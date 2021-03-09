import { joinRoom, selfId } from "https://cdn.skypack.dev/trystero@0.7.9";

var start = function() {
  const byId = document.getElementById.bind(document);
  const canvas = byId("canvas");
  const peerInfo = byId("peer-info");
  const chat = byId("chat");
  const chatbox = byId("chatbox");
  const chatbutton = byId("chatbutton");
  const talkbutton = byId("talkbutton");
  const noPeersCopy = peerInfo.innerText;
  const config = { appId: "trystero-glitch" };
  const cursors = {};
  const roomCap = 33;
  const fruits = [
    "🍏",
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    '🫐', //do you not like blueberry!!!???
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝"
  ];
  const randomFruit = () => fruits[Math.floor(Math.random() * fruits.length)];

  let mouseX = 0;
  let mouseY = 0;
  let room;
  let sendMove;
  let sendClick;
  let sendChat;
  let sendPeer;
  let sendCmd;

  var streams = [];
  // sidepeer for calls only
  var peerId = selfId + "_call";
  var peer = new Peer(peerId);

  // Room Selector
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has("room")) { 
    init(urlParams.get("room"))
  } else {
    init(99);                            
  }  
  
  document.documentElement.className = "ready";
  addCursor(selfId, true);

  window.addEventListener("mousemove", ({ clientX, clientY }) => {
    mouseX = clientX / window.innerWidth;
    mouseY = clientY / window.innerHeight;
    moveCursor([mouseX, mouseY], selfId);
    if (room) {
      sendMove([mouseX, mouseY]);
    }
  });

  window.addEventListener("click", () => {
    const payload = [randomFruit(), mouseX, mouseY];
    dropFruit(payload);
    if (room) {
      sendClick(payload);
    }
  });

  window.addEventListener("touchstart", e => {
    const x = e.touches[0].clientX / window.innerWidth;
    const y = e.touches[0].clientY / window.innerHeight;
    const payload = [randomFruit(), x, y];

    dropFruit(payload);
    moveCursor([x, y], selfId);

    if (room) {
      sendMove([x, y]);
      sendClick(payload);
    }
  });

  window.chat = function(msg) {
    if (!msg || msg.length < 1) return;
    updateChat(msg, selfId);
    if (room) sendChat(msg);
    return;
  };
  chatbox.addEventListener("keypress", function(e) {
    if (e.keyCode == 13) {
      window.chat(chatbox.value);
      chatbox.value = "";
      return false;
    }
  });
  chatbutton.addEventListener("click", () => {
    window.chat(chatbox.value);
    chatbox.value = "";
    return false;
  });
  var streaming = false;
  talkbutton.addEventListener("click", async () => {
    if (!streaming){
      var stream = await navigator.mediaDevices.getUserMedia({audio:true, video:true});
      room.addStream(stream);
      streaming = stream;
      talkbutton.innerHTML = "<span style='color: red;'>STOP</span>";
    }else {
      console.log('')
      room.removeStream(streaming);
      streaming = null;
      talkbutton.innerHTML = "TALK";
    }  
  })
  
  async function init(n) {
    const ns = "room" + n;
    const members = 1;

    let getMove;
    let getClick;
    let getChat;
    let getPeer;
    let getCmd;

    if (members === roomCap) {
      return init(n + 1);
    }

    room = joinRoom(config, ns);
    window.room = room;
    window.self = selfId;
    [sendMove, getMove] = room.makeAction("mouseMove");
    [sendClick, getClick] = room.makeAction("click");
    [sendChat, getChat] = room.makeAction("chat");
    [sendCmd, getCmd] = room.makeAction("status");

    byId("room-num").innerText = "room #" + n;
    room.onPeerJoin(addCursor);
    room.onPeerLeave(removeCursor);
    room.onPeerStream(handleStream);
    getMove(moveCursor);
    getClick(dropFruit);
    getChat(updateChat);
    getCmd(handleCmd);
    
  }
  
  function handleCmd (data, id){
    if (data){
      if (data.cmd == "video_off"){}
    }
  }
  

  function handleStream (stream, peerId) {
    console.log('received stream', stream.id, peerId);
    var el = byId("vid_" + peerId);
    el.srcObject = stream;
    el.setAttribute('autoplay', true);
    el.setAttribute('inline', true);
    el.setAttribute('height', 240);
    el.setAttribute('width', 480);
    el.style.maxheight = "200px";
  }
  
  function moveCursor([x, y], id) {
    const el = cursors[id];

    if (el) {
      el.style.left = x * window.innerWidth + "px";
      el.style.top = y * window.innerHeight + "px";
    }
  }

  function addCursor(id, isSelf) {
    const el = document.createElement("div");
    const img = document.createElement("img");
    const txt = document.createElement("p");
    const video = document.createElement("video");
    video.id = "vid_" + id;

    el.className = `cursor${isSelf ? " self" : ""}`;
    el.style.left = el.style.top = "-99px";
    img.src = "https://github.com/dmotz/trystero/raw/main/docs/images/hand.png";
    txt.innerText = isSelf ? "you" : id.slice(0, 4);
    el.appendChild(img);
    el.appendChild(txt);
    el.appendChild(video);
    canvas.appendChild(el);
    cursors[id] = el;

    if (!isSelf) {
      updatePeerInfo();
    }
    
    return el;
  }

  function removeCursor(id) {
    if (cursors[id]) {
      canvas.removeChild(cursors[id]);
    }
    if (streams[id]) {
      room.removeStream(streams[id], id);
      streams[id] = false;
    }
    updatePeerInfo();
  }

  function updatePeerInfo() {
    const count = room.getPeers().length;
    peerInfo.innerHTML = count
      ? `Right now <em>${count}</em> other peer${
          count === 1 ? " is" : "s are"
        } connected with you. Send them some fruit.`
      : noPeersCopy;
  }

  function updateChat(msg, id) {
    //console.log(msg, id);
    chat.innerHTML = id + ":" + msg + "<br/>" + chat.innerHTML;
  }

  function dropFruit([fruit, x, y]) {
    const el = document.createElement("div");
    el.className = "fruit";
    el.innerText = fruit;
    el.style.left = x * window.innerWidth + "px";
    el.style.top = y * window.innerHeight + "px";
    canvas.appendChild(el);
    setTimeout(() => canvas.removeChild(el), 3000);
  }

};

start();
