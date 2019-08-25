
const elem = document.getElementById('myGame');
const context = elem.getContext('2d');
context.fillStyle = '#05EFFF';
context.fillRect(0, 0, 350, 400);
var canEmit = null;
var from = null;
var to = null;
// (35,40) (310,40)
// (35,360) , (310,360)
const lines = [
    ///outer sequre
    {
        xStart: 35,
        yStart: 40,
        xEnd: 35,
        yEnd: 360,
    },
    {
        xStart: 35,
        yStart: 40,
        xEnd: 310,
        yEnd: 40,
    },
    {
        xStart: 310,
        yStart: 360,
        xEnd: 310,
        yEnd: 40,
    },
    {
        xStart: 310,
        yStart: 360,
        xEnd: 35,
        yEnd: 360,
    },

    ////// middle sequre
    {
        xStart: 75,
        yStart: 80,
        xEnd: 75,
        yEnd: 320,
    },
    {
        xStart: 75,
        yStart: 80,
        xEnd: 265,
        yEnd: 80,
    },
    {
        xStart: 265,
        yStart: 320,
        xEnd: 265,
        yEnd: 80,
    },
    {
        xStart: 265,
        yStart: 320,
        xEnd: 75,
        yEnd: 320,
    },
    ////// inner sequre
    {
        xStart: 115,
        yStart: 120,
        xEnd: 115,
        yEnd: 280,
    },
    {
        xStart: 115,
        yStart: 120,
        xEnd: 225,
        yEnd: 120,
    },
    {
        xStart: 225,
        yStart: 280,
        xEnd: 225,
        yEnd: 120,
    },
    {
        xStart: 225,
        yStart: 280,
        xEnd: 115,
        yEnd: 280,
    },
    //(0,3)->(2,3)
    {
        xStart: 170,
        yStart: 40,
        xEnd: 170,
        yEnd: 120,
    },
    ////(4,3)->(4,6)
    {
        xStart: 170,
        yStart: 280,
        xEnd: 170,
        yEnd: 360,
    },
    ////(3,0)->(3,2)
    {
        xStart: 35,
        yStart: 200,
        xEnd: 115,
        yEnd: 200,
    },
    ////(3,4)->(3,6)
    {
        xStart: 225,
        yStart: 200,
        xEnd: 310,
        yEnd: 200,
    },
]
const circles = [
    {
        xGame: 0,
        yGame: 0,
        x: 35,
        y: 40,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 0,
        yGame: 3,
        x: 170,
        y: 40,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 0,
        yGame: 6,
        x: 310,
        y: 40,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 1,
        yGame: 1,
        x: 75,
        y: 80,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 1,
        yGame: 3,
        x: 170,
        y: 80,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 1,
        yGame: 5,
        x: 265,
        y: 80,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 2,
        yGame: 2,
        x: 115,
        y: 120,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 2,
        yGame: 3,
        x: 170,
        y: 120,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 2,
        yGame: 4,
        x: 225,
        y: 120,
        radius: 10,
        color: 'rgb(255,255,255)'
    },

    {
        xGame: 3,
        yGame: 0,
        x: 35,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 3,
        yGame: 1,
        x: 75,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 3,
        yGame: 2,
        x: 115,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 3,
        yGame: 4,
        x: 225,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 3,
        yGame: 5,
        x: 265,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 3,
        yGame: 6,
        x: 310,
        y: 200,
        radius: 10,
        color: 'rgb(255,255,255)'
    },



    {
        xGame: 4,
        yGame: 2,
        x: 115,
        y: 280,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 4,
        yGame: 3,
        x: 170,
        y: 280,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 4,
        yGame: 4,
        x: 225,
        y: 280,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 5,
        yGame: 1,
        x: 75,
        y: 320,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 5,
        yGame: 3,
        x: 170,
        y: 320,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 5,
        yGame: 5,
        x: 265,
        y: 320,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 6,
        yGame: 0,
        x: 35,
        y: 360,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 6,
        yGame: 3,
        x: 170,
        y: 360,
        radius: 10,
        color: 'rgb(255,255,255)'
    },
    {
        xGame: 6,
        yGame: 6,
        x: 310,
        y: 360,
        radius: 10,
        color: 'rgb(255,255,255)'
    },

];
lines.forEach(line => {
    context.beginPath();
    context.moveTo(line.xStart, line.yStart);
    context.lineTo(line.xEnd, line.yEnd);
    context.stroke();
});
circles.forEach(circle => {
    context.beginPath();
    context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    context.fillStyle = circle.color;
    context.fill();
    context.fillStyle = "red";
    context.fillText(circle.xGame + ',' + circle.yGame, circle.x, circle.y)
});


