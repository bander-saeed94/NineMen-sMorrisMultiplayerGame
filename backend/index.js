const express = require('express');
const path = require('path');
// const app = require('express')();
// const server = require('http').Server(app);
const port = process.env.PORT || 8080;

const server = express()
    .use(express.static(path.join(__dirname, 'public')))
    .use((req, res) => res.sendFile(path.join(__dirname, 'index.html')))
    .listen(port, () => console.log(`Listening on ${port}`));


var Player = require('./Palyer');
var handlePlayer = require('./handlePlayer');
var handleGame = require('./handleGame');


var io = require('socket.io')(server);


// io.set('transports', ['websocket']);

var games = [];
var players = [];
global.games = games;
io.on("connection", function (socket) {
    //emit connect

    var player = new Player(socket);
    // console.log(player)
    players.push(player);
    handlePlayer(socket, player, players);
    handleGame(socket, player, games, io);
    /////////
    socket.on('disconnecting', (reason) => {

    });
    socket.on('disconnect', (reason) => {


        var player = players.find((ele) => ele.socket.id == socket.id);

        if (player["game"] != null) {
            var game = player.game;
            if (game != null && game.player2 != null) {
                if (game.player1 == player) {
                    game.io.to(game.room).emit('win', game.player2["name"]);
                }
                else {
                    game.io.to(game.room).emit('win', game.player1["name"]);
                }
            }
            else {
                game.io.to(game.room).emit('win', 'noOne');
            }
            deleteGame(game);
            emitAvailableRooms(games, io)
            console.log(games);
            // var index = games.findIndex((ele) => ele.room == game.room);
            // games.splice(index, 1);
            // game.player1.game = null;

            // game.player1 = null;
            // if (game.player2 != null) {
            //     game.player2.socket.leave(game.room);
            //     game.player2.game = null;
            //     game.player2 = null;
            // }
            // game = null;
        }
        var index = players.findIndex((ele) => ele.socket.id == socket.id);
        players.splice(index, 1);
    })
    socket.on('error', (error) => {
        // ...
        console.log(error)
    });
});

function deleteGame(game) {
    var index = games.findIndex((ele) => ele.room == game.room);
    games.splice(index, 1);
    game.player1.socket.leave(game.room);
    game.player1.game = null;
    game.player1 = null;
    if (game.player2 != null) {
        game.player2.socket.leave(game.room);
        game.player2.game = null;
        game.player2 = null;
    }
    game = null;
}
function emitAvailableRooms(games, io) {

    var rooms = []
    games.forEach(element => {
        if (element.player2 == null) {
            rooms.push(element.room);
        }
    });
    io.emit('rooms', rooms)
}
// app.use(express.static(path.join(__dirname, 'public')));
// server.listen(port, () => {
//     console.log(`listening on port ${port}`)
// });

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,'index.html'))
// }); 
// app.get('*', function (req, res){
//     // res.sendFile('index.html')
//     // response.sendFile(path.resolve(__dirname, '../public', 'index.html'));
// });
// const io = socketIO(server);