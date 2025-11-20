import { TestResults, advanceToFrame, canvasStatus, getShapes, globalVariableExists } from "../../lib/test-utils.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    if (globalVariableExists("sprites")) {
        const testArr = ["grass,0,0","grass,0,20","grass,0,40","rock,20,0","rock,20,20","sand,20,40","sand,40,0","water,40,20","water,40,40","foxcat,20,20"];
        const expectedSprites = [new Sprite(grass, 0, 0), new Sprite(grass, 0, 20), new Sprite(grass, 0, 40), new Sprite(rock, 20, 0), new Sprite(rock, 20, 20), 
        new Sprite(sand, 20, 40), new Sprite(sand, 40, 0), new Sprite(water, 40, 20), new Sprite(water, 40, 40), new Sprite(foxcat, 20, 20)];
        const testArrStr = '["' + testArr.join('", "') + '"]';
        TestResults.addInfo(`All tests are carried out using the following string array in place of the lines loaded from a scene test file: <code>${testArrStr}</code>. Your code should work for any array of strings in the correct format.`);
        background(255);
        sprites = [];
        createSprites(testArr);
        advanceToFrame(frameCount+1);
        if (sprites.length === 10) {
            TestResults.addPass("The global <code>sprites</code> array contains 10 elements.");
        } else {
            TestResults.addFail(`Expected the global <code>sprites</code> array to contain 10 elements. Found ${sprites.length}.`);
        }
        const spriteObjects = sprites.filter(s => s instanceof Sprite);
            
        if (sprites.length > 0) {
            if (spriteObjects.length === sprites.length) {
                TestResults.addPass("All elements in the <code>sprites</code> array are instances of the <code>Sprite</code> class.");
            } else {
                TestResults.addFail(`Expected all elements in the <code>sprites</code> array to be instances of the <code>Sprite</code> class. ${spriteObjects.length} of the ${sprites} elements are <code>Sprite</code> objects.`);
            }
        }
        
        const displayedImages = getShapes().filter(s => s.type === IMAGE);
        if (displayedImages.length > 0 && displayedImages.length % 10 === 0) {
            TestResults.addPass("The expected number of images are drawn on the canvas.");
        } else {
            if (displayedImages.length === 0) {
                TestResults.addFail("Expected 10 images to be drawn on the canvas. Found 0. This may mean the Sprites have not been created correctly or not pushed to the global array.");
            }
            else {
                TestResults.addFail(`Expected a multiple of 10 images to be drawn on the canvas (10 images should be drawn each frame) but found ${displayedImages.length}.`);
            }
        }
        if (spriteObjects.length === expectedSprites.length) {
            let allMatch = true;
            for (let i = 0; i < spriteObjects.length; i++) {
                if (spriteObjects[i].getImage() !== expectedSprites[i].getImage() || spriteObjects[i].getX() !== expectedSprites[i].getX() || spriteObjects[i].getY() !== expectedSprites[i].getY()) {
                    allMatch = false;
                    TestResults.addFail(`The <code>Sprite</code> at index ${i} in the <code>sprites</code> array is not as expected.${spriteObjects[i].getImage() === expectedSprites[i].getImage() ? " The correct image is used.": " The incorrect image is used."}${spriteObjects[i].getX() === expectedSprites[i].getX() ? " The x coordinate is correct." : " Expected the x coordinate to be " + expectedSprites[i].getX() + " (number) but found " + spriteObjects[i].getX() + " (" + typeof spriteObjects[i].getX() + ")."}${spriteObjects[i].getY() === expectedSprites[i].getY() ? " The y coordinate is correct." : " Expected the y coordinate to be " + expectedSprites[i].getY() + " (number) but found " + spriteObjects[i].getY() + " (" + typeof spriteObjects[i].getY() + ")."}`)
                }
            }
            if (spriteObjects.length > 0 && allMatch) {
                TestResults.addPass("The expected <code>Sprite</code> objects are stored in the <code>sprites</code> array.")
            }
        } else {
            TestResults.addFail(`Unable to test if the <code>Sprite</code> objects are correct as ${spriteObjects.length} were found when ${expectedSprites.length} were expected.`);
        }
    } else {
        TestResults.addFail("The global variable <code>sprites</code> included in the original code no longer exists. Did you rename or delete it? Unable to run further tests.");
    }
    // Clear sprites, load in custom tiles, check the array is populated correctly
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
