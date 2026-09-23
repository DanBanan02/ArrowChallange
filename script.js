const shootButton =
    document.getElementById("shoot-button");

const arrow =
    document.querySelector(".arrow");


/* **************************
   ACTUAL ARROWHEAD + TARGET IMAGE
************************** */

const arrowHead =
    document.querySelector(".arrow-head");

const targetImage =
    document.querySelector(".target-area img");


const powerFill =
    document.querySelector(".power-fill");

const scoreText =
    document.getElementById("score");

const highscoreText =
    document.getElementById("highscore");

const hit1Text =
    document.getElementById("hit1");

const hit2Text =
    document.getElementById("hit2");

const hit3Text =
    document.getElementById("hit3");


/* **************************
   RESET BUTTONS
************************** */

const resetShotsButton =
    document.getElementById("reset-shots-button");

const resetHighscoreButton =
    document.getElementById("reset-highscore-button");


/* **************************
   MOVING TARGET CONTROLS
************************** */

const movingTargetToggle =
    document.getElementById("moving-target-toggle");

const movingTargetStatus =
    document.getElementById("moving-target-status");

const targetSpeedSlider =
    document.getElementById("target-speed");

const targetSpeedValue =
    document.getElementById("target-speed-value");


let movingTargetMode = false;

let targetSpeed =
    targetSpeedSlider
        ? Number(targetSpeedSlider.value)
        : 5;

let targetMoveX = 0;

let targetMoveDirection = 1;

let targetMoveAnimation;

let targetMoveLastTime = 0;


/* **************************
   STUCK ARROW VALUES
************************** */

let arrowStuck = false;

let stuckArrowLeft = 0;

let stuckTargetX = 0;


/* **************************
   SCORE VALUES
************************** */

let score = 0;

let highscore =
    Number(localStorage.getItem("highscore")) || 0;

let shotsTaken = 0;

let hit1 = 0;

let hit2 = 0;

let hit3 = 0;

let scoreTimeout;


/* **************************
   AIM VALUES
************************** */

let aimStartTime = 0;

let currentPower = 0;

let isCharging = false;

let powerAnimation;


/* **************************
   SHOW SAVED HIGH SCORE
************************** */

highscoreText.textContent =
    "High Score: " + highscore;


/* **************************
   SHOOTING SETTINGS
************************** */

const maxHoldTime = 600;


/* **************************
   ARROW TRAVEL VALUES
************************** */

const minX = 0;

const midX = 516;

const maxX = 1032;


/* **************************
   TEST
************************** */

/*
const minX = 510;

const midX = 510;

const maxX = 510;
*/


/* **************************
   PERFECT POWER - RANGE
************************** */

const midPowerMin = 0.495;

const midPowerMax = 0.505;


/* **************************
   POWER METER
************************** */

function updatePowerMeter()
{
    if (!isCharging)
    {
        return;
    }


    const holdTime =
        performance.now() - aimStartTime;


    const cycle =
        holdTime / maxHoldTime;


    const position =
        cycle % 2;


    currentPower =
        position <= 1
            ? position
            : 2 - position;


    powerFill.style.width =
        currentPower * 100 + "%";


    powerAnimation =
        requestAnimationFrame(
            updatePowerMeter
        );
}


/* **************************
   SET TARGET SPEED
************************** */

function setTargetSpeed(speed)
{
    targetSpeed =
        Number(speed);


    if (targetSpeedValue)
    {
        targetSpeedValue.textContent =
            targetSpeed;
    }
}


/* **************************
   TARGET MOVEMENT LIMITS
************************** */

function getTargetMoveLimits()
{
    const targetBox =
        targetImage.getBoundingClientRect();


    /* **************************
       REMOVE CURRENT MOVEMENT
       TO FIND ORIGINAL POSITION
    ************************** */

    const originalLeft =
        targetBox.left -
        targetMoveX;

    const originalRight =
        targetBox.right -
        targetMoveX;


    const screenPadding = 20;


    const maxRight =
        Math.max(
            0,
            window.innerWidth -
            screenPadding -
            originalRight
        );


    const maxLeft =
        Math.min(
            0,
            screenPadding -
            originalLeft
        );


    return {
        min: maxLeft,
        max: maxRight
    };
}


/* **************************
   MOVE TARGET
************************** */

function moveTarget(currentTime)
{
    if (!movingTargetMode)
    {
        return;
    }


    if (targetMoveLastTime === 0)
    {
        targetMoveLastTime =
            currentTime;
    }


    const timePassed =
        (currentTime - targetMoveLastTime) /
        1000;


    targetMoveLastTime =
        currentTime;


    const pixelsPerSecond =
        targetSpeed * 65;


    targetMoveX =
        targetMoveX +
        targetMoveDirection *
        pixelsPerSecond *
        timePassed;


    const targetMoveLimits =
        getTargetMoveLimits();


    /* **************************
       RIGHT EDGE
    ************************** */

    if (
        targetMoveX >=
        targetMoveLimits.max
    )
    {
        targetMoveX =
            targetMoveLimits.max;


        targetMoveDirection =
            -1;
    }


    /* **************************
       LEFT EDGE
    ************************** */

    else if (
        targetMoveX <=
        targetMoveLimits.min
    )
    {
        targetMoveX =
            targetMoveLimits.min;


        targetMoveDirection =
            1;
    }


    /* **************************
       MOVE TARGET IMAGE
    ************************** */

    targetImage.style.position =
        "relative";


    targetImage.style.left =
        targetMoveX + "px";


    /* **************************
       MOVE STUCK ARROW
       WITH TARGET
    ************************** */

    if (arrowStuck)
    {
        const targetDifference =
            targetMoveX -
            stuckTargetX;


        arrow.style.left =
            stuckArrowLeft +
            targetDifference +
            "px";
    }


    targetMoveAnimation =
        requestAnimationFrame(
            moveTarget
        );
}


/* **************************
   START MOVING TARGET
************************** */

function startMovingTarget()
{
    cancelAnimationFrame(
        targetMoveAnimation
    );


    targetMoveLastTime = 0;


    targetMoveAnimation =
        requestAnimationFrame(
            moveTarget
        );
}


/* **************************
   STOP MOVING TARGET
   RESET TARGET POSITION
************************** */

function stopMovingTarget()
{
    cancelAnimationFrame(
        targetMoveAnimation
    );


    targetMoveLastTime = 0;


    /* **************************
       IF ARROW IS STUCK,
       MOVE IT BACK WITH TARGET
    ************************** */

    if (arrowStuck)
    {
        const targetDifference =
            0 -
            stuckTargetX;


        arrow.style.left =
            stuckArrowLeft +
            targetDifference +
            "px";


        stuckArrowLeft =
            stuckArrowLeft +
            targetDifference;


        stuckTargetX = 0;
    }


    targetMoveX = 0;

    targetMoveDirection = 1;


    targetImage.style.left =
        "0px";


    targetImage.style.position =
        "relative";
}


/* **************************
   SCORE ACTUAL TARGET IMAGE
************************** */

