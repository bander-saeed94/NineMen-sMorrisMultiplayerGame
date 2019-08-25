var array = require('lodash/array');
module.exports = function (client, player, players) {
    client.on('name', (name) => {
        //check if name taken
        if (players.find((element) => element.name == name) != undefined) {
            client.emit('usernameTaken', name)
        }
        else {
            var index = array.findIndex(players, { socket: player.socket })
            // player.name = name;
            players[index].name = name;
            client.emit('name', name)
        }
    });
    client.on('playAsGuest', () => {
        //check if name taken
        player.name = client.id;
        players.push(player)
        client.emit('name', player.name)
    });

}