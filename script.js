const shootButton = document.getElementById("shoot-button");

const arrow = document.querySelector(".arrow");

const powerFill = document.querySelector(".power-fill");

const scoreText = document.getElementById("score");


let score = 0;

let aimStartTime = 0;

let currentPower = 0;

let isCharging = false;

let powerAnimation;


/* **************************
   SHOOTING SETTINGS
************************** */

const maxHoldTime = 475;


/* **************************
   ARROW TRAVEL VALUES
************************** */

const minX = 0;

const midX = 516;

const maxX = 1032;

/* const minX = 665;
const midX = 665;
const maxX = 665; */


/* **************************
   TARGET SCORE POSITIONS
************************** */


/* CENTER */
/* ===================================== */

/* Center X */
const target1MinX = 515;
const target1MaxX = 517;


/* SIDES CIRCLE */
/* ===================================== */

/* Left Center X */
const target2MinX = 504;
const target2MaxX = 514;

/* Right Center X */
const target3MinX = 518;
const target3MaxX = 528;


/* INNER YELLOW CIRCLE */
/* ===================================== */

/* Left Yellow Inner circle X */
const target4MinX = 492;
const target4MaxX = 503;

/* Right Yellow Inner circle X */
const target5MinX = 529;
const target5MaxX = 540;


/* OUTER YELLOW CIRCLE */
/* ===================================== */

/* Left Yellow Outer circle X */
const target6MinX = 467;
const target6MaxX = 491;

/* Right Yellow Outer circle X */
const target7MinX = 539;
const target7MaxX = 565;


/* INNER RED CIRCLE */
/* ===================================== */

/* Left Red Inner circle */
const target8MinX = 441;
const target8MaxX = 466;

/* Right Red Inner circle X */
const target9MinX = 566;
const target9MaxX = 589;


/* OUTER RED CIRCLE */
/* ===================================== */

/* Left Red Outer circle X */
const target10MinX = 417;
const target10MaxX = 438;

/* Right Red Outer circle X */
const target11MinX = 589;
const target11MaxX = 614;


/* INNER BLUE CIRCLE */
/* ===================================== */

/* Left Blue Inner circle X */
const target12MinX = 392;
const target12MaxX = 416;

/* Right Blue Inner circle */
const target13MinX = 615;
const target13MaxX = 639;


/* OUTER BLUE CIRCLE */
/* ===================================== */

/* Left Blue Outer circle */
const target14MinX = 367;
const target14MaxX = 391;

/* Right Blue Outer circle */
const target15MinX = 640;
const target15MaxX = 665;

/* ===================================== */


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
        requestAnimationFrame(updatePowerMeter);
}


/* **************************
   HOLD BUTTON
************************** */

shootButton.addEventListener(
    "pointerdown",
    function ()
    {
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


        /* Center Score */
        if (
            shootX >= target1MinX &&
            shootX <= target1MaxX
        )
        {
            points = 100;
        }

        /* Left Center Score */
        else if (
            shootX >= target2MinX &&
            shootX <= target2MaxX
        )
        {
            points = 50;
        }

        /* Right Center Score */
        else if (
            shootX >= target3MinX &&
            shootX <= target3MaxX
        )
        {
            points = 50;
        }

        /* Left Yellow Inner circle */
        else if (
            shootX >= target4MinX &&
            shootX <= target4MaxX
        )
        {
            points = 25;
        }

        /* Right Yellow Inner circle */
        else if (
            shootX >= target5MinX &&
            shootX <= target5MaxX
        )
        {
            points = 25;
        }

        /* Left Yellow Outer circle */
        else if (
            shootX >= target6MinX &&
            shootX <= target6MaxX
        )
        {
            points = 20;
        }

        /* Right  Yellow Outer circle */
        else if (
            shootX >= target7MinX &&
            shootX <= target7MaxX
        )
        {
            points = 20;
        }

        /* Left Red Inner circle */
        else if (
            shootX >= target8MinX &&
            shootX <= target8MaxX
        )
        {
            points = 15;
        }

        /* Right Red Inner circle */
        else if (
            shootX >= target9MinX &&
            shootX <= target9MaxX
        )
        {
            points = 15;
        }

        /* Left Red Outer circle */
        else if (
            shootX >= target10MinX &&
            shootX <= target10MaxX
        )
        {
            points = 10;
        }

        /* Right Red Outer circle */
        else if (
            shootX >= target11MinX &&
            shootX <= target11MaxX
        )
        {
            points = 10;
        }

        /* Left Blue Inner circle */
        else if (
            shootX >= target12MinX &&
            shootX <= target12MaxX
        )
        {
            points = 5;
        }

        /* Right Blue Inner circle */
        else if (
            shootX >= target13MinX &&
            shootX <= target13MaxX
        )
        {
            points = 5;
        }

        /* Left Blue Outer circle */
        else if (
            shootX >= target14MinX &&
            shootX <= target14MaxX
        )
        {
            points = 1;
        }

        /* Right Blue Outer circle */
        else if (
            shootX >= target15MinX &&
            shootX <= target15MaxX
        )
        {
            points = 1;
        }

        /* Miss */
        else
        {
            points = 0;
        }


        /* **************************
           SHOW SCORE
        ************************** */

        setTimeout(() => {

            score = points;

            scoreText.textContent =
                "Score: " + score;

        }, 500);


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


        console.log(
            "Points:",
            points
        );
    }
);