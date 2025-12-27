/**
 * Calculator application module for DEVDEBUG OS
 */

export function initializeCalculatorWindow(windowElement) {
    windowElement.querySelector('.window-content').innerHTML = `
              <div class="flex flex-col h-full bg-black p-4">
                  <div id="calc-expression" class="text-right text-sm p-1 mb-1" style="color: var(--text-color-dim); min-height: 20px;"></div>
                  <div id="calc-display" class="text-right text-2xl p-2 mb-4 bg-gray-800 rounded" style="color: var(--primary-color); min-height: 50px;">0</div>
                  <div class="grid grid-cols-4 gap-2 flex-grow">
                      <button class="calc-btn">7</button>
                      <button class="calc-btn">8</button>
                      <button class="calc-btn">9</button>
                      <button class="calc-btn calc-op">+</button>
                      <button class="calc-btn">4</button>
                      <button class="calc-btn">5</button>
                      <button class="calc-btn">6</button>
                      <button class="calc-btn calc-op">-</button>
                      <button class="calc-btn">1</button>
                      <button class="calc-btn">2</button>
                      <button class="calc-btn">3</button>
                      <button class="calc-btn calc-op">*</button>
                      <button class="calc-btn">0</button>
                      <button class="calc-btn">.</button>
                      <button class="calc-btn calc-eq">=</button>
                      <button class="calc-btn calc-op">/</button>
                      <button class="calc-btn calc-clear col-span-2">C</button>
                      <button class="calc-btn calc-back">⌫</button>
                  </div>
              </div>
          `;

    // Add styles
    const style = document.createElement('style');
    style.innerHTML = `
              .calc-btn {
                  background-color: var(--primary-color-dark);
                  color: var(--text-color-dim);
                  border: 1px solid var(--primary-color-dark);
                  padding: 10px;
                  font-size: 18px;
                  cursor: pointer;
                  transition: background-color 0.2s;
              }
              .calc-btn:hover {
                  background-color: var(--primary-color);
                  color: black;
              }
              .calc-op {
                  background-color: #90EE90;
                  color: black;
              }
              .calc-eq {
                  background-color: var(--danger-color);
                  color: white;
              }
              .calc-clear {
                  background-color: var(--danger-color);
                  color: white;
              }
          `;
    windowElement.appendChild(style);

    // Calculator logic
    const display = windowElement.querySelector('#calc-display');
    const expressionEl = windowElement.querySelector('#calc-expression');
    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let waitingForOperand = false;
    let expression = '';

    function updateDisplay() {
        display.textContent = currentInput;
        expressionEl.textContent = expression;
    }

    function inputDigit(digit) {
        if (waitingForOperand) {
            currentInput = digit;
            expression += ' ' + digit;
            waitingForOperand = false;
        } else {
            currentInput = currentInput === '0' ? digit : currentInput + digit;
            if (expression && !expression.includes('=')) {
                expression += digit;
            }
        }
        updateDisplay();
    }

    function inputDecimal() {
        if (waitingForOperand) {
            currentInput = '0.';
            expression += ' 0.';
            waitingForOperand = false;
        } else if (currentInput.indexOf('.') === -1) {
            currentInput += '.';
            if (expression && !expression.includes('=')) {
                expression += '.';
            }
        }
        updateDisplay();
    }

    function clear() {
        currentInput = '0';
        operator = null;
        previousInput = null;
        waitingForOperand = false;
        expression = '';
        updateDisplay();
    }

    function performOperation(nextOperator) {
        const inputValue = parseFloat(currentInput);
        if (previousInput === null) {
            previousInput = inputValue;
        } else if (operator) {
            const result = calculate(previousInput, inputValue, operator);
            currentInput = String(result);
            previousInput = result;
        }
        waitingForOperand = true;
        operator = nextOperator;
        expression = currentInput + ' ' + nextOperator;
        updateDisplay();
    }

    function calculate(first, second, op) {
        switch (op) {
            case '+': return first + second;
            case '-': return first - second;
            case '*': return first * second;
            case '/': return first / second;
            default: return second;
        }
    }

    windowElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('calc-btn')) {
            const value = e.target.textContent;
            if (value >= '0' && value <= '9') {
                inputDigit(value);
            } else if (value === '.') {
                inputDecimal();
            } else if (value === 'C') {
                clear();
            } else if (value === '⌫') {
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            } else if (['+', '-', '*', '/'].includes(value)) {
                performOperation(value);
            } else if (value === '=') {
                if (operator && previousInput !== null) {
                    const result = calculate(previousInput, parseFloat(currentInput), operator);
                    expression += ' =';
                    currentInput = String(result);
                    operator = null;
                    previousInput = null;
                    waitingForOperand = true;
                    updateDisplay();
                }
            }
        }
    });
}
