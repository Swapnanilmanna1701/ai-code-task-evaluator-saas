import { db } from '@/db';
import { evaluations } from '@/db/schema';

async function main() {
    const sampleEvaluations = [
        {
            taskId: 1,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            score: 92,
            strengths: JSON.stringify([
                "Clean and readable code structure with excellent separation of concerns",
                "Proper error handling implemented with try-catch blocks",
                "Efficient algorithm with O(n) time complexity",
                "Good use of TypeScript types for type safety",
                "Well-documented with clear, descriptive comments"
            ]),
            improvements: JSON.stringify([
                "Consider adding input validation for edge cases like empty arrays",
                "Could extract magic numbers into named constants for better maintainability",
                "Add unit tests to verify functionality across different scenarios"
            ]),
            detailedFeedback: "Your implementation demonstrates a strong understanding of JavaScript fundamentals and best practices. The code is well-structured with clear variable naming and logical flow that makes it easy to follow. The use of modern ES6+ features like arrow functions and template literals shows good knowledge of contemporary JavaScript patterns.\n\nThe algorithm you've chosen is optimal for this problem, achieving linear time complexity which is excellent. Your error handling approach is commendable, wrapping the main logic in try-catch blocks to gracefully handle potential runtime errors. The TypeScript typing is also well-implemented, providing good type safety throughout the codebase.\n\nThere are a few areas where the code could be enhanced. First, consider adding validation for edge cases such as empty inputs or null values at the function entry point. This defensive programming approach would make your code more robust. Second, extracting the hardcoded values into named constants would improve code maintainability and make the intent clearer. Finally, while the code works correctly, adding comprehensive unit tests would ensure it continues to work as expected when modifications are made.\n\nOverall, this is high-quality code that demonstrates professional-level skills. The structure is solid, the logic is sound, and with minor refinements around edge case handling and testing, this would be production-ready code. Great work on maintaining readability while implementing an efficient solution.",
            isPremiumUnlocked: true,
            createdAt: new Date('2024-01-16T14:30:00Z').toISOString(),
        },
        {
            taskId: 2,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r4',
            score: 78,
            strengths: JSON.stringify([
                "Functional approach with good use of array methods",
                "Code is concise and easy to understand",
                "Proper use of async/await for asynchronous operations",
                "Good variable naming conventions"
            ]),
            improvements: JSON.stringify([
                "Algorithm could be optimized to reduce time complexity from O(n²) to O(n)",
                "Missing error handling for async operations",
                "Consider using memoization to avoid redundant calculations",
                "Add TypeScript interfaces for better type definitions"
            ]),
            detailedFeedback: "Your solution shows a good grasp of functional programming concepts in JavaScript, utilizing array methods like map, filter, and reduce effectively. The code is readable and follows a logical structure that makes the intent clear. The use of async/await for handling asynchronous operations is appropriate and modern.\n\nHowever, there's a significant performance concern with the current implementation. The nested loop structure results in O(n²) time complexity, which could become problematic with larger datasets. By using a hash map or Set data structure, you could reduce this to O(n) complexity, providing a substantial performance improvement. This is particularly important for scalability.\n\nAnother area for improvement is error handling. While you're using async/await, there's no try-catch block to handle potential errors from asynchronous operations. This could lead to unhandled promise rejections. Additionally, the code would benefit from more robust TypeScript typing - consider defining interfaces for your data structures to catch type-related errors at compile time.\n\nThe logic is fundamentally sound and the code accomplishes the task correctly. With optimization of the algorithm and enhanced error handling, this would be a much stronger solution. Consider the performance implications of your data structure choices in future implementations.",
            isPremiumUnlocked: false,
            createdAt: new Date('2024-01-18T09:15:00Z').toISOString(),
        },
        {
            taskId: 3,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            score: 88,
            strengths: JSON.stringify([
                "Excellent use of design patterns (Factory pattern implementation)",
                "Comprehensive error handling with custom error classes",
                "Well-structured code with clear separation of concerns",
                "Strong TypeScript typing with generics",
                "Good documentation and inline comments"
            ]),
            improvements: JSON.stringify([
                "Could add integration tests alongside unit tests",
                "Consider implementing dependency injection for better testability",
                "Some functions could be broken down further for single responsibility"
            ]),
            detailedFeedback: "This is an impressive implementation that showcases advanced programming concepts and software engineering principles. Your use of the Factory pattern is appropriate for this use case and demonstrates understanding of object-oriented design. The custom error classes provide meaningful error messages and make debugging much easier.\n\nThe TypeScript implementation is particularly strong, with excellent use of generics that provide type safety while maintaining flexibility. Your code structure follows SOLID principles well, with clear separation of concerns making the codebase maintainable. The comprehensive comments and documentation make it easy for other developers to understand and work with your code.\n\nError handling is robust throughout, catching potential issues early and providing clear feedback. This defensive programming approach is exactly what production code should have. The variable and function naming is descriptive and follows consistent conventions.\n\nFor further improvement, consider adding integration tests to complement your unit tests, ensuring that different parts of the system work together correctly. Implementing dependency injection would make the code even more testable and loosely coupled. Some of the larger functions could potentially be refactored into smaller, more focused functions to adhere more strictly to the single responsibility principle.\n\nThis is professional-grade code that demonstrates strong technical skills. The architecture is sound, the implementation is clean, and with minor enhancements around testing and further modularization, this would be exemplary production code. Excellent work.",
            isPremiumUnlocked: true,
            createdAt: new Date('2024-01-20T16:45:00Z').toISOString(),
        },
        {
            taskId: 4,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r5',
            score: 65,
            strengths: JSON.stringify([
                "Basic functionality works as expected",
                "Code is straightforward and easy to follow",
                "Appropriate use of Python's built-in functions"
            ]),
            improvements: JSON.stringify([
                "Missing validation for input parameters",
                "Logic contains edge case bugs with empty or null inputs",
                "Could optimize memory usage by using generators instead of lists",
                "Lacks error handling for potential runtime errors",
                "Consider adding type hints for Python 3.5+ compatibility"
            ]),
            detailedFeedback: "Your solution addresses the core requirements and demonstrates understanding of basic Python syntax and control structures. The logic flow is straightforward, making it easy to understand what the code is attempting to do. You've appropriately leveraged some of Python's built-in functions which shows familiarity with the standard library.\n\nHowever, there are several critical issues that need attention. First, the code lacks input validation, which means it will fail with cryptic error messages when given unexpected inputs like None, empty collections, or values outside expected ranges. Always validate inputs at function boundaries to fail fast with meaningful error messages.\n\nThe current implementation has bugs when handling edge cases. Testing with empty inputs reveals that the code throws an IndexError, indicating the logic doesn't account for all possible input states. Additionally, there's no error handling around operations that could fail, leaving the code vulnerable to runtime exceptions that could crash the application.\n\nFrom a performance perspective, the code creates intermediate lists that consume unnecessary memory. Using generators would provide the same functionality with better memory efficiency, especially important when processing large datasets.\n\nTo improve this code, start by adding comprehensive input validation and error handling. Then address the edge case bugs through careful testing. Consider adding Python type hints to catch type-related errors early. Finally, refactor memory-intensive operations to use generators where appropriate. With these improvements, the code would be much more robust and production-ready.",
            isPremiumUnlocked: false,
            createdAt: new Date('2024-01-22T11:20:00Z').toISOString(),
        },
        {
            taskId: 5,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            score: 85,
            strengths: JSON.stringify([
                "Efficient use of React hooks (useState, useEffect)",
                "Clean component structure with proper separation",
                "Good performance optimization with useMemo and useCallback",
                "Proper handling of component lifecycle",
                "Accessible UI with ARIA labels"
            ]),
            improvements: JSON.stringify([
                "Consider extracting custom hooks for reusable logic",
                "Could implement error boundaries for better error handling",
                "Add PropTypes or TypeScript for type safety",
                "Consider using React.memo for preventing unnecessary re-renders"
            ]),
            detailedFeedback: "Your React implementation demonstrates solid understanding of modern React patterns and hooks. The component structure is clean and well-organized, with clear separation between presentational and logic concerns. Your use of hooks like useState and useEffect is appropriate and follows React best practices.\n\nThe performance optimizations you've implemented using useMemo and useCallback show awareness of React's rendering behavior and how to prevent unnecessary re-renders. This is particularly important in larger applications where performance can degrade quickly. The component lifecycle is properly managed, with cleanup functions in useEffect preventing memory leaks.\n\nAccessibility considerations are commendable, with ARIA labels and semantic HTML making the component usable for all users. This attention to accessibility is often overlooked but is crucial for professional applications.\n\nFor improvement, consider extracting some of the hook logic into custom hooks. This would make the logic reusable across components and keep individual components focused. Implementing error boundaries would provide a safety net for runtime errors, preventing the entire app from crashing. Adding PropTypes or migrating to TypeScript would provide type safety and catch errors during development.\n\nAdditionally, wrapping some child components with React.memo could further optimize performance by preventing re-renders when props haven't changed. Overall, this is well-crafted React code that follows modern patterns. With the suggested enhancements around reusability and type safety, this would be excellent production code.",
            isPremiumUnlocked: true,
            createdAt: new Date('2024-01-24T13:00:00Z').toISOString(),
        },
        {
            taskId: 6,
            userId: 'user_01h4kxt2e8z9y3b1n7m6q5w8r6',
            score: 58,
            strengths: JSON.stringify([
                "Basic SQL syntax is correct",
                "Query accomplishes the intended goal",
                "Appropriate use of JOIN operations"
            ]),
            improvements: JSON.stringify([
                "Query is vulnerable to SQL injection attacks",
                "Missing indexes could cause severe performance issues with large datasets",
                "No error handling or transaction management",
                "Could optimize with EXPLAIN to identify bottlenecks",
                "Consider using prepared statements for security"
            ]),
            detailedFeedback: "Your SQL query demonstrates understanding of basic database operations and JOIN syntax. The query structure is logically sound and produces the expected results for the use case described. The use of table aliases makes the query more readable.\n\nHowever, there are critical security and performance issues that must be addressed. Most importantly, the query appears to use string concatenation for user inputs, making it vulnerable to SQL injection attacks. This is a serious security flaw that could allow malicious users to access, modify, or delete data. Always use parameterized queries or prepared statements to prevent SQL injection.\n\nFrom a performance standpoint, the query lacks proper indexing strategy. The tables being joined don't appear to have indexes on the join columns, which will cause full table scans and dramatically slow down query execution as data volume grows. Running EXPLAIN on this query would likely reveal these performance issues.\n\nThe query also lacks proper error handling and transaction management. For operations that modify data, wrapping them in transactions ensures data consistency and allows for rollback if something goes wrong. Additionally, there's no handling of potential errors like constraint violations or deadlocks.\n\nTo improve this code, immediately address the SQL injection vulnerability by implementing prepared statements. Add appropriate indexes on frequently joined and filtered columns. Implement transaction boundaries for data modification operations, and add error handling to gracefully manage database errors. Consider using an ORM if the application would benefit from abstraction over raw SQL. These changes are essential for secure, performant, and reliable database interactions.",
            isPremiumUnlocked: false,
            createdAt: new Date('2024-01-25T15:30:00Z').toISOString(),
        },
    ];

    await db.insert(evaluations).values(sampleEvaluations);
    
    console.log('✅ Evaluations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});