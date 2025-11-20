let bad;
let good;
let review;
let currentReview = "";



function preload(){
    review = loadStrings ("assets/imdb_labelled.txt");
    good = loadFont ("assets/PermanentMarker-Regular.ttf");
    bad = loadFont ("assets/RubikWetPaint-Regular.ttf");
}

function setup(){
    createCanvas(400, 400);
    currentFont = good;
    textFont(currentFont);

}

function draw(){
    background(0);
    fill(255);
    textFont(currentFont);
    text(currentReview, 20, 40, 360, 340);

    }

function mouseClicked(){
    let line = random(review);

    let parts = split(line, "\t");

    let textReview = parts[0];
    let label = parts[1];

    if (label === "1"){
        currentFont = good;

    } else{
        currentFont = bad
    }

    currentReview = textReview;

    console.log(textReview, label);
}
