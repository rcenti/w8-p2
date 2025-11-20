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

function correctGetWords(lines) {
    let words = [];
    for (let line of lines) {
        let split = splitTokens(line, " ,.!'?[]();\\-:*%&=@#{}\"/\\\\_<>~");
        for (let word of split) {
            words.push(word);
        }
    }
    return words;
}

function testHamlet(lines) {
    const resultsDiv = document.getElementById("results");
    const words = getWords(lines);
    if (words.length === 35135) {
        TestResults.addPass("<code>getWords()</code> returns an array of 35135 words when passed the contents of hamlet.txt.");
    } else {
        TestResults.addFail(`Expected <code>getWords()</code> to return an array of 35135 words when passed the contents of hamlet.txt. The type of the returned value was ${typeof words} and its length was ${words.length}.`);
    }
    if (window.hasOwnProperty("countOccurrences")) {
        const hamletCount = 121;
        const opheliaCount = 30;
        const horatioCount = 47;
        const denmarkCount = 28;
        const correctWords = correctGetWords(lines);
        const foundHamlet = countOccurrences(correctWords, "hamlet");
        const foundOphelia = countOccurrences(correctWords, "ophelia");
        const foundHoratio = countOccurrences(correctWords, "horatio");
        const foundDenmark = countOccurrences(correctWords, "denmark");
        if (hamletCount === foundHamlet) {
            TestResults.addPass("The frequency of Hamlet is calculated correctly (121 occurrences).");
        } else {
            TestResults.addFail(`The frequency of Hamlet should be 121 occurrences. <code>countOccurrences()</code> returns ${foundHamlet}. Make sure your function is case insensitive and only counting whole-word matches.`);
        }
        if (opheliaCount === foundOphelia) {
            TestResults.addPass("The frequency of Ophelia is calculated correctly (30 occurrences).");
        } else {
            TestResults.addFail(`The frequency of Ophelia should be 30 occurrences. <code>countOccurrences()</code> returns ${foundOphelia}. Make sure your function is case insensitive and only counting whole-word matches.`);
        }
        if (horatioCount === foundHoratio) {
            TestResults.addPass("The frequency of Horatio is calculated correctly (47 occurrences).");
        } else {
            TestResults.addFail(`The frequency of Horatio should be 47 occurrences. <code>countOccurrences()</code> returns ${foundHoratio}. Make sure your function is case insensitive and only counting whole-word matches.`);
        }
        if (denmarkCount === foundDenmark) {
            TestResults.addPass("The frequency of Denmark is calculated correctly (28 occurrences).");
        } else {
            TestResults.addFail(`The frequency of Denmark should be 28 occurrences. <code>countOccurrences()</code> returns ${foundHamlet}. Make sure your function is case insensitive and only counting whole-word matches.`);
        }
    }
    TestResults.display(resultsDiv);
}

function checkGetWords() {
    if (window.hasOwnProperty("getWords") && typeof getWords === "function") {
        TestResults.addPass("The sketch contains a function called <code>getWords</code>.")
        // Check one argument
        if (getWords.length === 1) {
            TestResults.addPass("<code>getWords()</code> has one parameter.");
        } else {
            TestResults.addFail(`Expected <code>getWords()</code> to have one parameter. Found ${getWords.length}.`);
        }
        // Check word count for Hamlet
        loadStrings("./assets/hamlet.txt", testHamlet); 
        // Pass a custom array
        const testArr = ["Th!s 1s a line? of text", "Here's another."];
        const wordsFound = getWords(testArr);
        if (wordsFound.length === 10) {
            TestResults.addPass(`<code>getWords()</code> returns an array of 10 words when passed the following argument: ['${testArr[0]}', '${testArr[1]}]'`);
        } else {
            TestResults.addFail(`<code>getWords()</code> should return an array of 10 words when passed this argument: ['${testArr[0]}', '${testArr[1]}]'. The returned array should be: ["Th", "s", "1s", "a", "line", "of", "text", "Here", "s", "another"]. <code>getWords()</code> returned ["${wordsFound.join("\", \"")}"].`)
        }
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>getWords</code>.")
    }
}

function checkCountOccurrences() {
    if (window.hasOwnProperty("countOccurrences")) {
        TestResults.addPass("The sketch contains a function called <code>countOccurrences</code>.");
        if (countOccurrences.length === 2) {
            TestResults.addPass("<code>countOccurrences()</code> has two parameters.");
        } else {
            TestResults.addFail(`<code>countOccurrences()</code> should take two arguments. Found ${countOccurrences.length}`);
        }
        const testArr = ["apple", "apples", "Apple", "APPLE", "apple8"];
        const lowerCount = countOccurrences(testArr, "apple");
        const upperCount = countOccurrences(testArr, "APPLE");
        if (lowerCount === 3) {
            TestResults.addPass(`<code>countOccurrences(["apple", "apples", "Apple", "APPLE", "apple8"], "apple")</code> returns 3.`);
        } else {
            TestResults.addFail(`<code>countOccurrences(["apple", "apples", "Apple", "APPLE", "apple8"], "apple")</code> should return 3. Found ${lowerCount}`);
        }
        if (upperCount === 3) {
            TestResults.addPass(`<code>countOccurrences(["apple", "apples", "Apple", "APPLE", "apple8"], "APPLE")</code> returns 3.`);
        } else {
            TestResults.addFail(`<code>countOccurrences(["apple", "apples", "Apple", "APPLE", "apple8"], "APPLE")</code> should return 3. Found ${upperCount}`);
        }
        if (lowerCount !== upperCount) {
            TestResults.addWarning("<code>countOccurrences()</code> may not be case insensitive.");
        }
    } else {
        TestResults.addFail("The sketch does not contain a function called <code>countOccurrences</code>.")
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    substituteDraw();
    const resultsDiv = document.getElementById("results");
    for (const e of canvasStatus.errors) {
        TestResults.addFail(`In frame ${frameCount}, ${e}`);
    }
    checkLoadInPreload();
    checkGetWords();
    checkCountOccurrences();
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
