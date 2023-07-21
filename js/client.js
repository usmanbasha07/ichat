//conection to node server
const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")
const typing=document.getElementById("typing");
// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position =='left'){ 
        audio.play();
    }
}


// Ask new user for his/her name and let the server know
function entername(){
    let name = prompt("Enter your name to join");
    if(!name){
        alert("You must enter your name!");
        entername();
    }else{
        return name;
    }
}
socket.emit('new-user-joined', entername());

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'center')
    var objDiv = document.getElementById("container");
    objDiv.scrollTop = objDiv.scrollHeight;
 
})

// If server sends a message, receive it
socket.on('receive', data =>{
    append(`${data.name}:\n ${data.message}`, 'left')
    var objDiv = document.getElementById("container");
    objDiv.scrollTop = objDiv.scrollHeight;
 
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'center')
    var objDiv = document.getElementById("container");
    objDiv.scrollTop = objDiv.scrollHeight;
 
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();             //page not reload
    const message = messageInput.value;
    if (!message) {
        alert("can't send empty message");
        return;}
    append(`${message}\n`, 'right');
    socket.emit('send', message);
    messageInput.value = ''
    var objDiv = document.getElementById("container");
    objDiv.scrollTop = objDiv.scrollHeight;
 
})
//get the typing status
messageInput.addEventListener('keypress',()=>{
    socket.emit("typing",name.value);

})
socket.on('typing', name =>{
    typing.innerHTML=`<em>${name}</em> is typing...`;
    setTimeout(()=>{
        typing.innerHTML='';
    },3000);
    var objDiv = document.getElementById("container");
    objDiv.scrollTop = objDiv.scrollHeight;
})

//get the current time
function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }