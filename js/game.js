const game = {
    canvas: null,
    ctx: null,
    board: null,
    snake: null,
    SNAKE_SPEED: 300,
    width: 0,
    height: 0,
    sprites: {
        background: null,
        cell: null,
        body: null,
        food: null
    },
    dimensions: {
        max: {
            width: 640,
            height: 360
        },
        min: {
            width: 300,
            height: 300
        }
    },
    init() {
        this.canvas = document.getElementById('mycanvas');
        this.ctx = this.canvas.getContext('2d');
        this.initDimensions();
    },
    initDimensions() {
        const data = {
            maxWidth: this.dimensions.max.width,
            maxHeight: this.dimensions.max.height,
            minWidth: this.dimensions.min.width,
            minHeight: this.dimensions.min.height,
            relWidth: window.innerWidth,
            relHeight: window.innerHeight
        };

        if (data.relHeight - data.relWidth > 0) {
            this.fitHeight(data);
        } else {
            this.fitWidth(data);
        }

        this.canvas.style.height = '100%';
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },
    fitWidth(data) {
        this.width = data.relWidth;

        this.height = Math.ceil(this.width * data.relHeight / data.relWidth);
        this.height = Math.min(data.maxHeight, this.height);
        this.height = Math.max(data.minWidth, this.height);

        this.width = Math.ceil(data.relWidth * this.height / data.relHeight);
    },
    fitHeight(data) {
        this.height = data.maxHeight;

        this.width = Math.ceil(this.height * data.relWidth / data.relHeight);

        this.width = Math.min(this.width, data.maxWidth);
        this.width = Math.max(this.width, data.minWidth);

        this.height = Math.ceil(data.relHeight * this.width / data.relWidth);
    },
    start() {
        this.init();
        this.preload(() => {
            this.run();
        });
    },
    preload(callback) {
        const require = Object.keys(this.sprites).length;
        let loaded = 0;

        function onLoadAsset() {
            loaded++;
            if (loaded >= require) {
                callback();
            }
        }

        const { sprites } = this;

        for (const spriteName in sprites) {
            sprites[spriteName] = new Image();
            sprites[spriteName].addEventListener('load', onLoadAsset);
            sprites[spriteName].src = './img/' + spriteName + '.png';
        }
    },
    update() {
        this.snake.move();
        this.render();
    },
    create() {
        this.board.create();
        this.snake.create();
        this.board.createFood();

        const { snake, snake: { directions } } = this;

        snake.direction = directions.up;

        document.addEventListener('keydown', e => {
            let isUnexpectCode = false;

            switch (e.code) {
                case 'ArrowUp' :
                    snake.direction = directions.up;
                    break;
                case 'ArrowDown' :
                    snake.direction = directions.down;
                    break;
                case 'ArrowRight' :
                    snake.direction = directions.right;
                    break;
                case 'ArrowLeft' :
                    snake.direction = directions.left;
                    break;
                default :
                    isUnexpectCode = true;
            }
            if (!this.snake.moving && !isUnexpectCode) {
                this.snake.moving = true;
            }
        });
    },
    run() {
        this.create();

        setInterval(() => {
            this.update();
        }, this.SNAKE_SPEED);
    },
    render() {
        const { ctx, sprites, board, snake, width, height } = this;
        const background = sprites.background;

        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(background, (this.width - background.width) / 2, (this.height - background.height) / 2);
            board.render();
            snake.render();
        });
    },
    random(min, max) {
        return Math.round(min + Math.random() * max);
    }
};
