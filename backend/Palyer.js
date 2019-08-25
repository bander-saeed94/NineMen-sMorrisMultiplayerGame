
function Player(socket){
    var self = this
    this.socket = socket;
    this.name = null;
    this.game = null;
}

Player.prototype.setName = function (name) {
    this.name = name
}
Player.prototype.joinGame = function (game) {
    this.game = game
    this.socket.leaveAll();
    this.socket.join(game.room);
}
Player.prototype.exitGame = function () {
    this.game = null
}
module.exports = Player;