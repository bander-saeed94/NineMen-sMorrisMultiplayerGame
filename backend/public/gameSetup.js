
// var canvas = document.querySelector('canvas');
var canvas = document.getElementById('myGame');
var c = canvas.getContext('2d')
canvas.width = innerWidth;
canvas.height = innerWidth;
var from = null;
var to = null;

canEmit = false;
var colors = [
    "#5C4B51",
    "#4CBE9E",
    "#F2E97E",
    "#F39C5C",
    "#F06060",
    "#074358",
    "#458985",
    //
    "#FFE866",
    "#1E9FE8",
    "#FF518F",
    "#4FE8C9",
    "#FFFFFF"
];

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerWidth;
    if (game != null)
        game.draw();
});
//
function isIntersect(point, circle) {
    return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}
//

function Game(firstPlayer, secondPlayer, roomName) {
    this.board = [
        ["", null, null, "", null, null, ""],
        [null, "", null, "", null, "", null],
        [null, null, "", "", "", null, null],
        ["", "", "", null, "", "", ""],
        [null, null, "", "", "", null, null],
        [null, "", null, "", null, "", null],
        ["", null, null, "", null, null, ""]
    ];
    this.roomName = roomName;
    this.radius = 15;
    this.selectColor = '#1E24E8'
    this.boardColor = '#FFE8A2'
    this.lineColor = 'black'//colors[8];
    this.messagesColor = 'black'//colors[9];
    this.GameStarted = true;
    this.player1Name = firstPlayer;
    this.player1Color = 'white'//colors[10];
    this.player2Name = secondPlayer;
    this.player2Color = 'brown'//colors[11];
    this.player1Remaining = 9;
    this.player2Remaining = 9;
    this.turn = firstPlayer;
    this.moving = false;
    this.circles = null;
    this.msg = '';
    this.setMessage = function () {
        c.beginPath();
        c.fillStyle = this.boardColor;
        c.fillRect(canvas.width / 16, canvas.height / 16 - 24/*font size*/, canvas.width - canvas.width / 16, 16/*font size*/);
        c.fillStyle = this.messagesColor;
        c.font = '12px serif';
        c.fillText(this.msg, canvas.width / 16, canvas.height / 16 - 12);
        c.closePath();
    }
    this.getCoordinates = function () {

    }
    this.draw = function () {
        //backgraound
        c.fillStyle = this.boardColor;
        c.fillRect(0, 0, canvas.width, canvas.width);
        //lines
        //canvas.width / 5
        this.drawSquare(
            canvas.width / 10,
            canvas.height / 10,
            canvas.width - canvas.width / 10,
            canvas.height - canvas.height / 10);
        this.drawSquare(
            (canvas.width / 10) * 2,
            (canvas.height / 10) * 2,
            canvas.width - (2 * canvas.width / 10),
            canvas.height - (2 * canvas.height / 10)
        );
        this.drawSquare(
            (canvas.width / 10) * 3,
            (canvas.height / 10) * 3,
            canvas.width - (3 * canvas.width / 10),
            canvas.height - (3 * canvas.height / 10)
        )
        // line between
        this.drawLine(
            canvas.width / 2, canvas.height / 10,
            canvas.width / 2, canvas.height / 10 * 3
        )
        this.drawLine(
            canvas.width / 2, canvas.height - canvas.height / 10,
            canvas.width / 2, canvas.height - canvas.height / 10 * 3
        )
        this.drawLine(
            canvas.width / 10, canvas.height / 2,
            canvas.width / 10 * 3, canvas.height / 2
        )
        this.drawLine(
            canvas.width - canvas.width / 10, canvas.height / 2,
            canvas.width - canvas.width / 10 * 3, canvas.height / 2
        )
        //balls
        this.setCircles();
        for (var i = 0; i < this.circles.length; i++) {
            this.drawCircle(this.circles[i]);
        }
        this.setMessage();
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] != null)
                    this.putRocket(this.board[i][j], i, j);
            }
        }
    }
    this.drawLine = function (x0, y0, x1, y1) {
        c.beginPath();
        c.moveTo(x0, y0)
        c.lineTo(x1, y1);
        c.strokeStyle = this.lineColor;
        c.stroke();
    }
    this.drawSquare = function (x0, y0, x1, y1) {
        c.beginPath();
        c.moveTo(x0, y0)
        c.lineTo(x1, y0);
        c.lineTo(x1, y1);
        c.lineTo(x0, y1);
        c.lineTo(x0, y0)
        c.strokeStyle = this.lineColor;
        c.stroke();
    };
    this.drawCircle = function (circle) {
        c.beginPath();
        c.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
        c.fillStyle = this.lineColor;
        c.fill();
        // c.fillStyle = "green";
        // c.font = '30px serif';
        // c.fillText(circle.xGame + ',' + circle.yGame, circle.x, circle.y)
    };
    this.putRocket = function (playerName, x, y) {
        var cir = this.circles.find((circle) => {
            return circle.xGame == x && circle.yGame == y
        });
        c.beginPath();
        c.arc(cir.x, cir.y, cir.radius, 0, 2 * Math.PI, false);
        if (playerName == this.player1Name) {
            c.fillStyle = this.player1Color;
            c.fill();
        }
        else if (playerName == this.player2Name) {
            c.fillStyle = this.player2Color;
            c.fill();
        }
        c.closePath();
    }
    this.setCircles = function () {
        this.circles = [
            {
                xGame: 0,
                yGame: 0,
                x: canvas.width / 10,
                y: canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 0,
                x: canvas.width / 2,
                y: canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 6,
                yGame: 0,
                x: canvas.width - canvas.width / 10,
                y: canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 1,
                yGame: 1,
                x: canvas.width / 10 * 2,
                y: canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 1,
                x: canvas.width / 2,
                y: canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 5,
                yGame: 1,
                x: canvas.width - canvas.width / 10 * 2,
                y: canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 2,
                yGame: 2,
                x: canvas.width / 10 * 3,
                y: canvas.height / 10 * 3,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 2,
                x: canvas.width / 2,
                y: canvas.height / 10 * 3,
                radius: this.radius
            },
            {
                xGame: 4,
                yGame: 2,
                x: canvas.width - canvas.width / 10 * 3,
                y: canvas.height / 10 * 3,
                radius: this.radius
            },
            ////
            {
                xGame: 0,
                yGame: 3,
                x: canvas.width / 10,
                y: canvas.height / 2,
                radius: this.radius
            },
            {
                xGame: 1,
                yGame: 3,
                x: canvas.width / 10 * 2,
                y: canvas.height / 2,
                radius: this.radius
            },
            {
                xGame: 2,
                yGame: 3,
                x: canvas.width / 10 * 3,
                y: canvas.height / 2,
                radius: this.radius
            },
            //
            {
                xGame: 4,
                yGame: 3,
                x: canvas.width - canvas.width / 10 * 3,
                y: canvas.height / 2,
                radius: this.radius
            },
            {
                xGame: 5,
                yGame: 3,
                x: canvas.width - canvas.width / 10 * 2,
                y: canvas.height / 2,
                radius: this.radius
            },
            {
                xGame: 6,
                yGame: 3,
                x: canvas.width - canvas.width / 10,
                y: canvas.height / 2,
                radius: this.radius
            },


            ////
            {
                xGame: 0,
                yGame: 6,
                x: canvas.width / 10,
                y: canvas.height - canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 6,
                x: canvas.width / 2,
                y: canvas.height - canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 6,
                yGame: 6,
                x: canvas.width - canvas.width / 10,
                y: canvas.height - canvas.height / 10,
                radius: this.radius
            },
            {
                xGame: 1,
                yGame: 5,
                x: canvas.width / 10 * 2,
                y: canvas.height - canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 5,
                x: canvas.width / 2,
                y: canvas.height - canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 5,
                yGame: 5,
                x: canvas.width - canvas.width / 10 * 2,
                y: canvas.height - canvas.height / 10 * 2,
                radius: this.radius
            },
            {
                xGame: 2,
                yGame: 4,
                x: canvas.width / 10 * 3,
                y: canvas.height - canvas.height / 10 * 3,
                radius: this.radius
            },
            {
                xGame: 3,
                yGame: 4,
                x: canvas.width / 2,
                y: canvas.height - canvas.height / 10 * 3,
                radius: this.radius
            },
            {
                xGame: 4,
                yGame: 4,
                x: canvas.width - canvas.width / 10 * 3,
                y: canvas.height - canvas.height / 10 * 3,
                radius: this.radius
            },
        ]
    }
}


