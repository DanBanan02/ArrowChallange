const shootButton = document.getElementById("shoot-button");
const arrow = document.querySelector(".arrow");
const powerFill = document.querySelector(".power-fill");
const scoreText = document.getElementById("score");

let score = 0;
let aimStartTime = 0;
let currentPower = 0;
let isCharging = false;
let powerAnimation;


/* Shooting settings */

const maxHoldTime = 600;

/* Main */
const minX = 0;
const midX = 516;
const maxX = 1032;

/* Test */
/* const minX = 516;
const midX = 516;
const maxX = 516; */

const midPowerMin = 0.495;
const midPowerMax = 0.505;


/* Power meter */

function updatePowerMeter() 
{

    if (!isCharging) 
    {
        return;
    }

    const holdTime = performance.now() - aimStartTime;

    const cycle = holdTime / maxHoldTime;

    const position = cycle % 2;

    currentPower = position <= 1
        ? position
        : 2 - position;

    powerFill.style.width = currentPower * 100 + "%";

    powerAnimation = requestAnimationFrame(updatePowerMeter);
}


/* Hold button */

shootButton.addEventListener("pointerdown", function () 
{

    aimStartTime = performance.now();

    isCharging = true;
    currentPower = 0;

    powerFill.style.width = "0%";

    shootButton.textContent = "Aiming...";

    arrow.classList.remove("shooting");
    arrow.classList.add("aiming");

    powerAnimation = requestAnimationFrame(updatePowerMeter);

});


/* Release button */

shootButton.addEventListener("pointerup", function () 
{

    isCharging = false;

    cancelAnimationFrame(powerAnimation);

    const power = currentPower;

    let points = 0;

    if (power >= midPowerMin && power <= midPowerMax)
    {
        points = 10;
    }

    else if (power >= 0.45 && power <= 0.55)
    {
        points = 5;
    }

    else if (power >= 0.35 && power <= 0.65)
    {
        points = 2;
    }


    let shootX;

    /* **************************
       CALCULATE WHERE ARROW LANDS
    ************************** */

    if (power >= midPowerMin && power <= midPowerMax) 
    {

        shootX = midX;

    }

    else if (power < midPowerMin) 
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
            ((power - midPowerMax) /
            (1 - midPowerMax));

    }

    /* ************************** */


    arrow.style.setProperty(
        "--shoot-x",
        shootX + "px"
    );


    shootButton.textContent = "Hold to Aim";

    arrow.classList.remove("aiming");
    arrow.classList.add("shooting");


    console.log("Power:", power);
    console.log("Landing X:", shootX);

});