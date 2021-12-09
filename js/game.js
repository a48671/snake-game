const game = {
    likes: {
        'like-1': null
    },
    wrongs: {
        'wrong-1': null,
        'wrong-2': null,
        'wrong-3': null
    },
    canvas: null,
    ctx: null,
    board: null,
    snake: null,
    SNAKE_SPEED: 600,
    CHANGE_BOMB_CELL: 5000,
    TIMEOUT_FOR_SHOW_DIALOG: 2000,
    width: 0,
    height: 0,
    sprites: {
        background: null,
        cell: null,
        body: null,
        food: null,
        head: null,
        bomb: null
    },
    sounds: {
        theme: null,
        food: null,
        bomb: null
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
        const require = Object.keys(this.sprites).length +
            Object.keys(this.sounds).length +
            Object.keys(this.likes).length +
            Object.keys(this.wrongs).length;
        let loaded = 0;

        function onLoadAsset() {
            loaded++;
            if (loaded >= require) {
                callback();
            }
        }

        this.preloadSprites(onLoadAsset);
        this.preloadSounds(onLoadAsset);
        this.preloadLikes(onLoadAsset);
        this.preloadWrongs(onLoadAsset);
    },
    preloadSprites(onLoadAsset) {
        for (const spriteName in this.sprites) {
            this.sprites[spriteName] = new Image();
            this.sprites[spriteName].addEventListener('load', onLoadAsset);
            this.sprites[spriteName].src = './img/' + spriteName + '.png';
        }
    },
    preloadLikes(onLoadAsset) {
        for (const name in this.likes) {
            this.likes[name] = new Image();
            this.likes[name].addEventListener('load', onLoadAsset);
            this.likes[name].src = './img/' + name + '.jpg';
            this.likes[name].classList.add('dialog');
        }
    },
    preloadWrongs(onLoadAsset) {
        for (const name in this.wrongs) {
            this.wrongs[name] = new Image();
            this.wrongs[name].addEventListener('load', onLoadAsset);
            this.wrongs[name].src = './img/' + name + '.jpg';
            this.wrongs[name].classList.add('dialog');
        }
    },
    preloadSounds(onLoadAsset) {
        for (const soundName in this.sounds) {
            this.sounds[soundName] = new Audio();
            this.sounds[soundName].addEventListener('canplaythrough', onLoadAsset, { once: true });
            this.sounds[soundName].src = './sounds/' + soundName + '.mp3';
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
        this.board.createBomb();

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
                this.onSnakeStart();
                this.snake.moving = true;
            }
        });
    },
    run() {
        this.create();

        this.gameInterval = setInterval(() => {
            this.update();
        }, this.SNAKE_SPEED);

        this.bombInterval = setInterval(() => {
            if (!this.snake.moving) {
                return;
            }
            this.board.createBomb();
        }, this.CHANGE_BOMB_CELL);
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
    },
    onSnakeStart() {
        this.sounds.theme.volume = 0.2;
        this.sounds.theme.loop = true;
        this.sounds.theme.play();
    },
    getRandomImage(images) {
        const keys = Object.keys(images);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const key = keys[randomIndex];
        return images[key];
    },
    showDialog(type) {
        const { TIMEOUT_FOR_SHOW_DIALOG } = this;

        const imageElement = this.getRandomImage(this[type]);
        document.querySelector('body').appendChild(imageElement);
        setTimeout(function() {
            imageElement.classList.add('shown');
        }, 100);
        setTimeout(function() {
            imageElement.classList.remove('shown');
        }, TIMEOUT_FOR_SHOW_DIALOG);
        // setTimeout(function() {
        //     imageElement.remove();
        // }, TIMEOUT_FOR_SHOW_DIALOG + 1000);
    },
    stop() {
        clearInterval(this.gameInterval);
        clearInterval(this.bombInterval);
    }
};
