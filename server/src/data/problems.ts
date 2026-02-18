export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: { javascript: string; python: string; typescript: string; java: string; cpp: string; };
  testCases: Array<{ input: string; expectedOutput: string }>;
  hints: string[];
  solution: string;
  topics: string[];
}

export const problems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      typescript: 'function twoSum(nums: number[], target: number): number[] {\n    // Your code here\n    return [];\n}',
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your code here\n    return new int[]{};\n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}'
    },
    testCases: [{ input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }],
    hints: ['Try using a hash map', 'For each number, check if (target - number) exists in the map', 'O(n) time complexity is achievable'],
    solution: 'Use a hash map to store numbers and their indices as you iterate.',
    topics: ['Array', 'Hash Table']
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    starterCode: {
      javascript: 'function reverseString(s) {\n    // Your code here\n}',
      python: 'def reverse_string(s):\n    # Your code here\n    pass',
      typescript: 'function reverseString(s: string[]): void {\n    // Your code here\n}',
      java: 'public void reverseString(char[] s) {\n    // Your code here\n}',
      cpp: 'void reverseString(vector<char>& s) {\n    // Your code here\n}'
    },
    testCases: [{ input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' }],
    hints: ['Use two pointers', 'Start from both ends and swap', 'Move pointers towards center'],
    solution: 'Two pointers starting from both ends, swap and move inward.',
    topics: ['Two Pointers', 'String']
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    starterCode: {
      javascript: 'function isValid(s) {\n    // Your code here\n}',
      python: 'def is_valid(s):\n    # Your code here\n    pass',
      typescript: 'function isValid(s: string): boolean {\n    // Your code here\n    return false;\n}',
      java: 'public boolean isValid(String s) {\n    // Your code here\n    return false;\n}',
      cpp: 'bool isValid(string s) {\n    // Your code here\n    return false;\n}'
    },
    testCases: [{ input: '"()"', expectedOutput: 'true' }, { input: '"(]"', expectedOutput: 'false' }],
    hints: ['Use a stack', 'Push opening brackets', 'Check if closing bracket matches top of stack'],
    solution: 'Use a stack. Push opening brackets, pop and verify for closing brackets.',
    topics: ['Stack', 'String']
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    difficulty: 'Easy',
    description: 'Given an integer n, return a string array where:\n- answer[i] == "FizzBuzz" if i is divisible by 3 and 5.\n- answer[i] == "Fizz" if i is divisible by 3.\n- answer[i] == "Buzz" if i is divisible by 5.\n- answer[i] == i (as a string) if none of the above conditions are true.',
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' }
    ],
    constraints: ['1 <= n <= 10^4'],
    starterCode: {
      javascript: 'function fizzBuzz(n) {\n    // Your code here\n}',
      python: 'def fizz_buzz(n):\n    # Your code here\n    pass',
      typescript: 'function fizzBuzz(n: number): string[] {\n    // Your code here\n    return [];\n}',
      java: 'public List<String> fizzBuzz(int n) {\n    // Your code here\n    return new ArrayList<>();\n}',
      cpp: 'vector<string> fizzBuzz(int n) {\n    // Your code here\n    return {};\n}'
    },
    testCases: [{ input: '3', expectedOutput: '["1","2","Fizz"]' }],
    hints: ['Check divisibility by 15 first', 'Then check 3, then 5', 'Otherwise use the number as string'],
    solution: 'Iterate 1 to n, check divisibility in order: 15, 3, 5, else number.',
    topics: ['Math', 'String']
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.',
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads as 121 from left to right and from right to left.' },
      { input: 'x = -121', output: 'false' },
      { input: 'x = 10', output: 'false' }
    ],
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    starterCode: {
      javascript: 'function isPalindrome(x) {\n    // Your code here\n}',
      python: 'def is_palindrome(x):\n    # Your code here\n    pass',
      typescript: 'function isPalindrome(x: number): boolean {\n    // Your code here\n    return false;\n}',
      java: 'public boolean isPalindrome(int x) {\n    // Your code here\n    return false;\n}',
      cpp: 'bool isPalindrome(int x) {\n    // Your code here\n    return false;\n}'
    },
    testCases: [{ input: '121', expectedOutput: 'true' }, { input: '-121', expectedOutput: 'false' }],
    hints: ['Negative numbers are never palindromes', 'Convert to string and check', 'Or reverse the number mathematically'],
    solution: 'Check negative. Convert to string and compare with reversed string.',
    topics: ['Math']
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n    // Your code here\n}',
      python: 'def max_sub_array(nums):\n    # Your code here\n    pass',
      typescript: 'function maxSubArray(nums: number[]): number {\n    // Your code here\n    return 0;\n}',
      java: 'public int maxSubArray(int[] nums) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int maxSubArray(vector<int>& nums) {\n    // Your code here\n    return 0;\n}'
    },
    testCases: [{ input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' }],
    hints: ['Look up Kadanes algorithm', 'Track current sum and max sum', 'Reset current sum when it goes negative'],
    solution: "Kadane's algorithm: track currentSum and maxSum, reset currentSum to 0 when negative.",
    topics: ['Array', 'Dynamic Programming']
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    description: 'You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: 1+1 and 2.' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: 1+1+1, 1+2, and 2+1.' }
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      javascript: 'function climbStairs(n) {\n    // Your code here\n}',
      python: 'def climb_stairs(n):\n    # Your code here\n    pass',
      typescript: 'function climbStairs(n: number): number {\n    // Your code here\n    return 0;\n}',
      java: 'public int climbStairs(int n) {\n    // Your code here\n    return 0;\n}',
      cpp: 'int climbStairs(int n) {\n    // Your code here\n    return 0;\n}'
    },
    testCases: [{ input: '2', expectedOutput: '2' }, { input: '3', expectedOutput: '3' }],
    hints: ['This is essentially the Fibonacci sequence', 'f(n) = f(n-1) + f(n-2)', 'Start with base cases: f(1)=1, f(2)=2'],
    solution: 'Dynamic programming - Fibonacci pattern. f(n) = f(n-1) + f(n-2).',
    topics: ['Dynamic Programming', 'Math']
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' }
    ],
    constraints: ['The number of nodes in the list is in range [0, 5000]', '-5000 <= Node.val <= 5000'],
    starterCode: {
      javascript: 'function reverseList(head) {\n    // Your code here\n}',
      python: 'def reverse_list(head):\n    # Your code here\n    pass',
      typescript: 'function reverseList(head: ListNode | null): ListNode | null {\n    // Your code here\n    return null;\n}',
      java: 'public ListNode reverseList(ListNode head) {\n    // Your code here\n    return null;\n}',
      cpp: 'ListNode* reverseList(ListNode* head) {\n    // Your code here\n    return nullptr;\n}'
    },
    testCases: [{ input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' }],
    hints: ['Use three pointers: prev, current, next', 'Iterate and reverse the links', 'Can also be done recursively'],
    solution: 'Iterative: use prev=null, curr=head. For each node, save next, point curr to prev, advance both.',
    topics: ['Linked List']
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', 'All integers in nums are unique', 'nums is sorted in ascending order'],
    starterCode: {
      javascript: 'function search(nums, target) {\n    // Your code here\n}',
      python: 'def search(nums, target):\n    # Your code here\n    pass',
      typescript: 'function search(nums: number[], target: number): number {\n    // Your code here\n    return -1;\n}',
      java: 'public int search(int[] nums, int target) {\n    // Your code here\n    return -1;\n}',
      cpp: 'int search(vector<int>& nums, int target) {\n    // Your code here\n    return -1;\n}'
    },
    testCases: [{ input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' }],
    hints: ['Use left and right pointers', 'Calculate mid = Math.floor((left + right) / 2)', 'If nums[mid] < target, search right half, else search left half'],
    solution: 'Classic binary search with left/right pointers. Halve the search space each iteration.',
    topics: ['Array', 'Binary Search']
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Sorted Array',
    difficulty: 'Easy',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\n\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.',
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' }
    ],
    constraints: ['nums1.length == m + n', '0 <= m, n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    starterCode: {
      javascript: 'function merge(nums1, m, nums2, n) {\n    // Your code here\n}',
      python: 'def merge(nums1, m, nums2, n):\n    # Your code here\n    pass',
      typescript: 'function merge(nums1: number[], m: number, nums2: number[], n: number): void {\n    // Your code here\n}',
      java: 'public void merge(int[] nums1, int m, int[] nums2, int n) {\n    // Your code here\n}',
      cpp: 'void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    // Your code here\n}'
    },
    testCases: [{ input: '[1,2,3,0,0,0], 3, [2,5,6], 3', expectedOutput: '[1,2,2,3,5,6]' }],
    hints: ['Start merging from the end', 'Use three pointers: i=m-1, j=n-1, k=m+n-1', 'Compare and place the larger element at position k'],
    solution: 'Merge from the back using three pointers to avoid overwriting elements.',
    topics: ['Array', 'Two Pointers']
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
