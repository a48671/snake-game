game.snake = {
    game: game,
    board: game.board,
    cells: [],
    moving: false,
    directions: {
        up: {
            row: -1,
            coll: 0,
            angle: 0
        },
        down: {
            row: 1,
            coll: 0,
            angle: 180
        },
        right: {
            row: 0,
            coll: 1,
            angle: 90
        },
        left: {
            row: 0,
            coll: -1,
            angle: 270
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

            if (this.board.isCellBomb(cell)) {
                this.board.removeBombFromCell(cell);
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
    renderHead() {
        const { x, y } = this.cells[0];
        const ctx = this.game.ctx;
        const head = this.game.sprites.head;
        const halfSize = head.width / 2;

        const degree = this.direction.angle;

        ctx.save();

        ctx.translate(x + halfSize, y + halfSize);
        ctx.rotate(degree * Math.PI / 180);

        ctx.drawImage(head, -halfSize, -halfSize);

        ctx.restore();
    },
    renderBody() {
        const body = this.game.sprites.body;
        const ctx = this.game.ctx;

        for (let index = this.cells.length; --index;) {
            const { x, y } = this.cells[index];
            ctx.drawImage(body, x, y)
        }
    },
    render() {
        this.renderBody();
        this.renderHead();
    }
};
