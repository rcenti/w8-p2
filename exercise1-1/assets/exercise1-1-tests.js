import { TestResults, canvasStatus, testSettingIsCalled, LOAD_STRINGS, simulateKeyboardEvent, advanceToFrame, getShapes, substituteDraw } from "../../lib/test-utils.js";

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

function checkLoadInPreload() {
    const loadInPreload = testSettingIsCalled(LOAD_STRINGS, false, false, true);
    const loadInSetup = testSettingIsCalled(LOAD_STRINGS, true, false, false);
    const loadInDraw = testSettingIsCalled(LOAD_STRINGS, false, true, false);
    if (loadInPreload) {
        TestResults.addPass("<code>loadStrings()</code> is called in <code>preload()</code>.");
    }
    if (loadInSetup) {
        TestResults.addWarning("<code>loadStrings()</code> is called in <code>setup()</code>. Although this can work, it should only be called in <code>preload()</code> to ensure the sound file is fully loaded before any other code is run.");
    }
    if (loadInDraw) {
        TestResults.addFail("<code>loadStrings()</code> should not be called in <code>draw()</code> because it will repeatedly load the text file.");
    }
    if (!loadInPreload && !loadInSetup && !loadInDraw) {
        TestResults.addWarning("<code>loadStrings()</code> does not appear to be called (this test will not detect usage of <code>loadStrings()</code> outside <code>preload()</code>, <code>setup()</code>, or <code>draw()</code>).");
    }
}

function pressKeyAndAdvance(keyName, hasPressed, hasReleased, hasTyped) {
    if (hasPressed) {
        simulateKeyboardEvent(keyPressed, keyName);
    }
    if (hasReleased) {
        simulateKeyboardEvent(keyReleased, keyName);
    }
    if (hasTyped) {
        simulateKeyboardEvent(keyTyped, keyName);
    }
    advanceToFrame(frameCount + 1);
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    substituteDraw();
    const resultsDiv = document.getElementById("results");
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    checkLoadInPreload();
    // Test keypressed / typed / released a few times and save the text
    const hasKeyPressed = window.hasOwnProperty("keyPressed");
    const hasKeyReleased = window.hasOwnProperty("keyReleased");
    const hasKeyTyped = window.hasOwnProperty("keyTyped");
    if (!hasKeyPressed && !hasKeyReleased && !hasKeyTyped) {
        TestResults.addFail("No keyboard event functions have been implemented. Not running any more tests.");
    } else {
        // Check the text is different at least some of the time
        const selectedReviews = new Set();
        pressKeyAndAdvance("g", hasKeyPressed, hasKeyReleased, hasKeyTyped);
        const text1 = getShapes().filter(s => s.type === TEXT);
        if (text1.length === 1) {
            TestResults.addPass("When a key is pressed, text is displayed on the canvas.");
        } else if (text1.length === 0) {
            TestResults.addFail("When a key is pressed, no text is displayed on the canvas. Unable to run more tests.");
        } else {
            TestResults.addWarning(`When a key is pressed, ${text1.length} instances of text are on the canvas. Expected 1. This may happen if you have forgotten to call <code>background()</code> to cover old text or if you are displaying text instructions or the review label.`);
        }
        for (const t of text1) {
            selectedReviews.add(t.msg);
        }
        pressKeyAndAdvance("h", hasKeyPressed, hasKeyReleased, hasKeyTyped);
        const text2 = getShapes().filter(s => s.type === TEXT);
        if (text2.length > text1.length) {
            TestResults.addFail("When a second key is pressed, there are more text instances on the screen than expected. Did you forget to call <code>background()</code> before displaying the text?");
        }
        for (const t of text2) {
            selectedReviews.add(t.msg);
        }
        pressKeyAndAdvance("o", hasKeyPressed, hasKeyReleased, hasKeyTyped);
        const text3 = getShapes().filter(s => s.type === TEXT);
        for (const t of text3) {
            selectedReviews.add(t.msg);
        }
        if (selectedReviews.size > 0) {
            if (selectedReviews.size === 1) {
                // Not adding different text
                TestResults.addFail("After three key presses, it looks like the same text is drawn on screen. Are you selecting a random review and displaying it?");
            } else {
                TestResults.addPass("Different text is displayed each time a key is pressed.")
            }
            // Check the text does not end with 1 or 0
            let endsWithNumber = 0;
            for (const r of selectedReviews) {
                if (r.endsWith("1") || r.endsWith("0")) {
                    endsWithNumber++;
                }
            }
            if (endsWithNumber === 0) {
                TestResults.addPass("The review text is separated from the review label.");
            } else {
                TestResults.addFail("The review text does not appear to be separated from the review label.");
            }
        }
    }

    // Is it possible to intercept random and use a predefined number?
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
