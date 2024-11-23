const socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');
var container = document.getElementById('container');
var audio = new Audio("./ding.mp3");

// Append the message with appropriate alignment
const appendMessage = (msg, pos) => {
    const div = document.createElement('div');
    div.innerText = msg;
    div.classList.add('message');
    div.classList.add(pos);
    container.append(div);
    audio.play();
};

// Prompt the user for a name and emit it to the server
const userName = prompt("Enter your name to join");
socket.emit('new-user-joined', userName);

// When a user joins, notify others
socket.on('user-joined', name => {
    appendMessage(`${name} joined the chat.`, 'right');
});

// When a message is received from the server (another user)
socket.on('receive', data => {
    appendMessage(`${data.name}: ${data.message}`, 'left');
});

// When a user leaves, notify others
socket.on('user-left', name => {
    appendMessage(`${name} left the chat.`, 'right');
});

// Handle message send (emitting to the server)
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('send', input.value);  
        appendMessage(input.value, 'right'); 
        input.value = '';  // Clear input field
    }
});