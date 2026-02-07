let correctAnswers = 0;
let totalQuestions = 0;
let currentSystem = {};

function formatTerm(coef, variable) {
    if (coef === 0) return "";
    const abs = Math.abs(coef);
    const sign = coef < 0 ? "−" : "";
    const coefStr = abs === 1 ? "" : abs;
    return `${sign}${coefStr}${variable}`;
}

function buildEq(a, b, c) {
    let eq = '';
    if (a !== 0) {
        if (a === -1) eq += '-';
        else if (a !== 1) eq += a;
        eq += 'x';
    }
    if (b !== 0) {
        if (eq && b > 0) eq += ' + ';
        if (b < 0) eq += ' − ';
        if (Math.abs(b) !== 1) eq += Math.abs(b);
        eq += 'y';
    }
    eq += ' = ' + c;
    return eq;
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
    const eq1 = `${a === 0 ? "" : (a === -1 ? "-" : a === 1 ? "" : a)}x ${b < 0 ? "− " + Math.abs(b) + "y" : (b === 0 ? "" : "+ " + b + "y")} = ${c}`.replace(/\s+/g, ' ').trim();
    const eq2 = `${d === 0 ? "" : (d === -1 ? "−" : d === 1 ? "" : d)}x ${e < 0 ? "− " + Math.abs(e) + "y" : (e === 0 ? "" : "+ " + e + "y")} = ${f}`.replace(/\s+/g, ' ').trim();

    document.getElementById('equation1').textContent = eq1;
    document.getElementById('equation2').textContent = eq2;

    // Reset inputs and UI
    const ax = document.getElementById('answerX');
    const ay = document.getElementById('answerY');
    const btn = document.getElementById('check-btn');
    const nextBtn = document.querySelector('.next-btn');
    if (ax) { ax.value = ''; ax.disabled = false; }
    if (ay) { ay.value = ''; ay.disabled = false; }
    if (btn) { btn.disabled = false; }
    if (nextBtn) { nextBtn.disabled = true; }
    document.getElementById('result').textContent = '';
    document.getElementById('explanation').innerHTML = '';
    document.getElementById('answer-box').innerHTML = '';
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

    const explanationElement = document.getElementById('explanation');
    const answerBoxElement = document.getElementById('answer-box');
    
    if (userX === correctX && userY === correctY) {
        correctAnswers++;
        resultElement.textContent = '✓ Correct!';
        resultElement.className = 'correct';
        explanationElement.innerHTML = '';
        answerBoxElement.innerHTML = '';
    } else {
        resultElement.className = 'incorrect';
        resultElement.textContent = '✗ Wrong.';
        
        // Build a clear step-by-step elimination explanation
        const { a, b, c, d, e, f, det } = currentSystem;
        const yVal = (f * a - c * d) / det;
        const xVal = a !== 0 ? (c - b * yVal) / a : (f - e * yVal) / d;
        
        // Format numbers with multiplication dot and division as fraction
        const formatMult = (num1, num2) => `${num1} · ${num2}`;
        const formatDiv = (num, denom) => `<span class="fraction"><span class="numerator">${num}</span><span class="denominator">${denom}</span></span>`;
        
        let steps = '<div class="explanation-steps">';
        steps += '<div class="step"><strong>Step 1:</strong> Both equations have to be standard form (ax+by=c)</div>';
        steps += `<div class="equation-step">${buildEq(a, b, c)}</div>`;
        steps += `<div class="equation-step">${buildEq(d, e, f)}</div>`;
        
        const canEliminateX = a !== 0 && d !== 0;
        const canEliminateY = b !== 0 && e !== 0;
        let eliminate = 'x';
        if (!canEliminateX && canEliminateY) eliminate = 'y';
        else if (canEliminateX && canEliminateY) {
            const costX = Math.abs(d) + Math.abs(a);
            const costY = Math.abs(e) + Math.abs(b);
            eliminate = costY < costX ? 'y' : 'x';
        }

        const m1 = eliminate === 'x' ? d : e;
        const m2 = eliminate === 'x' ? a : b;

        steps += '<div class="step"><strong>Step 2:</strong> Eliminate one variable (make matching coefficients)</div>';
        steps += '<div class="equation-group">';
        steps += '<div class="equation-label">Equation 1: multiply by ' + Math.abs(m1) + '</div>';
        steps += '<div class="equation-step">' + `${formatMult(m1, '(' + buildEq(a, b, c) + ')')} → ${a*m1}x ${b*m1 >= 0 ? '+' : '−'} ${Math.abs(b*m1)}y = ${c*m1}` + '</div>';
        steps += '</div>';
        steps += '<div class="equation-group">';
        steps += '<div class="equation-label">Equation 2: multiply by ' + Math.abs(m2) + '</div>';
        steps += '<div class="equation-step">' + `${formatMult(m2, '(' + buildEq(d, e, f) + ')')} → ${d*m2}x ${e*m2 >= 0 ? '+' : '−'} ${Math.abs(e*m2)}y = ${f*m2}` + '</div>';
        steps += '</div>';
        
        steps += `<div class="step"><strong>Step 3:</strong> Subtract the equations (${eliminate} cancels out)</div>`;

        if (eliminate === 'x') {
            const yCoef = b*m1 - e*m2;
            const yResult = c*m1 - f*m2;
            steps += `<div class="equation-step">(${a*m1}x) − (${d*m2}x) = 0 (x cancels)</div>`;
            steps += `<div class="equation-step">(${b*m1}y) ${e*m2 >= 0 ? '−' : '+'} (${Math.abs(e*m2)}y) = ${c*m1} ${f*m2 >= 0 ? '−' : '+'} ${Math.abs(f*m2)}</div>`;
            steps += `<div class="equation-step">${yCoef}y = ${yResult}</div>`;

            steps += '<div class="step"><strong>Step 4:</strong> Solve for y</div>';
            steps += `<div class="equation-step">y = ${formatDiv(yResult, yCoef)} = ${yVal}</div>`;

            steps += '<div class="step"><strong>Step 5:</strong> Substitute y and solve for x</div>';
            steps += `<div class="equation-step">Substitute y = ${yVal} into first equation:</div>`;
            steps += `<div class="equation-step">${a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)} · ${yVal} = ${c}</div>`;
            const leftSide = b * yVal;
            steps += `<div class="equation-step">${a}x ${leftSide >= 0 ? '+' : '−'} ${Math.abs(leftSide)} = ${c}</div>`;
            steps += `<div class="equation-step">${a}x = ${c - leftSide}</div>`;
            steps += `<div class="equation-step">x = ${formatDiv(c - leftSide, a)} = ${xVal}</div>`;
        } else {
            const xCoef = a*m1 - d*m2;
            const xResult = c*m1 - f*m2;
            steps += `<div class="equation-step">(${b*m1}y) − (${e*m2}y) = 0 (y cancels)</div>`;
            steps += `<div class="equation-step">(${a*m1}x) ${d*m2 >= 0 ? '−' : '+'} (${Math.abs(d*m2)}x) = ${c*m1} ${f*m2 >= 0 ? '−' : '+'} ${Math.abs(f*m2)}</div>`;
            steps += `<div class="equation-step">${xCoef}x = ${xResult}</div>`;

            steps += '<div class="step"><strong>Step 4:</strong> Solve for x</div>';
            steps += `<div class="equation-step">x = ${formatDiv(xResult, xCoef)} = ${xVal}</div>`;

            steps += '<div class="step"><strong>Step 5:</strong> Substitute x and solve for y</div>';
            steps += `<div class="equation-step">Substitute x = ${xVal} into first equation:</div>`;
            steps += `<div class="equation-step">${b}y ${a >= 0 ? '+' : '−'} ${Math.abs(a)} · ${xVal} = ${c}</div>`;
            const leftSide = a * xVal;
            steps += `<div class="equation-step">${b}y ${leftSide >= 0 ? '−' : '+'} ${Math.abs(leftSide)} = ${c}</div>`;
            steps += `<div class="equation-step">${b}y = ${c - leftSide}</div>`;
            steps += `<div class="equation-step">y = ${formatDiv(c - leftSide, b)} = ${yVal}</div>`;
        }
        
        steps += '</div>';
        explanationElement.innerHTML = steps;
        
        answerBoxElement.innerHTML = `<strong>Answer:</strong> x = ${correctX}, y = ${correctY}`;
    }

    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    document.getElementById('score').textContent = `Score: ${correctAnswers}/${totalQuestions} (${percentage}%)`;

    // Disable inputs and check button until next equation
    ax.disabled = true;
    ay.disabled = true;
    if (btn) btn.disabled = true;
    
    // Enable next button
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn) nextBtn.disabled = false;
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
