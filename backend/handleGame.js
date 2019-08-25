var Game = require('./Game');
module.exports = function (client, player, games, io) {


    client.on("createGame", (room) => {
        if (player.name != null) {
            // console.log(games);
            var gameExist = games.find((game) => {
                if (game.room == room)
                    return true;
            });
            if (gameExist) {
                client.emit('roomExist', room);
            }
            else {
                var game = new Game(room, player, io);
                games.push(game);
                player.joinGame(game);
                client.emit('created', room);
                emitAvailableRooms(games,io);
            }
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on("joinGame", (room) => {
        if (player.name != null) {
            var joinGame = games.find((game) => {
                if (game.room === room) {
                    return true;
                }
            });
            if (joinGame) {
                if (joinGame.player2 === null) {
                    joinGame.player2 = player;
                    player.joinGame(joinGame);
                    client.emit('joined', room);
                    joinGame.startGame(io);
                    emitAvailableRooms(games,io);
                }
                else {
                    client.emit('gameStarted', room);
                }
            }
            else {
                client.emit('roomDoesNotExist', room);
            }
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on("putRocket", function (x, y) {
        if (player.name != null) {
            if (player.game) {
                // console.log('from inside if player.game')
                player.game.putRocket(player, x, y, io)
            }
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on("moveRocket", function (oldx, oldy, newx, newy) {
        if (player.name != null) {
            if (player.game)
                player.game.moveRocket(player, oldx, oldy, newx, newy, io);
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on("emit", function (x, y) {
        if (player.name != null) {
            if (player.game)
                player.game.Emit(player, x, y, io)
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on("leaveGame", function () {
        if (player.name != null) {
            if (player["game"] != null) {
                var game = player.game;
                player.socket.leave(game.room);
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
                var index = games.findIndex((ele) => ele.room == game.room);
                games.splice(index, 1);
                game.player1.game = null;

                game.player1 = null;
                if (game.player2 != null) {
                    game.player2.socket.leave(game.room);
                    game.player2.game = null;
                    game.player2 = null;
                }
                game = null;
            }
        }
        else {
            client.emit('playerNameNotSet');
        }
    });
    client.on('rooms', () => {
        emitAvailableRooms(games,io);
    })
    ///remove game on finishing
}

function emitAvailableRooms(games,io){

    var rooms = []
    games.forEach(element => {
        if (element.player2 == null) {
            rooms.push(element.room);
        }
    });
    io.emit('rooms', rooms)
}