function scoreTargetImage()
{
    /* **************************
       GET REAL SCREEN POSITIONS
    ************************** */

    const targetBox =
        targetImage.getBoundingClientRect();

    const arrowHeadBox =
        arrowHead.getBoundingClientRect();


    /* **************************
       ACTUAL ARROW TIP
    ************************** */

    const arrowTipX =
        arrowHeadBox.right;

    const arrowTipY =
        arrowHeadBox.top +
        arrowHeadBox.height / 2;


    /* **************************
       ACTUAL TARGET CENTER
    ************************** */

    const targetCenterX =
        targetBox.left +
        targetBox.width / 2;

    const targetCenterY =
        targetBox.top +
        targetBox.height / 2;


    /* **************************
       DISTANCE FROM CENTER
    ************************** */

    const differenceX =
        arrowTipX -
        targetCenterX;

    const differenceY =
        arrowTipY -
        targetCenterY;


    const distanceFromCenter =
        Math.sqrt(
            differenceX * differenceX +
            differenceY * differenceY
        );


    /* **************************
       TARGET IMAGE RADIUS
    ************************** */

    const targetRadius =
        Math.min(
            targetBox.width,
            targetBox.height
        ) / 2;


    /* **************************
       SCORE TARGET
    ************************** */

    let points = 0;


    /* **************************
       CENTER
    ************************** */

    if (
        distanceFromCenter <=
        targetRadius * 0.007
    )
    {
        points = 100;
    }


    /* **************************
       SIDE CENTER
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.08
    )
    {
        points = 50;
    }


    /* **************************
       INNER YELLOW
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.16
    )
    {
        points = 25;
    }


    /* **************************
       OUTER YELLOW
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.33
    )
    {
        points = 20;
    }


    /* **************************
       INNER RED
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.50
    )
    {
        points = 15;
    }


    /* **************************
       OUTER RED
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.66
    )
    {
        points = 10;
    }


    /* **************************
       INNER BLUE
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius * 0.83
    )
    {
        points = 5;
    }


    /* **************************
       OUTER BLUE
    ************************** */

    else if (
        distanceFromCenter <=
        targetRadius
    )
    {
        points = 1;
    }


    /* **************************
       MISS = X
    ************************** */

    else
    {
        points = 0;
    }


    /* **************************
       STICK ARROW TO TARGET
       ONLY WHEN HIT
    ************************** */

    if (points > 0)
    {
        const arrowBox =
            arrow.getBoundingClientRect();


        const targetAreaBox =
            arrow.parentElement
                .getBoundingClientRect();


        stuckArrowLeft =
            arrowBox.left -
            targetAreaBox.left;


        stuckTargetX =
            targetMoveX;


        arrowStuck = true;


        arrow.style.transition =
            "none";


        arrow.classList.remove(
            "shooting"
        );


        arrow.style.left =
            stuckArrowLeft + "px";


        arrow.style.transform =
            "translateY(-50%)";
    }


    else
    {
        arrowStuck = false;
    }


    /* **************************
       HIT = SCORE "SAVE"
    ************************** */

    if (shotsTaken === 0)
    {
        hit1 =
            points;


        hit1Text.textContent =
            hit1 === 0
                ? "Hit 1: X"
                : "Hit 1: " + hit1;
    }


    else if (shotsTaken === 1)
    {
        hit2 =
            points;


        hit2Text.textContent =
            hit2 === 0
                ? "Hit 2: X"
                : "Hit 2: " + hit2;
    }


    else if (shotsTaken === 2)
    {
        hit3 =
            points;


        hit3Text.textContent =
            hit3 === 0
                ? "Hit 3: X"
                : "Hit 3: " + hit3;
    }


    /* **************************
       SHOT = 3-X
    ************************** */

    shotsTaken =
        shotsTaken + 1;



    /* **************************
    TOTAL SCORE AFTER 3X SHOOTS
    ************************** */

    if (shotsTaken === 3)
    {
        /* **************************
        ONLY COUNT ACTUAL HITS
        ************************** */

        const successfulHits =
            [
                hit1,
                hit2,
                hit3
            ].filter(
                hit => hit > 0
            );


        /* **************************
        IF ALL 3 ARE MISSES
        ************************** */

        if (successfulHits.length === 0)
        {
            score = 0;
        }


        /* **************************
        MULTIPLY ONLY THE HITS
        ************************** */

        else
        {
            score =
                successfulHits.reduce(
                    (total, hit) =>
                        total * hit
                ) / 10;
        }


        /* **************************
           CHECK HIGH SCORE
        ************************** */

        if (score > highscore)
        {
            highscore =
                score;


            localStorage.setItem(
                "highscore",
                highscore
            );


            highscoreText.textContent =
                "High Score: " +
                highscore;
        }


        /* **************************
           DELAY SCORE PRINTING
        ************************** */

        clearTimeout(
            scoreTimeout
        );


        scoreTimeout =
            setTimeout(() =>
            {
                scoreText.textContent =
                    "Score: " + score;

            }, 500);
    }


    /* **************************
       DEBUG - MODE
    ************************** */

    console.log(
        "Arrow Tip X:",
        arrowTipX
    );


    console.log(
        "Arrow Tip Y:",
        arrowTipY
    );


    console.log(
        "Target Center X:",
        targetCenterX
    );


    console.log(
        "Target Center Y:",
        targetCenterY
    );


    console.log(
        "Target Radius:",
        targetRadius
    );


    console.log(
        "Distance:",
        distanceFromCenter
    );


    console.log(
        "Points:",
        points
    );


    console.log(
        "Hit 1:",
        hit1
    );


    console.log(
        "Hit 2:",
        hit2
    );


    console.log(
        "Hit 3:",
        hit3
    );


    console.log(
        "Shots:",
        shotsTaken
    );


    console.log(
        "Score:",
        score
    );


    console.log(
        "High Score:",
        highscore
    );
}


/* **************************
   RESET SHOTS FUNCTION
************************** */

function resetShots()
{
    clearTimeout(
        scoreTimeout
    );


    cancelAnimationFrame(
        powerAnimation
    );


    score = 0;

    shotsTaken = 0;


    hit1 = 0;

    hit2 = 0;

    hit3 = 0;


    isCharging = false;

    currentPower = 0;


    arrowStuck = false;


    scoreText.textContent =
        "Score: 0";


    hit1Text.textContent =
        "Hit 1: 0";

    hit2Text.textContent =
        "Hit 2: 0";

    hit3Text.textContent =
        "Hit 3: 0";


    powerFill.style.width =
        "0%";


    shootButton.textContent =
        "Hold to Aim";


    arrow.classList.remove(
        "aiming"
    );


    arrow.classList.remove(
        "shooting"
    );


    /* **************************
       RESET ARROW POSITION
    ************************** */

    arrow.style.left = "";

    arrow.style.transform = "";

    arrow.style.transition = "";
}


