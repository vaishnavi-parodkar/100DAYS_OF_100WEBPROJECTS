class SmartCalculator {
  constructor() {
    this.display = document.getElementById('display');
    this.previousExpression = document.getElementById('previous-expression');
    this.currentInput = '0';
    this.previousInput = '';
    this.operatorActive = false;
    this.lastOperator = null;
    this.isCalculated = false;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.updateDisplay();
  }
  
  setupEventListeners() {
    // Number buttons
    document.querySelectorAll('.number-btn').forEach(button => {
      button.addEventListener('click', () => {
        this.appendNumber(button.dataset.number);
      });
    });
    
    // Operator buttons
    document.querySelectorAll('.operator-btn').forEach(button => {
      button.addEventListener('click', () => {
        this.appendOperator(button.dataset.operator);
        this.highlightOperator(button);
      });
    });
    
    // Function buttons
    document.querySelectorAll('.function-btn').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.executeFunction(action);
      });
    });
    
    // Equal button
    document.querySelector('.equal-btn').addEventListener('click', () => {
      this.calculate();
    });
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardInput(e);
    });
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
      if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
      }
    });
  }
  
  appendNumber(number) {
    if (this.currentInput === 'Error') {
      this.clearDisplay();
    }
    
    if (this.isCalculated && !this.operatorActive) {
      this.currentInput = '0';
      this.isCalculated = false;
    }
    
    if (this.operatorActive) {
      this.currentInput = number;
      this.operatorActive = false;
    } else {
      if (this.currentInput === '0' && number !== '.') {
        this.currentInput = number;
      } else if (number === '.' && this.currentInput.includes('.')) {
        return; // Prevent multiple decimal points
      } else {
        this.currentInput += number;
      }
    }
    
    this.updateDisplay();
  }
  
  appendOperator(operator) {
    if (this.currentInput === 'Error') return;
    
    // If there's already an operator and we're not in operator active state
    if (!this.operatorActive && this.lastOperator) {
      this.calculate();
    }
    
    this.previousInput = this.currentInput;
    this.lastOperator = operator;
    this.operatorActive = true;
    this.isCalculated = false;
    
    this.updatePreviousExpression();
  }
  
  executeFunction(action) {
    switch(action) {
      case 'clear':
        this.clearDisplay();
        break;
      case 'backspace':
        this.backspace();
        break;
      case 'percentage':
        this.percentage();
        break;
    }
  }
  
  clearDisplay() {
    this.currentInput = '0';
    this.previousInput = '';
    this.lastOperator = null;
    this.operatorActive = false;
    this.isCalculated = false;
    this.updateDisplay();
    this.previousExpression.textContent = '';
    
    // Remove active class from all operator buttons
    document.querySelectorAll('.operator-btn').forEach(btn => {
      btn.classList.remove('active');
    });
  }
  
  backspace() {
    if (this.currentInput === 'Error') {
      this.clearDisplay();
      return;
    }
    
    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = '0';
    }
    
    this.updateDisplay();
  }
  
  percentage() {
    if (this.currentInput === 'Error') return;
    
    try {
      const value = parseFloat(this.currentInput);
      this.currentInput = (value / 100).toString();
      this.updateDisplay();
    } catch {
      this.showError();
    }
  }
  
  calculate() {
    if (this.currentInput === 'Error' || !this.lastOperator || !this.previousInput) return;
    
    try {
      const prev = parseFloat(this.previousInput);
      const current = parseFloat(this.currentInput);
      let result;
      
      switch(this.lastOperator) {
        case '+':
          result = prev + current;
          break;
        case '-':
          result = prev - current;
          break;
        case '*':
          result = prev * current;
          break;
        case '/':
          if (current === 0) {
            this.showError("Can't divide by zero");
            return;
          }
          result = prev / current;
          break;
        default:
          return;
      }
      
      // Format result to avoid long decimal numbers
      this.currentInput = this.formatResult(result);
      this.previousInput = '';
      this.lastOperator = null;
      this.operatorActive = false;
      this.isCalculated = true;
      this.updateDisplay();
      this.previousExpression.textContent = '';
      
      // Remove active class from all operator buttons
      document.querySelectorAll('.operator-btn').forEach(btn => {
        btn.classList.remove('active');
      });
    } catch {
      this.showError();
    }
  }
  
  formatResult(result) {
    // If result is too large, use scientific notation
    if (Math.abs(result) > 999999999999) {
      return result.toExponential(6);
    }
    
    // If result is a whole number, display without decimal
    if (result % 1 === 0) {
      return result.toString();
    }
    
    // Otherwise, limit to 10 decimal places
    return parseFloat(result.toFixed(10)).toString();
  }
  
  showError(message = 'Error') {
    this.currentInput = message;
    this.display.classList.add('error');
    this.updateDisplay();
    
    // Remove error class after animation
    setTimeout(() => {
      this.display.classList.remove('error');
    }, 500);
  }
  
  updateDisplay() {
    this.display.textContent = this.currentInput;
  }
  
  updatePreviousExpression() {
    if (this.previousInput && this.lastOperator) {
      this.previousExpression.textContent = `${this.previousInput} ${this.getOperatorSymbol(this.lastOperator)}`;
    }
  }
  
  getOperatorSymbol(operator) {
    const symbols = {
      '+': '+',
      '-': '−',
      '*': '×',
      '/': '÷'
    };
    return symbols[operator] || operator;
  }
  
  highlightOperator(button) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.operator-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active class to clicked operator
    button.classList.add('active');
  }
  
  handleKeyboardInput(e) {
    if (e.key === ' ') {
      e.preventDefault(); // Prevent space from scrolling
      return;
    }
    
    if (!isNaN(e.key) || e.key === '.') {
      this.appendNumber(e.key);
    } else if ('+-*/'.includes(e.key)) {
      this.appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      this.calculate();
    } else if (e.key === 'Backspace') {
      this.backspace();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      this.clearDisplay();
    } else if (e.key === '%') {
      this.percentage();
    }
  }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SmartCalculator();
  
  // Add loading animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});