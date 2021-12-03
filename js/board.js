game.board = {
    game: game,
    cells: [],
    size: 15,
    offsets: { offsetX: 0, offsetY: 0 },
    cell: { width: 0, height: 0 },
    OFFSET_BETWEEN_CELLS: 1,
    create() {
        this.setCell();
        this.setOffsets();
        this.createCells();
    },
    getRandomAvailableCell() {

        const pool = this.cells.filter(cell => !game.snake.hasCell(cell));

        return pool[game.random(0, pool.length - 1)];
    },
    createFood() {
        const cell = this.getRandomAvailableCell();

        if (cell) {
            cell.hasFood = true;
        }
    },
    createCells() {
        for (let row = 0; row < this.size; row++) {
            for (let coll = 0; coll < this.size; coll++) {
                this.cells.push(this.createCell(row, coll));
            }
        }
    },
    createCell(row, coll) {
        const cellWidth = this.cell.width + this.OFFSET_BETWEEN_CELLS;
        const cellHeight = this.cell.height + this.OFFSET_BETWEEN_CELLS;

        return ({
            coll,
            row,
            x: Math.ceil(this.offsets.offsetX + cellWidth * coll),
            y: Math.ceil(this.offsets.offsetY + cellHeight * row)
        });
    },
    setCell() {
        this.cell.width = game.sprites.cell.width;
        this.cell.height = game.sprites.cell.height;
    },
    setOffsets() {
        const cellWidth = this.cell.width + this.OFFSET_BETWEEN_CELLS;
        const cellHeight = this.cell.height + this.OFFSET_BETWEEN_CELLS;
        const boardWidth = cellWidth * this.size;
        const boardHeight = cellHeight * this.size;

        this.offsets.offsetX = (game.width - boardWidth) / 2;
        this.offsets.offsetY = (game.height - boardHeight) / 2;
    },
    isCellFood(cell) {
        return cell.hasFood;
    },
    removeFoodFromCell(cell) {
        cell.hasFood = false;
        const like = document.getElementById('like');
        like.classList.add('shown');
        setTimeout(function () {
            like.classList.remove('shown');
        }, 2000);
    },
    getCellByCollRow(coll, row) {
        return this.cells.find(cell => (cell.row === row && cell.coll === coll));
    },
    render() {
        const { ctx, sprites } = game;

        for (const cell of this.cells) {
            ctx.drawImage(sprites.cell, cell.x, cell.y);
            if (cell.hasFood) {
                ctx.drawImage(sprites.food, cell.x, cell.y);
            }
        }
    }
}
