
$('#createGameForm').submit(() => {
    socket.emit('createGame', $("#createGameTextField").val())
    return false;
});
$('#joinGameForm').submit(() => {
    socket.emit('joinGame', $("#joinGameTextField").val())
    return false;
});
socket.on('roomExist', (roomName) => {
    console.log('room Exist: ' + roomName)
});
socket.on('gameStarted', (roomName) => {
    console.log('game Started: ' + roomName)
});
socket.on('roomDoesNotExist', (roomName) => {
    console.log('room Does Not Exist: ' + roomName)
});
socket.on('created', (roomName) => {
    enterGame();
    leaveLooby();
});
socket.on('joined', (roomName) => {
    
});
socket.on('rooms', (rooms) => {
    var myItems = [];
    var roomsList = $("#roomslist");
    roomsList.empty();
    for (var i = 0; i < rooms.length; i++) {
        myItems.push("<li id=\"" + rooms[i] + "\">" + rooms[i] + "</li>");
    }
    roomsList.append(myItems.join(""));
});


$('#loobyForm').submit(() => {
    leaveGame();
    enterLooby();
    return false;
});
socket.on('created', (roomName) => {
    console.log('Waiting for oppenent ' + roomName)
    $('#createGameFormDiv').hide();
    $('#joinGameFormDiv').hide();
});
socket.on('joined', (roomName) => {
    $('#createGameFormDiv').hide();
    $('#joinGameFormDiv').hide();
});
function enterLooby() {
    $('#playAsGuestFormDiv').hide();
    $('#nameFormDiv').hide();
    $('#rooms').show();
    socket.emit('rooms');
    $('#loobyFormDiv').hide();
    $('#createGameFormDiv').show();
    $('#joinGameFormDiv').show();
}
// enterLooby();
function leaveLooby() {
    $('#rooms').hide();
    $('#createGameFormDiv').hide();
    $('#joinGameFormDiv').hide();
}
// socket.on('rooms', (rooms) => {
//     var myItems = [];
//     var roomsList = $("#rooms");

//     for (var i = 0; i < rooms.length; i++) {
//         myItems.push("<li id=\"" + rooms[i] + "\">" + rooms[i] + "</li>");
//     }
//     roomsList.append(myItems.join(""));
// });