let foxcat, grass, rock, sand, water;
let sprites = [];
let scene;

function preload() {
    foxcat = loadImage("assets/foxcat.png");
    grass = loadImage("assets/grass.png");
    rock = loadImage("assets/rock.png");
    sand = loadImage("assets/sand.png");
    water = loadImage("assets/water.png");
    scene = loadStrings("assets/scene1.txt");
}

function setup() {
    createCanvas(300, 300);
    createSprites(scene);
}

function draw() {
    for (let sprite of sprites) {
        sprite.draw();
    }
}

/**
 * Populates the sprites array with Sprite objects using the information stored in 
 * the scenes files
 * @param {string[]} tiles An array of strings storing information about the tiles 
 * that make up the scene. Each string in the array should have the format:
 * spriteName,xCoordinate,yCoordinate
 */
function createSprites(tiles) {
    
}

/**
 * A class representing a Sprite (or tile)
 */
class Sprite {
    #x;
    #y;
    #img;

    /**
     * Creates a new Sprite
     * @param {p5.Image} img The Sprite's image
     * @param {number} x The x coordinate (CORNER mode)
     * @param {number} y The y coordinate (CORNER mode)
     */
    constructor(img, x, y) {
        this.#img = img;
        this.#x = x;
        this.#y = y;
    }

    /**
     * Draws the Sprite
     */
    draw() {
        image(this.#img, this.#x, this.#y);
    }

    /**
     * Get the x coordinate of the sprite.
     * @returns {number} The x coordinate of the sprite (CORNER mode)
     */
    getX() {
        return this.#x;
    }

    /**
     * Gets the y coordinate of the sprite.
     * @returns {number} The y coordinate of the sprite (CORNER mode)
     */
    getY() {
        return this.#y;
    }

    /**
     * Gets the y coordinate of the sprite.
     * @returns {number} The width of the sprite.
     */
    getWidth() {
        return this.#img.width;
    }

    /**
     * Gets the sprite image object
     * @returns {p5.Image} The sprite's image object
     */
    getImage() {
        return this.#img;
    }
}