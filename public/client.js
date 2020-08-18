var socket = io('https://transferup.herokuapp.com/');
const showId = document.querySelector('#show-room-id');
const sendBtn = document.querySelector('#send-btn');
const roomInput = document.querySelector('#room-input');
var file = document.querySelector('#file-input');
const form = document.querySelector('#file-form');
var showImg = document.querySelector('#show-img');
var room;
var data;

socket.on('new-room', (id) => {
    room = id;
    showId.innerHTML = room;
});

file.addEventListener('change', (e) => {
    data = e.target.files[0];
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    readThenSendFile(data);
});

function readThenSendFile(data) {
    var reader = new FileReader();
    reader.onload = function(evt){
        var msg ={};
        msg.file = evt.target.result;
        msg.fileName = data.name;
        console.log(msg);
        socket.emit(roomInput.value, msg);
    };
    reader.readAsDataURL(data);
}

socket.on('base64-file', (file) => {
    console.log(file.file);
    showImg.innerHTML = `<img src="${file.file}" style="height: 280px; width: 280px;">`
    showImg.innerHTML = `<audio controls src="${file.file}">`
});