canvas.addEventListener('click', (e) => {
    var pos = {
        x: e.clientX,
        y: e.clientY
    };
    if (game != null) {
        game.circles.forEach(circle => {
            if (isIntersect(pos, circle)) {
                if (canEmit) {
                    if (game.board[circle.xGame][circle.yGame] == playerName
                        || game.board[circle.xGame][circle.yGame] == '') {
                        game.msg = 'اختر حجر تحذف من الخصم';
                        game.setMessage();
                    }
                    else {
                        socket.emit('emit', circle.xGame, circle.yGame)
                    }
                }
                else if (game.turn == playerName && game.moving) {
                    if (game.board[circle.xGame][circle.yGame] == playerName) {
                        if (from != null) {
                            //clear previous selected
                            clearSelected(from);
                        }
                        from = circle;
                        //colorize
                        select(from);
                    }
                    else {
                        if (from == circle) {
                            game.msg = 'اختر مكان تحرك له';
                            game.setMessage();
                        }
                        else if (game.board[circle.xGame][circle.yGame] != '') {
                            game.msg = 'اختر مكان فاضي ';
                            game.setMessage();
                        }
                        else if (from != null) {
                            var to = circle;
                            //remove colorize
                            //clear selected
                            clearSelected(from);
                            socket.emit('moveRocket', from.xGame, from.yGame, to.xGame, to.yGame)
                            from = null;
                            to = null;
                        }
                    }
                }
                else if (game.turn == playerName && !game.moving) {
                    if (game.board[circle.xGame][circle.yGame] != '') {
                        game.msg = 'اختر مكان فاضي ';//'Select Empty slot to put yours';
                        game.setMessage();
                    }
                    else {
                        socket.emit('putRocket', circle.xGame, circle.yGame)
                    }
                }
            }
        })
    }

});
function clearSelected(circle) {
    // c.beginPath();
    // c.arc(circle.x, circle.y, circle.radius , 0, 2 * Math.PI, false);
    // if(game.board[circle.xGame][circle.yGame] == game.player1Name){
    //     c.fillStyle = game.player1Color;
    // }
    // else if(game.board[circle.xGame][circle.yGame] == game.player2Name){
    //     c.fillStyle = game.player2Color;
    // }
    // else {
    //     c.fillStyle = 'white';
    // }
    // c.fill();
    // c.closePath();
    c.save();
    c.beginPath();
    c.arc(circle.x, circle.y, circle.radius + 0.1, 0, 2 * Math.PI, false);
    c.strokeStyle = game.boardColor;
    c.lineWidth = 1.2;
    c.stroke();
    c.beginPath();
    c.arc(circle.x, circle.y, circle.radius + 0.1, 0, 2 * Math.PI, false);
    c.strokeStyle = game.boardColor;
    c.stroke();
    c.beginPath();
    c.arc(circle.x, circle.y, circle.radius + 0.1, 0, 2 * Math.PI, false);
    c.strokeStyle = game.boardColor;
    c.stroke();
    c.restore();

}
function select(circle) {
    c.beginPath();
    c.arc(circle.x, circle.y, circle.radius + 0.1, 0, 2 * Math.PI, false);
    c.strokeStyle = game.selectColor;
    c.stroke();
}
function enterGame(){
    $('#myGameRow').show();
    $('#leaveFormDiv').show();
}
function leaveGame(){
    $('#leaveFormDiv').hide();
    $('#myGameRow').hide();
}
var game = null;
socket.on('startGame', (firstPlayer, secondPlayer, roomName) => {
    leaveLooby();
    enterGame()
    game = new Game(firstPlayer, secondPlayer, roomName);
    game.draw();
    if (firstPlayer == playerName) {
        game.msg = 'دورك '//'Your Turn'
    }
    else {
        game.msg =  'دور الخصم '//'Oppenent Turn'
    }
    game.setMessage();
    
    
});
socket.on('turn', (playerNameTurn, canMv, board, remain) => {
    // var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
    // if (canVibrate && !("vibrate" in navigator))
    //     navigator.vibrate = navigator.mozVibrate;
    console.log(remain);
    game.player1Remaining = remain.player1Remaining;
    game.player2Remaining = remain.player2Remaining;
    game.turn = playerNameTurn;
    if (game.turn == playerName) {
        game.msg = 'دورك '//'Your Turn''Your Turn'
        audio.play();
        if(playerName == game.player1Name){
            game.msg = game.msg + ' عدد الاحجار باقي لك : ' +  game.player1Remaining
            // game.msg = game.msg + ' remain rocket' +  game.player1Remaining
        }
        else {
            game.msg = game.msg + ' عدد الاحجار باقي لك : ' +  game.player2Remaining
            // game.msg = game.msg + ' remain rocket' +  game.player2Remaining
        }
    }
    else {
        game.msg = 'دور الخصم '//'Oppenent Turn'
        if(playerName == game.player1Name){
            game.msg = game.msg + ' عدد الاحجار باقي لك : ' +  game.player1Remaining
            // game.msg = game.msg + ' remain rocket' +  game.player1Remaining
        }
        else {
            game.msg = game.msg + ' عدد الاحجار باقي لك : ' +  game.player2Remaining
            // game.msg = game.msg + ' remain rocket' +  game.player2Remaining
        }
    }
    game.setMessage();
    game.moving = canMv;
    game.board = board;
});


socket.on('putRocket', (playerName, x, y) => {
    game.putRocket(playerName, x, y);
});

socket.on('moveRocket', (playerName, oldx, oldy, newx, newy) => {
    var del = game.circles.find((circle) => {
        return circle.xGame == oldx && circle.yGame == oldy
    });
    c.beginPath();
    c.arc(del.x, del.y, del.radius, 0, 2 * Math.PI, false);
    c.fillStyle = game.lineColor;
    c.fill();

    var draw = game.circles.find((circle) => {
        return circle.xGame == newx && circle.yGame == newy
    });
    game.putRocket(playerName, draw.xGame, draw.yGame);
});

socket.on('chosseToEmit', (playerCanEmit) => {
    if (playerCanEmit == playerName) {
        canEmit = true;
        game.msg = 'اخنر تحذف من الخصم' //'chosse To Emit'
        game.setMessage();
    }
});
socket.on('set', (x, y) => {
    if (canEmit)
        canEmit = false;
    var cir = game.circles.find((circle) => {
        return circle.xGame == x && circle.yGame == y
    })
    c.beginPath();
    c.arc(cir.x, cir.y, cir.radius, 0, 2 * Math.PI, false);
    c.fillStyle = game.lineColor
    c.fill();
});
socket.on('cantEmitInLine', () => {
    game.msg =  'ما تقدر نحذف من خط'//'cant Emit In Line'
    game.setMessage();
})
socket.on('win', (playerNameWoN) => {
    if(playerName == playerNameWoN ){

        game.msg = 'فزت'
    }
    else{
        game.msg = 'انهزمت'
    }
    game.setMessage();
    game = null;
    $('#leaveFormDiv').hide();
    $('#loobyFormDiv').show();
    // enterLooby();
    // $('#welcome').show();
    // $('#response').text('');
    // $('#nameHeader').text(name);
    // $('#playAsGuestFormDiv').hide();
    // $('#nameFormDiv').hide();
    // $('#createGameFormDiv').show();
    // $('#joinGameFormDiv').show();
    // ////
    // ///
    // $('#leaveFormDiv').hide();
    // $('#firstH').hide();
    // $('#secondH').hide();
    // $('#firstHeader').text('');
    // $('#secondHeader').text('');
    // $('#turn').text('');
    // $('#gameName').text('');
    // // alert(playerName + ' won');
});
$('#leaveForm').submit(() => {
    socket.emit('leaveGame');
    leaveGame();
    enterLooby();
    return false;
});



// socket.on('userleft', (username)=>{
//     console.log('userleft' + username);
// });