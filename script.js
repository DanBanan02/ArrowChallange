const shootButton = document.getElementById("shoot-button");
const arrow = document.querySelector(".arrow");
const powerFill = document.querySelector(".power-fill");

let powerAnimation;

let aimStartTime = 0;
let currentPower = 0;
let isCharging = false;

const maxHoldTime = 2000;

const minX = 50;
const maxX = 800;

function updatePowerMeter() {

    if (!isCharging) {
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

shootButton.addEventListener("pointerdown", function () {

    aimStartTime = performance.now();

    isCharging = true;
    currentPower = 0;

    powerFill.style.width = "0%";

    shootButton.textContent = "Aiming...";

    arrow.classList.remove("shooting");
    arrow.classList.add("aiming");

    powerAnimation = requestAnimationFrame(updatePowerMeter);

});


shootButton.addEventListener("pointerup", function () {

    isCharging = false;

    cancelAnimationFrame(powerAnimation);

    const power = currentPower;

    const shootX = minX + (maxX - minX) * power;

    arrow.style.setProperty("--shoot-x", shootX + "px");

    shootButton.textContent = "Hold to Aim";

    arrow.classList.remove("aiming");
    arrow.classList.add("shooting");

    console.log("Power:", power);
    console.log("Landing X:", shootX);

});