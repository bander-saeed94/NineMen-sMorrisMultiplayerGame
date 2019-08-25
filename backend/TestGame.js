var array = require('lodash/array');
function Game() {
    this.room = null;
    this.io = null;
    this.board = [
        ["x", null, null, "o", null, null, ""],
        [null, "x", null, "", null, "", null],
        [null, null, "", "", "", null, null],
        ["x", "o", "x", null, "", "", ""],
        [null, null, "", "", "", null, null],
        [null, "x", null, "", null, "", null],
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
    this.player1 = null
    this.player2 = null;
    this.currentTurn = null
    this.player1PutCount = 0
    this.player2PutCount = 0
    this.player1CanEmit = false
    this.player2CanEmit = false
    this.playersCanMove = false
}
Game.prototype.isThereEmptyNearBy = function (x, y) {
    var thereIsEmpty = false;
    this.winingCond.forEach((arr) => {
        var ind = array.findIndex(arr, { x: x, y: y });
        if (ind != -1) {
            for (var i = 0; i < arr.length; i++) {//i in place of y
                if (Math.abs(ind - i) == 1) {
                    if (this.board[arr[i].x][arr[i].y] == "") {
                        thereIsEmpty = true;
                    }
                }
            }
        }
    })
    return thereIsEmpty;
}
var game = new Game();
console.log(game.isThereEmptyNearBy(5,1))