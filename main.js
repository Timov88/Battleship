let visibleGrid = [];
let enemyGrid = [];
let playerGrid = [];
let gridSize;
let playerShipSuunta = 0;
let laivatPlayer = [2, 3, 3, 4, 4, 5, 6];
let laivatEnemy = [2, 3, 3, 4, 4, 5, 6];
let showEnemy = true;
let playerHealth = laivatPlayer.reduce((a, b) => a + b, 0);
let enemyHealth = laivatEnemy.reduce((a, b) => a + b, 0);

//deep copy of 2d arrays are too complicated :D 
//https://medium.com/@ziyoshams/deep-copying-javascript-arrays-4d5fc45a6e3e
function createGrid(gridSize) {
    for (let i = 0; i < gridSize; i++) {
        enemyGrid[i] = [];
        playerGrid[i] = [];
        for (let j = 0; j < gridSize; j++) {
            enemyGrid[i][j] = 0;
            playerGrid[i][j] = 0;
        }
    }
    placeEnemyShip();
}

function createVisiblePlayerGrid(gridSize) {
    for (let i = 0; i < gridSize; i++) {
        visibleGrid[i] = [];
        var row = document.createElement('div');
        row.className = "row";

        for (let j = 0; j < gridSize; j++) {
            visibleGrid[i][j] = div = document.createElement('div');
            div.id = i.toString() + j.toString();
            div.className = "playerDiv";
            row.appendChild(div);
        }
        document.getElementById('playerParent').appendChild(row);
    }
}
function createVisibleEnemyGrid(gridSize) {
    for (let i = 0; i < gridSize; i++) {
        visibleGrid[i] = [];
        var row = document.createElement('div');
        row.className = "row";

        for (let j = 0; j < gridSize; j++) {
            visibleGrid[i][j] = div = document.createElement('div');
            div.id = i.toString() + "," + j.toString();
            div.className = "enemyDiv";
            row.appendChild(div);
        }
        document.getElementById('enemyParent').appendChild(row);
    }
}

function placeEnemyShip() {
    let x = 0;
    while (x < laivatEnemy.length) {
        let iPos = Math.floor(Math.random() * gridSize);
        let jPos = Math.floor(Math.random() * gridSize);
        let sizeJ = jPos + laivatEnemy[x];
        let sizeI = iPos + laivatEnemy[x];
        let originaljPos = jPos;
        let originaliPos = iPos;
        let monta = 0;
        let noNyt = false;
        let suunta = Math.floor(Math.random() * 2)
        laivatEnemy[x]
        if (suunta === 0) {
            if (sizeJ <= gridSize) {
                for (jPos; jPos < sizeJ; jPos++) {
                    if (enemyGrid[iPos][jPos] === 0) {
                        monta++;
                        if (monta === laivatEnemy[x]) {
                            noNyt = true;
                        }
                    }
                }
            }
            if (noNyt) {
                for (originaljPos; originaljPos < sizeJ; originaljPos++) {
                    enemyGrid[iPos][originaljPos] = 1;
                }

                x++;
            }
        }
        if (suunta === 1) {
            if (sizeI <= gridSize) {
                for (iPos; iPos < sizeI; iPos++) {
                    if (enemyGrid[iPos][jPos] === 0) {
                        monta++;
                        if (monta === laivatEnemy[x]) {
                            noNyt = true;
                        }
                    }
                }
            }
            if (noNyt) {
                for (originaliPos; originaliPos < sizeI; originaliPos++) {
                    enemyGrid[originaliPos][jPos] = 1;
                }
                x++;
            }
        }
    }
}

