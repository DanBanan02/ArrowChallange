const shootButton =
    document.getElementById("shoot-button");

const arrow =
    document.querySelector(".arrow");

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

const maxHoldTime = 2600;

/* 475 */


/* **************************
   ARROW TRAVEL VALUES
************************** */

const minX = 0;

const midX = 516;

const maxX = 1032;


/*
const minX = 665;
const midX = 665;
const maxX = 665;
*/


/* **************************
   TARGET SCORE POSITIONS
************************** */


/* CENTER */

const target1MinX = 515;

const target1MaxX = 517;


/* LEFT CENTER */

const target2MinX = 504;

const target2MaxX = 514;


/* RIGHT CENTER */

const target3MinX = 518;

const target3MaxX = 528;


/* LEFT YELLOW INNER */

const target4MinX = 492;

const target4MaxX = 503;


/* RIGHT YELLOW INNER */

const target5MinX = 529;

const target5MaxX = 540;


/* LEFT YELLOW OUTER */

const target6MinX = 467;

const target6MaxX = 491;


/* RIGHT YELLOW OUTER */

const target7MinX = 539;

const target7MaxX = 565;


/* LEFT RED INNER */

const target8MinX = 441;

const target8MaxX = 466;


/* RIGHT RED INNER */

const target9MinX = 566;

const target9MaxX = 589;


/* LEFT RED OUTER */

const target10MinX = 417;

const target10MaxX = 438;


/* RIGHT RED OUTER */

const target11MinX = 589;

const target11MaxX = 614;


/* LEFT BLUE INNER */

const target12MinX = 392;

const target12MaxX = 416;


/* RIGHT BLUE INNER */

const target13MinX = 615;

const target13MaxX = 639;


/* LEFT BLUE OUTER */

const target14MinX = 367;

const target14MaxX = 391;


/* RIGHT BLUE OUTER */

const target15MinX = 640;

const target15MaxX = 665;


/* **************************
   PERFECT POWER RANGE
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
}


/* **************************
   HOLD BUTTON
************************** */

shootButton.addEventListener(
    "pointerdown",
    function ()
    {
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
           START AIMING
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
           CALCULATE ARROW LANDING
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
           SCORE TARGET
        ************************** */

        let points = 0;


        /* Center */

        if (
            shootX >= target1MinX &&
            shootX <= target1MaxX
        )
        {
            points = 100;
        }


        /* Left Center */

        else if (
            shootX >= target2MinX &&
            shootX <= target2MaxX
        )
        {
            points = 50;
        }


        /* Right Center */

        else if (
            shootX >= target3MinX &&
            shootX <= target3MaxX
        )
        {
            points = 50;
        }


        /* Left Yellow Inner */

        else if (
            shootX >= target4MinX &&
            shootX <= target4MaxX
        )
        {
            points = 25;
        }


        /* Right Yellow Inner */

        else if (
            shootX >= target5MinX &&
            shootX <= target5MaxX
        )
        {
            points = 25;
        }


        /* Left Yellow Outer */

        else if (
            shootX >= target6MinX &&
            shootX <= target6MaxX
        )
        {
            points = 20;
        }


        /* Right Yellow Outer */

        else if (
            shootX >= target7MinX &&
            shootX <= target7MaxX
        )
        {
            points = 20;
        }


        /* Left Red Inner */

        else if (
            shootX >= target8MinX &&
            shootX <= target8MaxX
        )
        {
            points = 15;
        }


        /* Right Red Inner */

        else if (
            shootX >= target9MinX &&
            shootX <= target9MaxX
        )
        {
            points = 15;
        }


        /* Left Red Outer */

        else if (
            shootX >= target10MinX &&
            shootX <= target10MaxX
        )
        {
            points = 10;
        }


        /* Right Red Outer */

        else if (
            shootX >= target11MinX &&
            shootX <= target11MaxX
        )
        {
            points = 10;
        }


        /* Left Blue Inner */

        else if (
            shootX >= target12MinX &&
            shootX <= target12MaxX
        )
        {
            points = 5;
        }


        /* Right Blue Inner */

        else if (
            shootX >= target13MinX &&
            shootX <= target13MaxX
        )
        {
            points = 5;
        }


        /* Left Blue Outer */

        else if (
            shootX >= target14MinX &&
            shootX <= target14MaxX
        )
        {
            points = 1;
        }


        /* Right Blue Outer */

        else if (
            shootX >= target15MinX &&
            shootX <= target15MaxX
        )
        {
            points = 1;
        }


        /* **************************
           MISS
           MISS COUNTS AS A SHOT
        ************************** */

        else
        {
            points = 0;
        }


        /* **************************
           SAVE HIT
        ************************** */

        if (shotsTaken === 0)
        {
            hit1 =
                points;


            hit1Text.textContent =
                "Hit 1: " + hit1;
        }


        else if (shotsTaken === 1)
        {
            hit2 =
                points;


            hit2Text.textContent =
                "Hit 2: " + hit2;
        }


        else if (shotsTaken === 2)
        {
            hit3 =
                points;


            hit3Text.textContent =
                "Hit 3: " + hit3;
        }


        /* **************************
           COUNT SHOT
        ************************** */

        shotsTaken =
            shotsTaken + 1;


        /* **************************
           CALCULATE SCORE
           AFTER 3 SHOTS
        ************************** */

        if (shotsTaken === 3)
        {
            score =
                hit1 *
                hit2 *
                hit3 /
                10;


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
           DELAY FINAL SCORE
        ************************** */

        clearTimeout(
            scoreTimeout
        );


        scoreTimeout =
            setTimeout(() =>
            {
                if (shotsTaken === 3)
                {
                    scoreText.textContent =
                        "Score: " + score;
                }

            }, 500);


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


        console.log(
            "Points:",
            points
        );


        console.log(
            "Hit 1: ",
            hit1
        );


        console.log(
            "Hit 2: ",
            hit2 +
        );


        console.log(
            "Hit 3: ",
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
);


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