function isIntersect(point, circle) {
    return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

elem.addEventListener('click', (e) => {
    const pos = {
        x: e.clientX,
        y: e.clientY
    };

    circles.forEach(circle => {
        if (isIntersect(pos, circle)) {
            if (gameStarted) {
                if (turn == myName) {
                    // console.log(canEmit)
                    if (canEmit) {
                        socket.emit('emit', circle.xGame, circle.yGame)
                    }
                    else if (canMove) {
                        if (from == null) {
                            from = circle;
                            //highlet it bigger
                            context.beginPath();
                            context.arc(from.x, from.y, from.radius + 0.1, 0, 2 * Math.PI, false);
                            context.strokeStyle = "yellow";
                            context.stroke();
                        }
                        else {
                            to = circle
                            //return normal
                            context.beginPath();
                            context.arc(from.x, from.y, from.radius + 0.1, 0, 2 * Math.PI, false);
                            context.strokeStyle = '#05EFFF';
                            context.stroke();
                            socket.emit('moveRocket', from.xGame, from.yGame, to.xGame, to.yGame)
                            from = null;
                            to = null;
                        }
                    }
                    else {
                        //x,y for borad
                        socket.emit('putRocket', circle.xGame, circle.yGame)
                        console.log('click on circle: ' + circle.xGame + ',' + circle.yGame)
                        // alert('click on circle: ' + circle.xGame + ',' + circle.yGame);
                    }
                }
            }
        }
    });

});
// elem.addEventListener('dblclick', function(){ 

//     // Some dazzling stuff happens be here

//   });
socket.on('putRocket', (playerName, x, y) => {
    var cir = circles.find((circle) => {
        return circle.xGame == x && circle.yGame == y
    });
    context.beginPath();
    context.arc(cir.x, cir.y, cir.radius, 0, 2 * Math.PI, false);
    //first playeer blue
    //second red
    if (playerName == myName && amIfirstPlayer)
        context.fillStyle = "blue";
    else if (playerName != myName && !amIfirstPlayer)
        context.fillStyle = "blue";
    else if (playerName == myName && !amIfirstPlayer)
        context.fillStyle = "red";
    else if (playerName != myName && amIfirstPlayer)
        context.fillStyle = "red";
    context.fill();
});

socket.on('moveRocket', (playerName, oldx, oldy, newx, newy) => {
    var del = circles.find((circle) => {
        return circle.xGame == oldx && circle.yGame == oldy
    });
    context.beginPath();
    context.arc(del.x, del.y, del.radius, 0, 2 * Math.PI, false);
    context.fillStyle = "white";
    context.fill();

    //first playeer blue
    //second red
    var draw = circles.find((circle) => {
        return circle.xGame == newx && circle.yGame == newy
    });
    context.beginPath();
    context.arc(draw.x, draw.y, draw.radius, 0, 2 * Math.PI, false);
    if (playerName == myName && amIfirstPlayer)
        context.fillStyle = "blue";
    else if (playerName != myName && !amIfirstPlayer)
        context.fillStyle = "blue";
    else if (playerName == myName && !amIfirstPlayer)
        context.fillStyle = "red";
    else if (playerName != myName && amIfirstPlayer)
        context.fillStyle = "red";
    context.fill();
});

socket.on('chosseToEmit', (playerName) => {
    console.log('chosseToEmit');
    if (playerName == myName)
        canEmit = true;
});
socket.on('set', (x, y) => {
    console.log('set');
    if (canEmit)
        canEmit = false;
    var cir = circles.find((circle) => {
        return circle.xGame == x && circle.yGame == y
    })
    context.beginPath();
    context.arc(cir.x, cir.y, 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'rgb(255,255,255)'
    context.fill();
});
socket.on('cantEmitInLine', () => {
    $('#response').text('cant Emit In Line');
    window.navigator.vibrate(100); // vibrate for 200ms
})
socket.on('win', (playerName) => {

    $('#response').text(playerName + ' won');
    gameStarted = false;
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
})
socket.on('playerNameNotSet', () => {
    $('#response').text('set a name first Or play As a Guest');
});
socket.on('usernameTaken', () => {
    $('#response').text('username Taken');
});
socket.on('rooms', (rooms) => {
    var myItems = [];
    var roomsList = $("#rooms");

    for (var i = 0; i < rooms.length; i++) {
        myItems.push("<li id=\"" + rooms[i] + "\">" + rooms[i] + "</li>");
    }
    roomsList.append(myItems.join(""));
});

// socket.on('userleft', (username)=>{
//     console.log('userleft' + username);
// });