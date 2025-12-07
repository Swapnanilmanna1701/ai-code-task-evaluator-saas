import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
});

const SYSTEM_PROMPT = `You are CodeBot, an expert AI assistant for AssessIQ - a code evaluation platform. You help developers with:

1. **Coding Questions**: Answer questions about programming languages (JavaScript, TypeScript, Python, Java, C++, Go, Rust, etc.)
2. **Code Review Tips**: Provide guidance on writing clean, maintainable code
3. **Debugging Help**: Help users understand and fix common coding errors
4. **Best Practices**: Share coding best practices, design patterns, and architecture advice
5. **Algorithm & Data Structures**: Explain algorithms and help optimize code
6. **Framework Questions**: Answer questions about popular frameworks (React, Next.js, Node.js, etc.)

Guidelines:
- Be concise but thorough
- Use code examples when helpful (format with markdown code blocks)
- Be encouraging and supportive
- If you don't know something, say so honestly
- Focus on teaching concepts, not just giving answers
- When showing code, explain what it does

You are helpful, friendly, and knowledgeable about software development.`;

// Fallback responses for common coding questions when API is unavailable
const FALLBACK_RESPONSES: Record<string, string> = {
  "null": `**Handling Null/Undefined Errors in JavaScript**

Null pointer (or "Cannot read property of undefined/null") errors are common. Here are ways to fix them:

**1. Optional Chaining (?.):**
\`\`\`javascript
// Instead of: object.property.nested
const value = object?.property?.nested;
\`\`\`

**2. Nullish Coalescing (??):**
\`\`\`javascript
const value = possiblyNull ?? 'default value';
\`\`\`

**3. Guard Clauses:**
\`\`\`javascript
if (!object || !object.property) {
  return; // or handle the error
}
\`\`\`

**4. Default Parameters:**
\`\`\`javascript
function greet(name = 'Guest') {
  console.log(\`Hello, \${name}\`);
}
\`\`\`

These patterns help prevent null reference errors before they happen!`,

  "react": `**React Best Practices**

Here are key React patterns to follow:

**1. Use Functional Components & Hooks:**
\`\`\`jsx
function MyComponent({ name }) {
  const [count, setCount] = useState(0);
  return <div>Hello {name}, count: {count}</div>;
}
\`\`\`

**2. Keep Components Small & Focused**
- Each component should do one thing well
- Extract reusable logic into custom hooks

**3. Use Proper Key Props:**
\`\`\`jsx
{items.map(item => (
  <Item key={item.id} data={item} />
))}
\`\`\`

**4. Memoize Expensive Computations:**
\`\`\`jsx
const expensive = useMemo(() => computeValue(data), [data]);
\`\`\`

**5. Handle Loading & Error States**
Always show users what's happening!`,

  "async": `**Understanding Async/Await in JavaScript**

Async/await makes asynchronous code easier to read and write.

**Basic Syntax:**
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

**Key Points:**
1. \`async\` functions always return a Promise
2. \`await\` pauses execution until the Promise resolves
3. Always use try/catch for error handling
4. You can await multiple promises with \`Promise.all()\`:

\`\`\`javascript
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);
\`\`\`

This runs both requests concurrently, improving performance!`,

  "database": `**Database Query Optimization Tips**

Here are ways to optimize your database queries:

**1. Use Indexes:**
- Add indexes on frequently queried columns
- Composite indexes for multi-column queries

**2. Select Only What You Need:**
\`\`\`sql
-- Instead of SELECT *
SELECT id, name, email FROM users WHERE active = true;
\`\`\`

**3. Batch Operations:**
\`\`\`javascript
// Insert multiple records at once
await db.insert(users).values(arrayOfUsers);
\`\`\`

**4. Use Pagination:**
\`\`\`sql
SELECT * FROM posts LIMIT 20 OFFSET 0;
\`\`\`

**5. Avoid N+1 Queries:**
Use JOINs or eager loading instead of querying in loops.`,

  "default": `I'm here to help with your coding questions! 

I can assist with:
• **Debugging** - Help fix errors and bugs
• **Best Practices** - Clean code patterns
• **Algorithms** - Data structures & optimization
• **Frameworks** - React, Next.js, Node.js, etc.
• **Languages** - JavaScript, TypeScript, Python, and more

What would you like to know? Try asking specific questions like:
- "How do I handle errors in async functions?"
- "What's the best way to structure a React component?"
- "How can I optimize my database queries?"

I'll do my best to provide helpful code examples and explanations!`
};

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('null') || lowerMessage.includes('undefined') || lowerMessage.includes('cannot read')) {
    return FALLBACK_RESPONSES.null;
  }
  if (lowerMessage.includes('react') || lowerMessage.includes('component') || lowerMessage.includes('hook')) {
    return FALLBACK_RESPONSES.react;
  }
  if (lowerMessage.includes('async') || lowerMessage.includes('await') || lowerMessage.includes('promise')) {
    return FALLBACK_RESPONSES.async;
  }
  if (lowerMessage.includes('database') || lowerMessage.includes('query') || lowerMessage.includes('sql')) {
    return FALLBACK_RESPONSES.database;
  }
  
  return FALLBACK_RESPONSES.default;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        response: getFallbackResponse(message),
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

    try {
      // Build conversation context
      let conversationContext = SYSTEM_PROMPT + "\n\n";
      
      // Add conversation history (last 10 messages for context)
      const recentHistory = history.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user') {
          conversationContext += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationContext += `Assistant: ${msg.content}\n`;
        }
      }
      
      conversationContext += `User: ${message}\nAssistant:`;

      const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: conversationContext,
      });

      const responseText = result.text || getFallbackResponse(message);

      return NextResponse.json({ 
        response: responseText,
        timestamp: new Date().toISOString()
      });
    } catch (aiError: unknown) {
      console.error('Gemini API error:', aiError);
      // Return fallback response instead of error
      return NextResponse.json({ 
        response: getFallbackResponse(message),
        timestamp: new Date().toISOString(),
        fallback: true
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      response: FALLBACK_RESPONSES.default,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}