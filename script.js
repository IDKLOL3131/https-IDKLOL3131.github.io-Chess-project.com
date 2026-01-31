let correctAnswers = 0;
let totalQuestions = 0;
let currentEquation = {};

function generateEquation() {
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operators = ['+', '-', '*', '/'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let answer;
    if (operator === '+') {
        answer = num1 + num2;
    } else if (operator === '-') {
        answer = num1 - num2;
    } else if (operator === '*') {
        answer = num1 * num2;
    } else {
        answer = Math.round((num1 / num2) * 100) / 100;
    }

    currentEquation = { num1, num2, operator, answer };
    document.getElementById('equation').textContent = `${num1} ${operator} ${num2} = ?`;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
    document.getElementById('answer').focus();
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    const resultElement = document.getElementById('result');

    if (isNaN(userAnswer)) {
        resultElement.textContent = 'Please enter a valid number';
        resultElement.className = 'incorrect';
        return;
    }

    totalQuestions++;
    if (userAnswer === currentEquation.answer) {
        correctAnswers++;
        resultElement.textContent = '✓ Correct!';
        resultElement.className = 'correct';
    } else {
        resultElement.textContent = `✗ Wrong! The answer is ${currentEquation.answer}`;
        resultElement.className = 'incorrect';
    }

    document.getElementById('score').textContent = `Score: ${correctAnswers}/${totalQuestions}`;
}

// Allow Enter key to check answer
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Generate first equation on load
window.addEventListener('load', generateEquation);
