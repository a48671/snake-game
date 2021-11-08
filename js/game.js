const game = {
    canvas: null,
    ctx: null,
    board: null,
    width: 640,
    height: 360,
    sprites: {
        background: null,
        cell: null
    },
    init() {
        this.canvas = document.getElementById('mycanvas');
        this.ctx = this.canvas.getContext('2d');
    },
    start() {
        this.init();
        this.preload(() => {
            this.board.create();
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
    run() {
        window.requestAnimationFrame(() => {
            this.render();
        });
    },
    render() {
        const { ctx, sprites, board } = this;

        ctx.drawImage(sprites.background, 0, 0);
        board.render();
    }
};
