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

        const pool = this.cells.filter(cell => !game.snake.hasCell(cell) && !cell.type);

        return pool[game.random(0, pool.length - 1)];
    },
    createObjectInCell(type) {
        const cell = this.getRandomAvailableCell();

        if (cell) {
            cell.type = type;
        }
    },
    createFood() {
        this.createObjectInCell('food');
    },
    createBomb() {
        const cellWithBomb = this.cells.find(cell => cell.type === 'bomb');

        if (cellWithBomb) {
            cellWithBomb.type = null;
        }

        this.createObjectInCell('bomb');
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
        return cell.type === 'food';
    },
    isCellBomb(cell) {
        return cell.type === 'bomb';
    },
    removeFoodFromCell(cell) {
        cell.type = null;
        this.game.showDialog('likes');
        this.game.sounds.food.play();
    },
    removeBombFromCell(cell) {
        cell.type = null;
        this.game.showDialog('wrongs');
        this.game.sounds.bomb.play();
    },
    getCellByCollRow(coll, row) {
        return this.cells.find(cell => (cell.row === row && cell.coll === coll));
    },
    render() {
        const { ctx, sprites } = game;

        for (const cell of this.cells) {
            ctx.drawImage(sprites.cell, cell.x, cell.y);

            if (cell.type === 'food') {
                ctx.drawImage(sprites.food, cell.x, cell.y);
            }

            if (cell.type === 'bomb') {
                ctx.drawImage(sprites.bomb, cell.x, cell.y);
            }
        }
    }
}