function placePlayerShip(shipSize, i, j, axis) {
    let iPos = i;
    let jPos = j;
    let sizeJ = jPos + shipSize;
    let sizeI = iPos + shipSize;
    let originaljPos = jPos;
    let originaliPos = iPos;
    let monta = 0;
    let noNyt = false;
    let suunta = axis;

    if (suunta === 0) {
        if (sizeJ <= gridSize) {
            for (jPos; jPos < sizeJ; jPos++) {
                if (playerGrid[iPos][jPos] === 0) {
                    monta++;
                    if (monta === shipSize) {
                        noNyt = true;
                    }
                }
            }
        }
        if (noNyt) {
            for (originaljPos; originaljPos < sizeJ; originaljPos++) {
                playerGrid[iPos][originaljPos] = 1;
            }
            laivatPlayer.shift();
        }
    }
    if (suunta === 1) {
        if (sizeI <= gridSize) {
            for (iPos; iPos < sizeI; iPos++) {
                if (playerGrid[iPos][jPos] === 0) {
                    monta++;
                    if (monta === shipSize) {
                        noNyt = true;
                    }
                }
            }
        }
        if (noNyt) {
            for (originaliPos; originaliPos < sizeI; originaliPos++) {
                playerGrid[originaliPos][jPos] = 1;
            }
            laivatPlayer.shift();
        }
    }
}
function fireEnemy(i, j) {
    if (enemyGrid[i][j] === 1) {
        enemyGrid[i][j] = 2;
        document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "red";
        enemyHealth--;
        if (enemyHealth <= 0) {
            alert("VOITIT PELIN");
        }
    }
    else if (enemyGrid[i][j] === 0) {
        enemyGrid[i][j] = 3;
        document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "purple";
    }
    else {
        alert("ÄLÄ AMMU SAMAA KOHTAA");
    }
    firePlayer()
}

let edellinenOsumaI;
let edellinenOsumaJ;
let x;
let y;
let valueReset = false;
let osu = false;
/*firePlayer functioniin on koodattu alkeellinen AI
Toiminta: Ampuu randomilla -> Osuessa tarkistaa viereisen ruudun
-> Jos osuu jatkaa samaan suuntaan kunnes ampuu huti ->
Huti ampuessa tarkastaa vastakkaisen suunnan ->
Vastakkaisessa suunnassa huti ampuessa tarkistaa toisen
akselin samalla tavalla kuin kuin ensimmäisen akselin.
Ensimmäisen akselin tarkistus suunta on random.
*/
function firePlayer() {
    let i = Math.floor(Math.random() * gridSize);
    let j = Math.floor(Math.random() * gridSize);

    if (osu === false) {
        x = 1;
        y = 1;
        if (playerGrid[i][j] === 1) {
            playerGrid[i][j] = 2;
            document.getElementById(i.toString() + j.toString()).style.backgroundColor = "red";
            playerHealth--;
            edellinenOsumaI = i;
            edellinenOsumaJ = j;
            if (playerHealth <= 0) {
                alert("PIRU VOITTI!");
            }
            osu = true;
        }
        else if (playerGrid[i][j] === 0) {
            playerGrid[i][j] = 3;
            document.getElementById(i.toString() + j.toString()).style.backgroundColor = "purple";
        }
        else {
            firePlayer();
        }
    }
    else if (osu) {
        if (edellinenOsumaJ + x < gridSize && playerGrid[edellinenOsumaI][edellinenOsumaJ + x - 1] === 2 && valueReset === false) {
            if (playerGrid[edellinenOsumaI][edellinenOsumaJ + x] === 1) {
                playerGrid[edellinenOsumaI][edellinenOsumaJ + x] = 2;
                document.getElementById(edellinenOsumaI.toString() + (edellinenOsumaJ + x).toString()).style.backgroundColor = "red";
                playerHealth--;
                x++;
            }
            else if (playerGrid[edellinenOsumaI][edellinenOsumaJ + x] === 0) {
                playerGrid[edellinenOsumaI][edellinenOsumaJ + x] = 3;
                document.getElementById(edellinenOsumaI.toString() + (edellinenOsumaJ + x).toString()).style.backgroundColor = "purple";
                x++;
            }
            else {
                x++;
                firePlayer();
            }
        }
        else if (edellinenOsumaJ - y >= 0 && playerGrid[edellinenOsumaI][edellinenOsumaJ - y + 1] === 2 && valueReset === false) {
            if (playerGrid[edellinenOsumaI][edellinenOsumaJ - y] === 1) {
                playerGrid[edellinenOsumaI][edellinenOsumaJ - y] = 2;
                document.getElementById(edellinenOsumaI.toString() + (edellinenOsumaJ - y).toString()).style.backgroundColor = "red";
                playerHealth--;
                y++;
            }
            else if (playerGrid[edellinenOsumaI][edellinenOsumaJ - y] === 0) {
                playerGrid[edellinenOsumaI][edellinenOsumaJ - y] = 3;
                document.getElementById(edellinenOsumaI.toString() + (edellinenOsumaJ - y).toString()).style.backgroundColor = "purple";
                y++;
            }
            else {
                y++;
                firePlayer();
            }
        }
        else if (valueReset === false) {
            x = 1;
            y = 1;
            valueReset = true;
        }
        if (valueReset) {
            if (edellinenOsumaI + x < gridSize && playerGrid[edellinenOsumaI + x - 1][edellinenOsumaJ] === 2) {
                if (playerGrid[edellinenOsumaI + x][edellinenOsumaJ] === 1) {
                    playerGrid[edellinenOsumaI + x][edellinenOsumaJ] = 2;
                    document.getElementById((edellinenOsumaI + x).toString() + edellinenOsumaJ.toString()).style.backgroundColor = "red";
                    playerHealth--;
                    x++;
                }
                else if (playerGrid[edellinenOsumaI + x][edellinenOsumaJ] === 0) {
                    playerGrid[edellinenOsumaI + x][edellinenOsumaJ] = 3;
                    document.getElementById((edellinenOsumaI + x).toString() + edellinenOsumaJ.toString()).style.backgroundColor = "purple";
                    x++;
                }
                else {
                    x++;
                    firePlayer();
                }
            }
            else if (edellinenOsumaI - y >= 0 && playerGrid[edellinenOsumaI - y + 1][edellinenOsumaJ] === 2) {
                if (playerGrid[edellinenOsumaI - y][edellinenOsumaJ] === 1) {
                    playerGrid[edellinenOsumaI - y][edellinenOsumaJ] = 2;
                    document.getElementById((edellinenOsumaI - y).toString() + edellinenOsumaJ.toString()).style.backgroundColor = "red";
                    playerHealth--;
                    y++;
                }
                else if (playerGrid[edellinenOsumaI - y][edellinenOsumaJ] === 0) {
                    playerGrid[edellinenOsumaI - y][edellinenOsumaJ] = 3;
                    document.getElementById((edellinenOsumaI - y).toString() + edellinenOsumaJ.toString()).style.backgroundColor = "purple";
                    y++;
                }
                else {
                    y++;
                    firePlayer();
                }
            }
            else {
                osu = false;
                valueReset = false;
                firePlayer();
            }
        }
        if (playerHealth <= 0) {
            alert("PIRU VOITTI!");
        }
    }
}

