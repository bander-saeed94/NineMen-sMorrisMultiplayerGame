

// var io = require('./index').io;
var array = require('lodash/array');
// var deleteGame = require('./index').deleteGame;
function Game(room, player, io) {
    this.room = room;
    this.io = io;
    this.board = [
        ["", null, null, "", null, null, ""],
        [null, "", null, "", null, "", null],
        [null, null, "", "", "", null, null],
        ["", "", "", null, "", "", ""],
        [null, null, "", "", "", null, null],
        [null, "", null, "", null, "", null],
        ["", null, null, "", null, null, ""]
    ]
    this.winingCond = [
        [{ x: 0, y: 0 }, { x: 0, y: 3 }, { x: 0, y: 6 }],
        [{ x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 5 }],
        [{ x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }],
        [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }],
        [{ x: 3, y: 4 }, { x: 3, y: 5 }, { x: 3, y: 6 }],
        [{ x: 4, y: 2 }, { x: 4, y: 3 }, { x: 4, y: 4 }],
        [{ x: 5, y: 1 }, { x: 5, y: 3 }, { x: 5, y: 5 }],
        [{ x: 6, y: 0 }, { x: 6, y: 3 }, { x: 6, y: 6 }],
        ////////////////////////////////////////////
        [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 6, y: 0 }],
        [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 }],
        [{ x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }],
        [{ x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 }],
        [{ x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 }],
        [{ x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 }],
        [{ x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 }],
        [{ x: 0, y: 6 }, { x: 3, y: 6 }, { x: 6, y: 6 }],
    ]
    this.player1 = player
    this.player2 = null;
    this.currentTurn = this.player1.name
    this.player1PutCount = 0
    this.player2PutCount = 0
    this.player1CanEmit = false
    this.player2CanEmit = false
    this.playersCanMove = false
}
//
Game.prototype.putRocket = function (player, x, y, io) {

    if ((player["name"] !== this.currentTurn || this.board[x][y] == null || this.board[x][y] != "")
        || (player == this.player1 && (this.player1PutCount == 9 || this.player1CanEmit))
        || (player == this.player2 && (this.player2PutCount == 9 || this.player2CanEmit))
    ) {
        return
    }
    else {
        isPlayer1 = (player == this.player1)
        game = this;
        if (isPlayer1) {
            this.player1PutCount += 1
        }
        else {
            this.player2PutCount += 1
            if (this.player2PutCount == 9) {
                this.playersCanMove = true;
            }
        }
        this.board[x][y] = player["name"];
        io.to(this.room).emit('putRocket', player["name"], x, y);
        this.canEmit(player, x, y, function (canEmit) {
            if (canEmit) {
                io.to(game.room).emit('chosseToEmit', player["name"]);
            }
            else {
                if (isPlayer1) {
                    game.currentTurn = game.player2["name"];
                    io.to(game.room).emit('turn', game.player2["name"], game.playersCanMove, game.board,
                        { player1Remaining: 9 - game.player1PutCount, player2Remaining: 9 - game.player2PutCount }
                    );
                }
                else {
                    game.currentTurn = game.player1["name"];
                    io.to(game.room).emit('turn', game.player1["name"], game.playersCanMove, game.board,
                        { player1Remaining: 9 - game.player1PutCount, player2Remaining: 9 - game.player2PutCount }
                    );
                }
            }
        })
    }

}
//
Game.prototype.moveRocket = function (player, oldx, oldy, newx, newy, io) {
    if (player["name"] !== this.currentTurn || this.board[newx][newy] == null || this.board[newx][newy] != ""
        || this.board[oldx][oldy] != player["name"]

    ) {
        return
    }
    else if ((player == this.player1 && this.player1PutCount == 9)
        || (player == this.player2 && this.player2PutCount == 9)) {

        var game = this;
        this.validMove(player, oldx, oldy, newx, newy, (valid) => {
            if (valid) {
                game.board[oldx][oldy] = ""
                game.board[newx][newy] = player["name"]
                io.to(game.room).emit('moveRocket', player["name"], oldx, oldy, newx, newy);
                //////////////////////
                ////////////////////
                game.canEmit(player, newx, newy, function (canEmit) {
                    if (canEmit) {
                        io.to(game.room).emit('chosseToEmit', player["name"]);
                    }
                    else {
                        if (player == game.player1) {
                            /*||player2 cant move player1 win*/
                            if (game.playerCantMove(game.player2)) {
                                io.to(game.room).emit('win', game.player1["name"]);
                                deleteGame(game);
                            }
                            else {
                                game.currentTurn = game.player2["name"];
                                io.to(game.room).emit('turn', game.player2["name"], game.playersCanMove, game.board,
                                    { player1Remaining: 9 - game.player1PutCount, player2Remaining: 9 - game.player2PutCount });
                            }
                        }
                        else {
                            /*||player1 cant move player2 win*/
                            if (game.playerCantMove(game.player1)) {
                                io.to(game.room).emit('win', game.player2["name"]);
                                deleteGame(game);
                            }
                            else {
                                game.currentTurn = game.player1["name"];
                                io.to(game.room).emit('turn', game.player1["name"], game.playersCanMove, game.board,
                                    { player1Remaining: 9 - game.player1PutCount, player2Remaining: 9 - game.player2PutCount }
                                );
                            }
                        }
                    }
                })
            }
            else {
                player.socket.emit('invalidMove')
            }
        });
    }
}

