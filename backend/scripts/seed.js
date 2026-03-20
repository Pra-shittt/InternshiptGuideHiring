import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Interview from '../models/Interview.js';
import Assessment from '../models/Assessment.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import connectDB from '../config/db.js';

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');

    await User.deleteMany({});
    await Question.deleteMany({});
    await Interview.deleteMany({});
    await Assessment.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Create users with skills
    console.log('👤 Creating users...');
    const users = await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { name: 'Sarah Mitchell', email: 'recruiter@example.com', password: 'recruiter123', role: 'recruiter', company: 'TechCorp Inc.' },
      { name: 'James Rodriguez', email: 'recruiter2@example.com', password: 'recruiter123', role: 'recruiter', company: 'InnovateTech' },
      { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'candidate', skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'], interviewStatus: 'available' },
      { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'candidate', skills: ['Python', 'Django', 'PostgreSQL', 'Docker'], interviewStatus: 'available' },
      { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', role: 'candidate', skills: ['Java', 'Spring Boot', 'AWS', 'Microservices'], interviewStatus: 'hired' },
      { name: 'Diana Prince', email: 'diana@example.com', password: 'password123', role: 'candidate', skills: ['React', 'Vue.js', 'GraphQL', 'Firebase'], interviewStatus: 'available' },
      { name: 'Evan Wright', email: 'evan@example.com', password: 'password123', role: 'candidate', skills: ['C++', 'Algorithms', 'System Design', 'Linux'], interviewStatus: 'rejected' },
      { name: 'Fiona Davis', email: 'fiona@example.com', password: 'password123', role: 'candidate', skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science'], interviewStatus: 'available' },
      { name: 'George Lee', email: 'george@example.com', password: 'password123', role: 'candidate', skills: ['React Native', 'Flutter', 'Kotlin', 'Swift'], interviewStatus: 'available' },
      { name: 'Hannah Kim', email: 'hannah@example.com', password: 'password123', role: 'candidate', skills: ['Node.js', 'Express', 'Redis', 'Kubernetes'], interviewStatus: 'available' },
    ]);
    console.log(`   ✅ Created ${users.length} users`);

    const recruiter = users[1];
    const candidates = users.filter(u => u.role === 'candidate');

    // Create interviews
    console.log('📅 Creating interviews...');
    const now = new Date();
    const interviews = await Interview.create([
      { candidateId: candidates[0]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() + 2 * 60 * 60 * 1000), status: 'SCHEDULED', result: 'pending' },
      { candidateId: candidates[1]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), status: 'SCHEDULED', result: 'pending' },
      { candidateId: candidates[2]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), status: 'COMPLETED', result: 'selected', rating: 5, notes: 'Excellent problem-solving skills. Strong Spring Boot knowledge.' },
      { candidateId: candidates[3]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() + 72 * 60 * 60 * 1000), status: 'SCHEDULED', result: 'pending' },
      { candidateId: candidates[4]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), status: 'COMPLETED', result: 'rejected', rating: 2, notes: 'Needs to improve system design fundamentals.' },
      { candidateId: candidates[5]._id, recruiterId: recruiter._id, scheduledAt: new Date(now.getTime() + 96 * 60 * 60 * 1000), status: 'SCHEDULED', result: 'pending' },
    ]);
    console.log(`   ✅ Created ${interviews.length} interviews`);

    // Create assessments
    console.log('📊 Creating assessments...');
    const assessments = await Assessment.create([
      { candidateId: candidates[0]._id, title: 'React Fundamentals', type: 'coding', score: 85, maxScore: 100, language: 'javascript' },
      { candidateId: candidates[0]._id, title: 'Data Structures', type: 'mcq', score: 92, maxScore: 100 },
      { candidateId: candidates[1]._id, title: 'Python Backend', type: 'coding', score: 78, maxScore: 100, language: 'python' },
      { candidateId: candidates[2]._id, title: 'Java Spring Boot', type: 'coding', score: 95, maxScore: 100, language: 'java' },
      { candidateId: candidates[3]._id, title: 'Frontend Assessment', type: 'coding', score: 88, maxScore: 100, language: 'javascript' },
      { candidateId: candidates[4]._id, title: 'System Design', type: 'mcq', score: 45, maxScore: 100 },
      { candidateId: candidates[5]._id, title: 'ML Fundamentals', type: 'coding', score: 91, maxScore: 100, language: 'python' },
      { candidateId: candidates[6]._id, title: 'Mobile Development', type: 'coding', score: 82, maxScore: 100, language: 'javascript' },
      { candidateId: candidates[7]._id, title: 'Backend Architecture', type: 'coding', score: 87, maxScore: 100, language: 'javascript' },
    ]);
    console.log(`   ✅ Created ${assessments.length} assessments`);

    // Create MCQ questions
    console.log('📝 Creating questions...');
    const questions = await Question.create([
      {
        title: 'Two Sum',
        company: 'Amazon',
        topic: 'Arrays',
        difficulty: 'Easy',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/two-sum/',
        questionText: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. What is the optimal time complexity?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correctAnswer: 'O(n)',
        explanation: 'Using a hash map, we can solve Two Sum in O(n) time by storing each element and checking if the complement exists.',
      },
      {
        title: 'Maximum Subarray',
        company: 'Google',
        topic: 'Arrays',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/maximum-subarray/',
        questionText: 'Which algorithm is commonly used to find the maximum subarray sum in O(n) time?',
        options: ['Merge Sort', "Kadane's Algorithm", 'Binary Search', 'Quick Sort'],
        correctAnswer: "Kadane's Algorithm",
        explanation: "Kadane's Algorithm iterates through the array once, keeping track of the maximum ending at each position.",
      },
      {
        title: 'Merge Sorted Array',
        company: 'Microsoft',
        topic: 'Arrays',
        difficulty: 'Easy',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/merge-sorted-array/',
        questionText: 'When merging two sorted arrays in-place, which direction should you fill the merged array to avoid overwriting elements?',
        options: ['Left to right', 'Right to left', 'From the middle', 'Random order'],
        correctAnswer: 'Right to left',
        explanation: 'Filling from right to left avoids overwriting elements in the first array that have not yet been processed.',
      },
      {
        title: 'Valid Anagram',
        company: 'Amazon',
        topic: 'Strings',
        difficulty: 'Easy',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/valid-anagram/',
        questionText: 'What is the most efficient approach to check if two strings are valid anagrams?',
        options: ['Sort both strings and compare', 'Use a frequency counter (hash map)', 'Use two pointers', 'Use recursion'],
        correctAnswer: 'Use a frequency counter (hash map)',
        explanation: 'A frequency counter approach runs in O(n) time and O(1) space (fixed alphabet size).',
      },
      {
        title: 'Longest Palindromic Substring',
        company: 'Google',
        topic: 'Strings',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/longest-palindromic-substring/',
        questionText: 'The "expand around center" approach for finding the longest palindromic substring has what time complexity?',
        options: ['O(n)', 'O(n²)', 'O(n³)', 'O(n log n)'],
        correctAnswer: 'O(n²)',
        explanation: 'We expand from each character (and gap) in O(n) for each of the n centers, resulting in O(n²).',
      },
      {
        title: 'Validate Binary Search Tree',
        company: 'TCS',
        topic: 'Trees',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/validate-binary-search-tree/',
        questionText: 'Which traversal technique is most naturally suited for validating a BST?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
        correctAnswer: 'In-order',
        explanation: 'An in-order traversal of a valid BST produces elements in strictly increasing order.',
      },
      {
        title: 'Lowest Common Ancestor',
        company: 'Infosys',
        topic: 'Trees',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
        questionText: 'In a binary tree, what is the time complexity of finding the lowest common ancestor using recursion?',
        options: ['O(log n)', 'O(n)', 'O(n²)', 'O(n log n)'],
        correctAnswer: 'O(n)',
        explanation: 'In the worst case, we may need to visit every node in the tree once.',
      },
      {
        title: 'Climbing Stairs',
        company: 'Amazon',
        topic: 'Dynamic Programming',
        difficulty: 'Easy',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/climbing-stairs/',
        questionText: 'The Climbing Stairs problem (1 or 2 steps) is equivalent to which mathematical sequence?',
        options: ['Prime numbers', 'Fibonacci sequence', 'Geometric series', 'Catalan numbers'],
        correctAnswer: 'Fibonacci sequence',
        explanation: 'f(n) = f(n-1) + f(n-2), which is exactly the Fibonacci recurrence relation.',
      },
      {
        title: 'Longest Common Subsequence',
        company: 'Google',
        topic: 'Dynamic Programming',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/longest-common-subsequence/',
        questionText: 'The classic DP solution for Longest Common Subsequence uses a table of size:',
        options: ['n × 1', 'n × m', 'n × n', '1 × m'],
        correctAnswer: 'n × m',
        explanation: 'Where n and m are the lengths of the two input strings.',
      },
      {
        title: '0/1 Knapsack Problem',
        company: 'Microsoft',
        topic: 'Dynamic Programming',
        difficulty: 'Hard',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/partition-equal-subset-sum/',
        questionText: 'What is the time complexity of the 0/1 Knapsack problem using dynamic programming?',
        options: ['O(n)', 'O(n × W)', 'O(2^n)', 'O(n²)'],
        correctAnswer: 'O(n × W)',
        explanation: 'Where n is the number of items and W is the knapsack capacity.',
      },
      {
        title: 'Number of Islands',
        company: 'Amazon',
        topic: 'Graphs',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/number-of-islands/',
        questionText: 'Which approach is used to count the number of islands in a 2D grid?',
        options: ['Binary Search', 'BFS/DFS', 'Sliding Window', 'Two Pointers'],
        correctAnswer: 'BFS/DFS',
        explanation: 'We iterate through the grid and perform BFS or DFS from each unvisited land cell.',
      },
      {
        title: 'Detect Cycle in Directed Graph',
        company: 'TCS',
        topic: 'Graphs',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/course-schedule/',
        questionText: 'Which color marking scheme is used in DFS to detect cycles in a directed graph?',
        options: ['White-Black', 'White-Gray-Black', 'Red-Green', 'Red-Yellow-Green'],
        correctAnswer: 'White-Gray-Black',
        explanation: 'White = unvisited, Gray = in current DFS path, Black = fully processed.',
      },
      {
        title: 'URL Shortener Design',
        company: 'Google',
        topic: 'System Design',
        difficulty: 'Medium',
        type: 'MCQ',
        platform: 'LeetCode',
        link: 'https://leetcode.com/problems/encode-and-decode-tinyurl/',
        questionText: 'In a URL shortener system, which technique is commonly used to generate short unique keys?',
        options: ['Sequential numbering', 'Base62 encoding', 'MD5 hashing', 'Random UUID'],
        correctAnswer: 'Base62 encoding',
        explanation: 'Base62 (a-z, A-Z, 0-9) encoding of a unique counter/ID gives short, URL-safe strings.',
      },
      {
        title: 'Database Sharding',
        company: 'Infosys',
        topic: 'System Design',
        difficulty: 'Hard',
        type: 'MCQ',
        questionText: 'What is the primary challenge of horizontal sharding in databases?',
        options: ['Data redundancy', 'Cross-shard queries and joins', 'Schema migration', 'Index rebuilding'],
        correctAnswer: 'Cross-shard queries and joins',
        explanation: 'When data is distributed across shards, queries that span multiple shards become complex.',
      },
      {
        title: 'SOLID Principles',
        company: 'TCS',
        topic: 'OOP',
        difficulty: 'Easy',
        type: 'MCQ',
        questionText: 'What does the "S" in SOLID stand for?',
        options: ['Substitution Principle', 'Single Responsibility Principle', 'Segregation Principle', 'Static Principle'],
        correctAnswer: 'Single Responsibility Principle',
        explanation: 'A class should have only one reason to change.',
      },
    ]);
    console.log(`   ✅ Created ${questions.length} questions`);

    // Create job postings
    console.log('💼 Creating job postings...');
    const recruiter2 = users[2]; // InnovateTech recruiter
    const jobs = await Job.create([
      {
        postedBy: recruiter._id,
        title: 'Senior React Developer',
        description: 'We are looking for an experienced React developer to join our frontend team. You will be building modern web applications using React, TypeScript, and Node.js.',
        company: 'TechCorp Inc.',
        location: 'Bangalore, India',
        type: 'Full-Time',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
        salary: '₹12-18 LPA',
        openings: 3,
        status: 'open',
        deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        postedBy: recruiter._id,
        title: 'Backend Engineer Intern',
        description: 'Join our backend team as an intern and learn about building scalable APIs, database design, and cloud deployments.',
        company: 'TechCorp Inc.',
        location: 'Remote',
        type: 'Internship',
        skills: ['Node.js', 'Express', 'MongoDB'],
        salary: '₹25,000/month',
        openings: 5,
        status: 'open',
        deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        postedBy: recruiter2._id,
        title: 'Full Stack Developer',
        description: 'InnovateTech is hiring full stack developers to work on our SaaS platform. Experience with React and Python/Django is preferred.',
        company: 'InnovateTech',
        location: 'Hyderabad, India',
        type: 'Full-Time',
        skills: ['React', 'Python', 'Django', 'PostgreSQL'],
        salary: '₹10-15 LPA',
        openings: 2,
        status: 'open',
      },
      {
        postedBy: recruiter2._id,
        title: 'DevOps Engineer',
        description: 'Looking for a DevOps engineer to manage our CI/CD pipelines, container orchestration, and cloud infrastructure.',
        company: 'InnovateTech',
        location: 'Pune, India',
        type: 'Full-Time',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Linux'],
        salary: '₹15-22 LPA',
        openings: 1,
        status: 'open',
      },
      {
        postedBy: recruiter._id,
        title: 'ML Engineer',
        description: 'Build and deploy machine learning models for our recommendation and analytics engines.',
        company: 'TechCorp Inc.',
        location: 'Bangalore, India',
        type: 'Full-Time',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
        salary: '₹18-25 LPA',
        openings: 2,
        status: 'open',
      },
    ]);
    console.log(`   ✅ Created ${jobs.length} job postings`);

    // Create applications
    console.log('📨 Creating applications...');
    const applications = await Application.create([
      { job: jobs[0]._id, applicant: candidates[0]._id, status: 'shortlisted', coverLetter: 'I have 3 years of React experience.', assessmentScore: 85 },
      { job: jobs[0]._id, applicant: candidates[3]._id, status: 'applied', coverLetter: 'Passionate about React and modern web development.' },
      { job: jobs[0]._id, applicant: candidates[7]._id, status: 'interview', coverLetter: 'Strong Node.js and Express background.', assessmentScore: 87 },
      { job: jobs[1]._id, applicant: candidates[1]._id, status: 'applied', coverLetter: 'Looking for backend internship opportunities.' },
      { job: jobs[1]._id, applicant: candidates[6]._id, status: 'shortlisted', coverLetter: 'Eager to learn backend development.' },
      { job: jobs[2]._id, applicant: candidates[1]._id, status: 'offered', coverLetter: 'Python and Django expert.', assessmentScore: 78 },
      { job: jobs[2]._id, applicant: candidates[3]._id, status: 'applied', coverLetter: 'Frontend skills with growing backend proficiency.' },
      { job: jobs[3]._id, applicant: candidates[4]._id, status: 'rejected', coverLetter: 'System design experience.', assessmentScore: 45, notes: 'Needs more hands-on DevOps experience.' },
      { job: jobs[4]._id, applicant: candidates[5]._id, status: 'shortlisted', coverLetter: 'ML researcher with TensorFlow expertise.', assessmentScore: 91 },
    ]);
    console.log(`   ✅ Created ${applications.length} applications`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:     admin@example.com      / admin123');
    console.log('   Recruiter: recruiter@example.com   / recruiter123');
    console.log('   Candidate: alice@example.com       / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
