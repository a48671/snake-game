game.board = {
    game: game,
    cells: [],
    size: 15,
    create() {
        this.createCells();
    },
    createCells() {
        for (let row = 0; row < this.size; row++) {
            for (let coll = 0; coll < this.size; coll++) {
                this.cells.push(this.createCall(row, coll));
            }
        }
    },
    createCall(row, coll) {
        const cellSize = game.sprites.cell.width + 1;
        const boardWidth = cellSize * this.size;
        const boardHeight = cellSize * this.size;

        const offsetX = (game.width - boardWidth) / 2;
        const offsetY = (game.height - boardHeight) / 2;

        return ({
            coll,
            row,
            x: offsetX + cellSize * coll,
            y: offsetY + cellSize * row
        });
    },
    render() {
        const { ctx, sprites } = game;

        for (const cell of this.cells) {
            ctx.drawImage(sprites.cell, cell.x, cell.y);
        }
    }
}