/* **************************
   HOLD BUTTON
************************** */

shootButton.addEventListener(
    "pointerdown",
    function ()
    {
        /* **************************
           REMOVE OLD STUCK ARROW
        ************************** */

        if (arrowStuck)
        {
            arrowStuck = false;


            arrow.style.left = "";

            arrow.style.transform = "";

            arrow.style.transition = "";


            arrow.classList.remove(
                "shooting"
            );
        }


        /* **************************
           START NEW ROUND
           AFTER 3 SHOTS
        ************************** */

        if (shotsTaken >= 3)
        {
            clearTimeout(
                scoreTimeout
            );


            score = 0;

            shotsTaken = 0;


            hit1 = 0;

            hit2 = 0;

            hit3 = 0;


            scoreText.textContent =
                "Score: 0";


            hit1Text.textContent =
                "Hit 1: 0";

            hit2Text.textContent =
                "Hit 2: 0";

            hit3Text.textContent =
                "Hit 3: 0";
        }


        /* **************************
           START - AIMING
        ************************** */

        aimStartTime =
            performance.now();


        isCharging = true;

        currentPower = 0;


        powerFill.style.width =
            "0%";


        shootButton.textContent =
            "Aiming...";


        arrow.classList.remove(
            "shooting"
        );


        arrow.classList.add(
            "aiming"
        );


        powerAnimation =
            requestAnimationFrame(
                updatePowerMeter
            );
    }
);


/* **************************
   RELEASE BUTTON
************************** */

shootButton.addEventListener(
    "pointerup",
    function ()
    {
        if (!isCharging)
        {
            return;
        }


        isCharging = false;


        cancelAnimationFrame(
            powerAnimation
        );


        const power =
            currentPower;


        /* **************************
           CALCULATE ARROW TRAVEL
        ************************** */

        let shootX;


        if (
            power >= midPowerMin &&
            power <= midPowerMax
        )
        {
            shootX =
                midX;
        }


        else if (
            power < midPowerMin
        )
        {
            shootX =
                minX +
                (midX - minX) *
                (power / midPowerMin);
        }


        else
        {
            shootX =
                midX +
                (maxX - midX) *
                (
                    (power - midPowerMax) /
                    (1 - midPowerMax)
                );
        }


        /* **************************
           MOVE ARROW
        ************************** */

        arrow.style.setProperty(
            "--shoot-x",
            shootX + "px"
        );


        shootButton.textContent =
            "Hold to Aim";


        arrow.classList.remove(
            "aiming"
        );


        arrow.classList.add(
            "shooting"
        );


        /* **************************
           DEBUG
        ************************** */

        console.log(
            "Power:",
            power
        );


        console.log(
            "Landing X:",
            shootX
        );
    }
);


/* **************************
   CHECK HIT AFTER ARROW LANDS
************************** */

arrow.addEventListener(
    "animationend",
    function (event)
    {
        if (
            event.animationName ===
            "shootArrow"
        )
        {
            scoreTargetImage();
        }
    }
);


/* **************************
   TURN MOVING TARGET ON / OFF
************************** */

if (movingTargetToggle)
{
    movingTargetToggle.addEventListener(
        "change",
        function ()
        {
            movingTargetMode =
                movingTargetToggle.checked;


            if (movingTargetMode)
            {
                if (movingTargetStatus)
                {
                    movingTargetStatus.textContent =
                        "ON";
                }


                startMovingTarget();
            }


            else
            {
                if (movingTargetStatus)
                {
                    movingTargetStatus.textContent =
                        "OFF";
                }


                stopMovingTarget();
            }
        }
    );
}


/* **************************
   TARGET SPEED SLIDER
************************** */

if (targetSpeedSlider)
{
    setTargetSpeed(
        targetSpeedSlider.value
    );


    targetSpeedSlider.addEventListener(
        "input",
        function ()
        {
            setTargetSpeed(
                targetSpeedSlider.value
            );
        }
    );
}


/* **************************
   RESET SHOTS BUTTON
************************** */

resetShotsButton.addEventListener(
    "click",
    function ()
    {
        resetShots();
    }
);


/* **************************
   RESET HIGH SCORE
************************** */

resetHighscoreButton.addEventListener(
    "click",
    function ()
    {
        highscore = 0;


        localStorage.removeItem(
            "highscore"
        );


        highscoreText.textContent =
            "High Score: 0";
    }
);