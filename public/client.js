let socket = io('https://transferup.herokuapp.com/');
const showId = document.querySelector('#show-room-id');
const sendBtn = document.querySelector('#send-btn');
const roomInput = document.querySelector('#room-input');
const downloadBtn = document.querySelector('#download-btn');
let file = document.querySelector('#file-input');
const form = document.querySelector('#file-form');
let showImg = document.querySelector('#show-preview');
let room;
let data;

socket.on('new-room', (id) => {
    room = id;
    showId.innerHTML = room;
});

file.addEventListener('change', (e) => {
    data = e.target.files[0];
});

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
    downloadBtn.outerHTML = '<a class="btn mt-5" id="download-btn" disable style="background-color: #05386b; color: white;">Download</a>';

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
            showImg.innerHTML = `<audio controls><source src="${file.file}" type="${file.type}" class="h-100 w-100" id="file-wanted"></source></audio>`;
            break;
        
        case "image":
            showImg.innerHTML = `<img src="${file.file}" class="h-100 w-100">`
            break;

        case "application":
            showImg.innerHTML = `<iframe src="${file.file}" class="h-100 w-100"></iframe>`;
            break;

        default:
            showImg.innerHTML = `<h6>Preview of this type of file not supported.</h6>`
            break;
    }

    downloadBtn.outerHTML = `<a class="btn mt-5" id="download-btn" download="t-up" href="${file.file}" style="background-color: #05386b; color: white;">Download</a>`;
});

