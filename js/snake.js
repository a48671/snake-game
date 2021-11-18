game.snake = {
    game: game,
    board: game.board,
    cells: [],
    moving: false,
    create() {
        const startCells = [{ coll: 7, row: 7 }, { coll: 7, row: 8 }];

        for ({ coll, row } of startCells) {
            this.cells.push(this.board.getCellByCollRow(coll, row));
        }
    },
    move() {
        if (!this.moving) {
            return;
        }

        const cell = this.getNextCell();

        if (cell) {
            this.cells.unshift(cell);
            this.cells.pop();
        }
    },
    getNextCell() {
        const head = this.cells[0];
        const row = head.row - 1;
        const coll = head.coll;

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
