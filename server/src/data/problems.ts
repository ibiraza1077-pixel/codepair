export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: {
    javascript: string;
    python: string;
    typescript: string;
    java: string;
    cpp: string;
  };
  testCases: Array<{
    input: string;
    expectedOutput: string;
  }>;
  hints: string[];
  solution: string;
  topics: string[];
}

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
    return [];
}`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
    return new int[]{};
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}`
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' }
    ],
    hints: [
      'Try using a hash map to store numbers you\'ve seen',
      'For each number, check if (target - current number) exists in the map',
      'The time complexity can be O(n) with this approach'
    ],
    solution: `The optimal solution uses a hash map to achieve O(n) time complexity. As we iterate through the array, we check if the complement (target - current number) exists in our map. If it does, we've found our answer. If not, we add the current number and its index to the map.`,
    topics: ['Array', 'Hash Table']
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] is a printable ascii character.'
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`,
      typescript: `function reverseString(s: string[]): void {
    // Your code here
}`,
      java: `public void reverseString(char[] s) {
    // Your code here
}`,
      cpp: `void reverseString(vector<char>& s) {
    // Your code here
}`
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' }
    ],
    hints: [
      'Use two pointers approach',
      'Start from both ends and swap characters',
      'Move pointers towards the center'
    ],
    solution: `Use two pointers starting from both ends of the array. Swap the characters at these pointers and move them towards the center until they meet.`,
    topics: ['Two Pointers', 'String']
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Your code here
}`,
      python: `def is_valid(s):
    # Your code here
    pass`,
      typescript: `function isValid(s: string): boolean {
    // Your code here
    return false;
}`,
      java: `public boolean isValid(String s) {
    // Your code here
    return false;
}`,
      cpp: `bool isValid(string s) {
    // Your code here
    return false;
}`
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"([)]"', expectedOutput: 'false' }
    ],
    hints: [
      'Think about using a stack data structure',
      'Push opening brackets onto the stack',
      'When you see a closing bracket, check if it matches the top of the stack'
    ],
    solution: `Use a stack to keep track of opening brackets. When encountering a closing bracket, check if it matches the most recent opening bracket (top of stack).`,
    topics: ['Stack', 'String']
  },
  {
    id: 'fizzbuzz',
    title: 'Fizz Buzz',
    difficulty: 'Easy',
    description: `Given an integer n, return a string array answer (1-indexed) where:

- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.
- answer[i] == "Fizz" if i is divisible by 3.
- answer[i] == "Buzz" if i is divisible by 5.
- answer[i] == i (as a string) if none of the above conditions are true.`,
    examples: [
      {
        input: 'n = 3',
        output: '["1","2","Fizz"]'
      },
      {
        input: 'n = 5',
        output: '["1","2","Fizz","4","Buzz"]'
      },
      {
        input: 'n = 15',
        output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'
      }
    ],
    constraints: [
      '1 <= n <= 10^4'
    ],
    starterCode: {
      javascript: `function fizzBuzz(n) {
    // Your code here
}`,
      python: `def fizz_buzz(n):
    # Your code here
    pass`,
      typescript: `function fizzBuzz(n: number): string[] {
    // Your code here
    return [];
}`,
      java: `public List<String> fizzBuzz(int n) {
    // Your code here
    return new ArrayList<>();
}`,
      cpp: `vector<string> fizzBuzz(int n) {
    // Your code here
    return {};
}`
    },
    testCases: [
      { input: '3', expectedOutput: '["1","2","Fizz"]' },
      { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
    ],
    hints: [
      'Check divisibility by 15 first (both 3 and 5)',
      'Then check divisibility by 3',
      'Then check divisibility by 5',
      'Otherwise, just add the number as a string'
    ],
    solution: `Iterate from 1 to n. For each number, check divisibility conditions in order: 15 (FizzBuzz), 3 (Fizz), 5 (Buzz), or the number itself.`,
    topics: ['Math', 'String']
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

An integer is a palindrome when it reads the same forward and backward.

For example, 121 is a palindrome while 123 is not.`,
    examples: [
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left. Therefore it is not a palindrome.'
      }
    ],
    constraints: [
      '-2^31 <= x <= 2^31 - 1'
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
    // Your code here
}`,
      python: `def is_palindrome(x):
    # Your code here
    pass`,
      typescript: `function isPalindrome(x: number): boolean {
    // Your code here
    return false;
}`,
      java: `public boolean isPalindrome(int x) {
    // Your code here
    return false;
}`,
      cpp: `bool isPalindrome(int x) {
    // Your code here
    return false;
}`
    },
    testCases: [
      { input: '121', expectedOutput: 'true' },
      { input: '-121', expectedOutput: 'false' },
      { input: '10', expectedOutput: 'false' }
    ],
    hints: [
      'Negative numbers are never palindromes',
      'You can convert to string or reverse the number mathematically',
      'The mathematical approach is more elegant'
    ],
    solution: `Check if negative (return false). Then reverse the number by extracting digits and rebuilding. Compare reversed with original.`,
    topics: ['Math']
  }
];

export function getProblemById(id: string): Problem | undefined {
  return problems.find(p => p.id === id);
}

export function getProblemsByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Problem[] {
  return problems.filter(p => p.difficulty === difficulty);
}

export function getAllProblems(): Problem[] {
  return problems;
}
