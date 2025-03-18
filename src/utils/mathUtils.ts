
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface MathProblem {
  problem: string;
  answer: number;
  operation: Operation;
  difficulty: Difficulty;
}

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const roundToDecimals = (num: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export const generateProblem = (difficulty: Difficulty, operation: Operation): MathProblem => {
  let num1: number;
  let num2: number;
  let problem: string;
  let answer: number;

  switch (operation) {
    case 'addition':
      if (difficulty === 'easy') {
        num1 = generateRandomNumber(1, 20);
        num2 = generateRandomNumber(1, 20);
      } else if (difficulty === 'medium') {
        num1 = generateRandomNumber(10, 100);
        num2 = generateRandomNumber(10, 100);
      } else {
        num1 = generateRandomNumber(100, 999);
        num2 = generateRandomNumber(100, 999);
      }
      problem = `${num1} + ${num2} = ?`;
      answer = num1 + num2;
      break;
      
    case 'subtraction':
      if (difficulty === 'easy') {
        num2 = generateRandomNumber(1, 10);
        num1 = generateRandomNumber(num2, 20);
      } else if (difficulty === 'medium') {
        num2 = generateRandomNumber(10, 50);
        num1 = generateRandomNumber(num2, 100);
      } else {
        num2 = generateRandomNumber(50, 500);
        num1 = generateRandomNumber(num2, 999);
      }
      problem = `${num1} - ${num2} = ?`;
      answer = num1 - num2;
      break;
      
    case 'multiplication':
      if (difficulty === 'easy') {
        num1 = generateRandomNumber(1, 10);
        num2 = generateRandomNumber(1, 10);
      } else if (difficulty === 'medium') {
        num1 = generateRandomNumber(5, 20);
        num2 = generateRandomNumber(5, 20);
      } else {
        num1 = generateRandomNumber(10, 50);
        num2 = generateRandomNumber(10, 50);
      }
      problem = `${num1} × ${num2} = ?`;
      answer = num1 * num2;
      break;
      
    case 'division':
      if (difficulty === 'easy') {
        num2 = generateRandomNumber(1, 10);
        num1 = num2 * generateRandomNumber(1, 10);
      } else if (difficulty === 'medium') {
        num2 = generateRandomNumber(2, 20);
        num1 = num2 * generateRandomNumber(2, 20);
      } else {
        num2 = generateRandomNumber(2, 30);
        num1 = num2 * generateRandomNumber(5, 20);
        // For hard division, sometimes add a remainder
        if (Math.random() > 0.5) {
          num1 += generateRandomNumber(1, num2 - 1);
          answer = roundToDecimals(num1 / num2, 2);
        } else {
          answer = num1 / num2;
        }
        problem = `${num1} ÷ ${num2} = ?`;
        return { problem, answer, operation, difficulty };
      }
      problem = `${num1} ÷ ${num2} = ?`;
      answer = num1 / num2;
      break;
  }

  return { problem, answer, operation, difficulty };
};

export const checkAnswer = (userAnswer: number, correctAnswer: number, difficulty: Difficulty): boolean => {
  if (difficulty === 'hard' && Math.abs(userAnswer - correctAnswer) < 0.01) {
    return true;
  }
  return userAnswer === correctAnswer;
};

export const getRandomOperation = (): Operation => {
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  return operations[Math.floor(Math.random() * operations.length)];
};

export const formatProblem = (problem: string): string => {
  return problem.replace('×', '×').replace('÷', '÷');
};

export const getOperationSymbol = (operation: Operation): string => {
  switch (operation) {
    case 'addition': return '+';
    case 'subtraction': return '−';
    case 'multiplication': return '×';
    case 'division': return '÷';
  }
};
