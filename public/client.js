var socket = io('https://transferup.herokuapp.com/');
const showId = document.querySelector('#show-room-id');
const sendBtn = document.querySelector('#send-btn');
const roomInput = document.querySelector('#room-input');
var file = document.querySelector('#file-input');
const form = document.querySelector('#file-form');
var showImg = document.querySelector('#show-preview');
var room;
var data;

socket.on('new-room', (id) => {
    room = id;
    showId.innerHTML = room;
});

file.addEventListener('change', (e) => {
    data = e.target.files[0];
    console.log(data);
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    readThenSendFile(data);
});

function readThenSendFile(data) {
    var reader = new FileReader();
    reader.onload = function(evt){
        var file ={};
        file.file = evt.target.result;
        file.fileName = data.name;
        file.type = data.type;
        console.log(file.type);
        console.log('Emit to: ' + roomInput.value);
        socket.emit('transfer-to', {'room': roomInput.value, 'file': file});
    };
    reader.readAsDataURL(data);
}

socket.on('base64-file', (file) => {
    var type = file.type.split("/")[0];
    console.log(type);

    switch (type) {
        case "audio":
            showImg.innerHTML = `<audio controls><source src="${file.file}" type="${file.type}" class="h-100 w-100"></source></audio>`;
            break;
        
        case "image":
            showImg.innerHTML = `<img src="${file.file}" class="h-100 w-100">`
            break;

        case "application":
            showImg.innerHTML = `<iframe src="${file.file}" class="h-100 w-100"></iframe>`;
            break;

        default:
            showImg.innerHTML = `<h5>Sorry, file type not supported.</h5>`
            break;
    }
});

