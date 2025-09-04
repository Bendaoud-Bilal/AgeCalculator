//---------------- Event Listener ---------------- //
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});



//---------------- Main Function ---------------- //
function calculateAgeMain(dayInput, monthInput, yearInput) {
    resetFormState();

    let validateDateResult = validateDate(dayInput, monthInput, yearInput);

    if (validateDateResult === "correct-input") {
        showUserAge(dayInput, monthInput, yearInput);
    }
    else if (validateDateResult === "invalid-input") {
        applyErrorStyle();
        addErrorMessage("day-div", "Must be a valid day");
        addErrorMessage("month-div", "Must be a valid month");
        addErrorMessage("year-div", "Must be a valid year");
    }
    else if (validateDateResult === "missing-input") {
        applyErrorStyle();

        if (!document.getElementById("days-input").value) {
            addErrorMessage("day-div", "This field is required");
        }
        if (!document.getElementById("months-input").value) {
            addErrorMessage("month-div", "This field is required");
        }
        if (!document.getElementById("years-input").value) {
            addErrorMessage("year-div", "This field is required");
        }
    }
}

/* ---------------- Helper Functions ---------------- */

// Reset previous warnings and styles
function resetFormState() {
    document.querySelectorAll(".p-message").forEach(el => el.remove());
    document.getElementById("input-div").style.color = "";
    let inputs = document.getElementsByClassName("input-class");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].style.outline = "";
    }
}

// Apply red styles for error state
function applyErrorStyle() {
    document.getElementById("input-div").style.color = "hsl(0, 100%, 67%)";
    let inputs = document.getElementsByClassName("input-class");
    for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].value || inputs[i].value) { // applies in both invalid and missing
            inputs[i].style.outline = "1px solid hsl(0, 100%, 67%)";
        }
    }
}

// Add error message only if not already shown
function addErrorMessage(divId, message) {
    let div = document.getElementById(divId);
    if (!div.querySelector(".p-message")) {
        div.insertAdjacentHTML("beforeend", `<p class='p-message'>${message}</p>`);
    }
}

// Show user age when inputs are correct
function showUserAge(dayInput, monthInput, yearInput) {
    let userAge = calculateAge(dayInput, monthInput, yearInput);

    let yearEl = document.getElementById("years-result");
    let monthEl = document.getElementById("months-result");
    let dayEl = document.getElementById("days-result");

    // Reset placeholders before animating
    yearEl.innerText = 0;
    monthEl.innerText = 0;
    dayEl.innerText = 0;

    // Animate to final values
    animateNumber(yearEl, userAge.years, 1500);
    animateNumber(monthEl, userAge.months, 1200);
    animateNumber(dayEl, userAge.days, 900);
}


//---------------- animation for numbers ------------------

function animateNumber(element, target, duration = 1200) {
    let start = 0;
    let range = target - start;
    let stepTime = Math.max(Math.floor(duration / range), 20); // never too fast
    let startTime = Date.now();

    function update() {
        let elapsed = Date.now() - startTime;
        let progress = Math.min(elapsed / duration, 1);
        let value = Math.floor(progress * range + start);
        element.innerText = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


/* ---------------- Validation ---------------- */
function validateDate(dayInput, monthInput, yearInput) {
    let day = parseInt(dayInput);
    let month = parseInt(monthInput);
    let year = parseInt(yearInput);

    if (!day || !month || !year) return "missing-input";
    if (month < 1 || month > 12) return "invalid-input";
    if (day < 1 || day > 31) return "invalid-input";

    let inputDate = new Date(year, month - 1, day);
    if (
        inputDate.getFullYear() !== year ||
        inputDate.getMonth() !== month - 1 ||
        inputDate.getDate() !== day
    ) return "invalid-input";

    if (inputDate > new Date()) return "invalid-input";

    return "correct-input";
}

/* ---------------- Age Calculation ---------------- */
function calculateAge(dayInput, monthInput, yearInput) {
    let today = new Date();
    let birthDate = new Date(yearInput, monthInput - 1, dayInput);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months -= 1;
        let prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    return { years: years, months: months, days: days };
}
