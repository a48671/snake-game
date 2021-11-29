game.snake = {
    game: game,
    board: game.board,
    cells: [],
    moving: false,
    directions: {
        up: {
            row: -1,
            coll: 0
        },
        down: {
            row: 1,
            coll: 0
        },
        right: {
            row: 0,
            coll: 1
        },
        left: {
            row: 0,
            coll: -1
        }
    },
    direction: null,
    create() {
        const startCells = [{ coll: 7, row: 7 }, { coll: 7, row: 8 }];

        for ({ coll, row } of startCells) {
            this.cells.push(this.board.getCellByCollRow(coll, row));
        }
    },
    hasCell(cell) {
      return !!this.cells.find(part => part === cell);
    },
    move() {
        if (!this.moving) {
            return;
        }

        const cell = this.getNextCell();

        if (cell) {
            this.cells.unshift(cell);

            if (!this.board.isCellFood(cell)) {
                this.cells.pop();
            } else {
                this.board.removeFoodFromCell(cell);
                this.board.createFood();
            }
        }
    },
    getNextCell() {

        if (!this.direction) return ;

        const head = this.cells[0];

        const row = head.row + this.direction.row;
        const coll = head.coll + this.direction.coll;

        return this.board.getCellByCollRow(coll, row);
    },
    render() {
        const body = this.game.sprites.body;
        const ctx = this.game.ctx;

        for ({ x, y } of this.cells) {
            ctx.drawImage(body, x, y);
        }
    }
};
