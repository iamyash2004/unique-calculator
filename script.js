document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let awaitingNextOperand = false;

    function updateDisplay() {
        display.innerText = currentInput;
    }

    function handleNumber(number) {
        if (awaitingNextOperand) {
            currentInput = number;
            awaitingNextOperand = false;
        } else {
            currentInput = currentInput === '0' ? number : currentInput + number;
        }
        updateDisplay();
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);
        
        if (operator && awaitingNextOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }

        awaitingNextOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    function calculate(first, second, operator) {
        switch (operator) {
            case 'add': return first + second;
            case 'subtract': return first - second;
            case 'multiply': return first * second;
            case 'divide': return first / second;
            case 'modulus': return first % second;
            case 'square': return first * first;
            default: return second;
        }
    }

    function handleDecimal() {
        if (awaitingNextOperand) return;
        if (!currentInput.includes('.')) {
            currentInput += '.';
            updateDisplay();
        }
    }

    function handleClear() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        awaitingNextOperand = false;
        updateDisplay();
    }

    function handleEqual() {
        if (operator && !awaitingNextOperand) {
            const result = calculate(firstOperand, parseFloat(currentInput), operator);
            currentInput = `${parseFloat(result.toFixed(7))}`;
            firstOperand = null;
            operator = null;
            updateDisplay();
        }
    }

    document.querySelector('.calc-buttons').addEventListener('click', function(event) {
        const { target } = event;
        if (!target.matches('button')) return;

        if (target.dataset.number) {
            handleNumber(target.dataset.number);
        } else if (target.dataset.action) {
            switch (target.dataset.action) {
                case 'add':
                case 'subtract':
                case 'multiply':
                case 'divide':
                case 'modulus':
                case 'square':
                    handleOperator(target.dataset.action);
                    break;
                case 'decimal':
                    handleDecimal();
                    break;
                case 'clear':
                    handleClear();
                    break;
                case 'equal':
                    handleEqual();
                    break;
            }
        }
    });
});
