Array.prototype.lighten = function() {
    let r = Math.min(255, this[0] + 80);
    let b = Math.min(255, this[1] + 80);
    let g = Math.min(255, this[2] + 80);
    return [r,g,b];
}

Array.prototype.darken = function() {
    let r = Math.max(0, this[0] - 80);
    let g = Math.max(0, this[1] - 80);
    let b = Math.max(0, this[2] - 80);
    return [r,g,b];
}

Array.prototype.rotate = function() {
    let clone = [];

    for (let i = this[0].length - 1; i > -1; i--) {
        clone.push([]);
        for (let j = 0; j < this.length; j++) {
            clone[clone.length-1].push(this[j][i]);
        }
    }

    return clone;
}

const ROWS = 15;

const cellSize = innerHeight / ROWS;

const GAME_OBJECTS = [];

class Block {
    constructor(color=[128, 0, 0]) {
        [ this.r, this.g, this.b ] = color;
        this.color = color;
        GAME_OBJECTS.push(this);
    }

    drawBlock(x, y) {
        noStroke();

        fill(this.r, this.g, this.b);
        rect(x, y, cellSize, cellSize);

        let sizeUnit = cellSize/10;

        let [r, g, b] = this.color;

        [ r, g, b ] = this.color.lighten();
        fill(r, g, b);
        rect(x, y, cellSize, sizeUnit);
        rect(x, y, sizeUnit, cellSize);

        [ r, g, b ] = this.color.darken();
        fill(r, g, b);
        rect(x + cellSize - sizeUnit, y, sizeUnit, cellSize);
        rect(x, y + cellSize - sizeUnit, cellSize, sizeUnit);
    }
}

class BorderBlock extends Block {
    constructor() {
        super([51, 51, 51]);
    }
}

class GameBlock extends Block {
    constructor(color=[128, 0, 0]) {
        super(color);
        this.canFall = true;
        this.canClear = true;
    }
}

class Piece {
    constructor(board, color=[128, 0, 0]) {
        this.color = color;
        this.structure = [
            [new Block(this.color), new Block(this.color)]
        ];
    }

    rotate() {
        this.structure = this.structure.rotate();
    }

    drawBlock(x, y) {
        for (let i = 0; i < this.structure.length; i++) {
            for (let j = 0; j < this.structure[i].length; j++) {
                if (this.structure[i][j]) this.structure[i][j].drawBlock(x + j * cellSize, y + i * cellSize);
            }
        }
    }
}

class Board {
    constructor() {
        this.columns = 10;
        this.rows = ROWS;
        this.boardArray = new Array(this.columns * this.rows).fill(0);
        this.leftBorder = new Array(this.rows).fill(0).map(v => new BorderBlock());
        this.rightBorder = new Array(this.rows).fill(0).map(v => new BorderBlock());

        this.x = innerWidth/2 - this.columns*cellSize/2;
        this.y = 0;
    }

    setSpace(x, y, val) {
        this.boardArray[this.columns * y + x] = val;
    }

    getSpace(x, y) {
        return this.boardArray[this.columns * y + x];
    }

    drawBlocks() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.boardArray[this.columns * j + i]) this.boardArray[this.columns * j + i].drawBlock(i * cellSize + this.x, j * cellSize + this.y); 
            }
        }
    }

    runPhysics() {
        for (let i = 0; i < this.columns; i++) {
            for (let j = this.rows - 1; j > -1; j--) {
                if (this.getSpace(i, j) == null) continue;
                if (this.getSpace(i, j+1) || this.getSpace(i, j+1) == undefined) continue;
                this.setSpace(i, j+1, this.getSpace(i, j));
                this.setSpace(i, j, 0);
            }
        }
    }

    drawBoard() {
        fill(0);
        noStroke();
        rect(this.x, this.y, this.columns * cellSize, this.rows * cellSize);

        this.leftBorder.forEach((v, i) => v.drawBlock(this.x - cellSize, this.y + i * cellSize));
        this.rightBorder.forEach((v, i) => v.drawBlock(this.x + this.columns * cellSize, this.y + i * cellSize));

        this.drawBlocks();
    }
}

let board;

function setup() {
    createCanvas(innerWidth, innerHeight);
    board = new Board();
    board.setSpace(2, 4, new Piece(board));
    board.setSpace(3, 0, new Piece(board));
}

function draw() {
    frameRate(3);
    background(5);
    board.drawBoard();
    board.runPhysics();
}

function keyPressed() {
}