let correctAnswers = 0;
let totalQuestions = 0;
let currentSystem = {};

function formatTerm(coef, variable) {
    if (coef === 0) return "";
    const abs = Math.abs(coef);
    const sign = coef < 0 ? "-" : "";
    const coefStr = abs === 1 ? "" : abs;
    return `${sign}${coefStr}${variable}`;
}

function generateEquation() {
    // Generate a system with integer solution (x0, y0)
    const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const x0 = randInt(-10, 10);
    const y0 = randInt(-10, 10);
    // choose non-zero coefficients and ensure determinant != 0
    let a, b, d, e;
    do {
        a = randInt(-10, 10) || 1;
        b = randInt(-10, 10);
        d = randInt(-10, 10) || 1;
        e = randInt(-10, 10);
    } while ((a * e - b * d) === 0);

    const c = a * x0 + b * y0;
    const f = d * x0 + e * y0;

    currentSystem = { a, b, c, d, e, f, x: x0, y: y0, det: a * e - b * d };

    // Build readable equation strings
    const eq1 = `${a === 0 ? "" : (a === -1 ? "-" : a === 1 ? "" : a)}x ${b < 0 ? "- " + Math.abs(b) + "y" : (b === 0 ? "" : "+ " + b + "y")} = ${c}`.replace(/\s+/g, ' ').trim();
    const eq2 = `${d === 0 ? "" : (d === -1 ? "-" : d === 1 ? "" : d)}x ${e < 0 ? "- " + Math.abs(e) + "y" : (e === 0 ? "" : "+ " + e + "y")} = ${f}`.replace(/\s+/g, ' ').trim();

    document.getElementById('equation').textContent = `${eq1} \n${eq2}`;

    // Reset inputs and UI
    const ax = document.getElementById('answerX');
    const ay = document.getElementById('answerY');
    const btn = document.getElementById('check-btn');
    if (ax) { ax.value = ''; ax.disabled = false; }
    if (ay) { ay.value = ''; ay.disabled = false; }
    if (btn) { btn.disabled = false; }
    document.getElementById('result').textContent = '';
    if (ax) ax.focus();
}

function checkAnswer() {
    const ax = document.getElementById('answerX');
    const ay = document.getElementById('answerY');
    const resultElement = document.getElementById('result');
    const btn = document.getElementById('check-btn');

    if (!ax || !ay) return;

    const userX = parseFloat(ax.value);
    const userY = parseFloat(ay.value);
    if (isNaN(userX) || isNaN(userY)) {
        resultElement.textContent = 'Please enter valid numbers for x and y.';
        resultElement.className = 'incorrect';
        return;
    }

    totalQuestions++;

    const correctX = currentSystem.x;
    const correctY = currentSystem.y;

    if (userX === correctX && userY === correctY) {
        correctAnswers++;
        resultElement.textContent = '✓ Correct!';
        resultElement.className = 'correct';
    } else {
        resultElement.className = 'incorrect';
        // Build an elimination explanation
        const { a, b, c, d, e, f, det } = currentSystem;
        // Eliminate x: multiply eq1 by d and eq2 by a
        const step1 = `${d}*( ${a}x + ${b}y = ${c} ) => ${a*d}x + ${b*d}y = ${c*d}`;
        const step2 = `${a}*( ${d}x + ${e}y = ${f} ) => ${d*a}x + ${e*a}y = ${f*a}`;
        const step3 = `Subtract: (${e*a} - ${b*d})y = ${f*a} - ${c*d}`;
        const yVal = (f * a - c * d) / det;
        const xVal = (c - b * yVal) / a || (f - e * yVal) / d;
        const explanation = `✗ Wrong. Correct solution: x = ${correctX}, y = ${correctY}\n\nElimination steps:\n${step1}\n${step2}\n${step3}\nSo y = (${f}*${a} - ${c}*${d}) / (${det}) = ${yVal}\nThen x = (${c} - ${b}*y) / ${a} = ${xVal}`;
        resultElement.textContent = explanation;
    }

    document.getElementById('score').textContent = `Score: ${correctAnswers}/${totalQuestions}`;

    // Disable inputs and check button until next equation
    ax.disabled = true;
    ay.disabled = true;
    if (btn) btn.disabled = true;
}

// Allow Enter key to check answer
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const btn = document.getElementById('check-btn');
        if (btn && !btn.disabled) checkAnswer();
    }
});

// Generate first system on load
window.addEventListener('load', generateEquation);