Game.prototype.Emit = function (player, x, y, io) {
    if (player == this.player1 && this.player1CanEmit) {
        if (this.board[x][y] == this.player2["name"]) {
            if (((!this.notInLine(x, y)) && this.allInLine(this.player2["name"]))
                || (this.notInLine(x, y))
            ) {

                this.board[x][y] = ""
                this.player1CanEmit = false;
                io.to(this.room).emit('set', x, y);
                this.currentTurn = this.player2["name"];
                if (this.playersCanMove && (this.playerNumberOfrocket(this.player2) < 3 
                || this.playerCantMove(this.player2) ) /*||player2 cant move*/) {
                    io.to(this.room).emit('win', this.player1["name"]);
                    deleteGame(this);
                }
                else {
                    io.to(this.room).emit('turn', this.player2["name"], this.playersCanMove, this.board,
                        { player1Remaining: 9 - this.player1PutCount, player2Remaining: 9 - this.player2PutCount }
                    );
                }
            }
            else {
                player.socket.emit('cantEmitInLine');
            }
        }
    }
    else if (player == this.player2 && this.player2CanEmit) {
        if (this.board[x][y] == this.player1["name"]) {
            if (((!this.notInLine(x, y)) && this.allInLine(this.player1["name"]))
                || (this.notInLine(x, y))) {

                this.board[x][y] = ""
                this.player2CanEmit = false
                io.to(this.room).emit('set', x, y);
                this.currentTurn = this.player1["name"];
                if (this.playersCanMove && (this.playerNumberOfrocket(this.player1) < 3
                || this.playerCantMove(this.player1) )/*||player1 cant move*/) {
                    io.to(this.room).emit('win', this.player2["name"]);
                    deleteGame(this);
                }
                else {
                    io.to(this.room).emit('turn', this.player1["name"], this.playersCanMove, this.board,
                        { player1Remaining: 9 - this.player1PutCount, player2Remaining: 9 - this.player2PutCount });
                }
            }
            else {
                player.socket.emit('cantEmitInLine');
            }
        }
    }
    else
        return
}
Game.prototype.validMove = function (player, oldx, oldy, newx, newy, cb) {
    if (
        (this.board[newx][newy] == "") && (
            (oldx == newx && (oldx == 0 || oldx == 6) && Math.abs(oldy - newy) == 3) ||//outer hor
            (oldy == newy && (oldy == 0 || oldy == 6) && Math.abs(oldx - newx) == 3) ||//outer ver
            (oldx == newx && (oldx == 1 || oldx == 5) && Math.abs(oldy - newy) == 2) ||//middle hor
            (oldy == newy && (oldy == 1 || oldy == 5) && Math.abs(oldx - newx) == 2) ||//middle ver
            (oldx == newx && (oldx == 2 || oldx == 4) && Math.abs(oldy - newy) == 1) ||//inner hor
            (oldy == newy && (oldy == 2 || oldy == 4) && Math.abs(oldx - newx) == 1) ||//inner ver
            (oldx == newx && (oldx == 3) && Math.abs(oldy - newy) == 1) ||//intercetion
            (oldy == newy && (oldy == 3) && Math.abs(oldx - newx) == 1) ||//intercetion 
            (this.playerNumberOfrocket(player) == 3)
        )
    ) {
        cb(true)
    }
    else {
        cb(false);
    }
}
Game.prototype.playerNumberOfrocket = function (player) {
    var board = this.board;
    var playerName = player["name"]
    var count = 0;
    board.forEach((arr) => {
        arr.forEach((ele) => {
            if (ele == playerName) {
                count = count + 1;
            }
        })
    })
    return count;
}
Game.prototype.allInLine = function (playerName) {
    var board = this.board;
    var isAllInLine = true;
    board.forEach((arr, x) => {
        arr.forEach((ele, y) => {
            //ele to check
            if (ele == playerName) {
                if (this.notInLine(x, y)) {
                    isAllInLine = false;
                }
            }
        })
    })
    return isAllInLine;
}
Game.prototype.notInLine = function (x, y) {
    var board = this.board;
    var realyInLine = false;
    var toCheck = board[x][y];

    this.winingCond.forEach((arr) => {
        if (array.findIndex(arr, { x: x, y: y }) != -1) {
            var inLine = true;
            arr.forEach((ele) => {
                elementInBoard = board[ele.x][ele.y]
                if (elementInBoard != toCheck/*player.name*/) {
                    inLine = false;
                }
            })
            ///
            if (inLine) {
                realyInLine = true;
            }
        }
    })
    return (!realyInLine)
}
Game.prototype.canEmit = function (player, x, y, cb) {
    //loop for winging conditon
    var board = this.board;
    var cb1 = cb;
    var realyCan = false;
    this.winingCond.forEach((arr) => {
        if (array.findIndex(arr, { x: x, y: y }) != -1) {
            var can = true;
            arr.forEach((ele) => {
                elementInBoard = board[ele.x][ele.y]
                if (elementInBoard != player.name) {
                    can = false;
                }
            })
            if (can) {
                realyCan = true;
                if (player == this.player1)
                    this.player1CanEmit = true;
                else
                    this.player2CanEmit = true;
            }
        }
    })
    cb(realyCan)
}
Game.prototype.playerCantMove = function (player) {
    //foreach if next notempty then cant 
    // or forache if can than not empty
    var game = this;
    var playerCantMove = true;
    if (this.playersCanMove && this.playerNumberOfrocket(player) > 3) {
        this.board.forEach((arr, x) => {
            arr.forEach((ele, y) => {
                if (ele == player.name) {
                    if (game.isThereEmptyNearBy(x, y)) {
                        playerCantMove = false;
                        // break;
                    }
                }
            })
        })
    }
    else if(this.playersCanMove && this.playerNumberOfrocket(player) == 3) {
        playerCantMove = false;
    }
    return playerCantMove
}
Game.prototype.isThereEmptyNearBy = function (x, y) {
    var thereIsEmpty = false;
    var game = this;
    this.winingCond.forEach((arr) => {
        var ind = array.findIndex(arr, { x: x, y: y });
        if (ind != -1) {
            for (var i = 0; i < arr.length; i++) {//i in place of y
                if (Math.abs(ind - i) == 1) {
                    if (game.board[arr[i].x][arr[i].y] == "") {
                        thereIsEmpty = true;
                    }
                }
            }
        }
    })
    return thereIsEmpty;
}
Game.prototype.startGame = function (io) {
    io.to(this.room).emit('startGame', this.player1.name, this.player2.name, this.room);
    io.to(this.room).emit('turn', this.player1["name"], this.playersCanMove, this.board,
        { player1Remaining: 9 - this.player1PutCount, player2Remaining: 9 - this.player2PutCount });
}
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

module.exports = Game;
//wining cond
//hori
    // ( 0,0 , 0,3 , 0,6 )
    // ( 1,1 , 1,3 , 1,5 )
    // ( 2,2 , 2,3 , 2,4 )
    // ( 3,0 , 3,1 , 3,2 )
    // ( 3,4 , 3,5 , 3,6 )
    // ( 4,2 , 4,3 , 4,4 )
    // ( 5,1 , 5,3 , 5,5 )
    // ( 6,0 , 6,3 , 6,6 )
    //ver
    // ( 0,0 , 3,0 , 6,0 )
    // ( 1,1 , 3,1 , 5,1 )
    // ( 2,2 , 3,2 , 4,2 )
    // ( 0,3 , 1,3 , 2,3 )
    // ( 4,3 , 5,3 , 6,3 )
    // ( 2,4 , 3,4 , 4,4 )
    // ( 1,5 , 3,5 , 5,5 )
    // ( 0,6 , 3,6 , 6,6 )