function grid() {
    gridSize = Number(document.getElementById("selainGrid").value);
    createGrid(gridSize);
    createVisiblePlayerGrid(gridSize);
    let elements = document.getElementsByClassName("playerDiv");
    Array.from(elements).forEach(function (element) {
        element.addEventListener('click', setupGame);
    });
    document.addEventListener('keydown', shipAxis);
    removeButton();
}

var setupGame = function () {
    var attribute = this.getAttribute("id");
    placePlayerShip(laivatPlayer[0], Number(attribute.slice(0, 1)), Number(attribute.slice(1, 2)), playerShipSuunta);
    setPlayerShip();

    if (laivatPlayer.length === 0 && showEnemy) {
        createVisibleEnemyGrid(gridSize);
        let elements2 = document.getElementsByClassName("enemyDiv");
        Array.from(elements2).forEach(function (element2) {
            element2.addEventListener('click', awakeFireEnemy);
        });
        showEnemy = false;
    }
};
var awakeFireEnemy = function () {
    var attribute = this.getAttribute("id");
    fireEnemy(Number(attribute.slice(0, 1)), Number(attribute.slice(2, 3)));
};

function shipAxis(e) {
    if (e.code === "ArrowUp") {
        playerShipSuunta = 0;
    }
    if (e.code === "ArrowDown") {
        playerShipSuunta = 1;
    }
}

function setPlayerShip() {
    let x = 0;
    for (let i = 0; i < playerGrid.length; i++) {
        for (let j = 0; j < playerGrid[i].length; j++) {
            if (playerGrid[i][j] === 1) {
                document.getElementById(i.toString() + j.toString()).style.backgroundColor = "blue";
                x++;
            }

        }
    }
}

function setEnemyShip() {
    for (let i = 0; i < enemyGrid.length; i++) {
        for (let j = 0; j < enemyGrid[i].length; j++) {
            if (enemyGrid[i][j] === 1) {
                //Show enemy ship position
                //document.getElementById(i.toString() + "," + j.toString()).style.backgroundColor = "blue";
            }
        }
    }
}

function removeButton() {
    var elem = document.getElementById('button');
    elem.parentNode.removeChild(elem);
    return false;
}