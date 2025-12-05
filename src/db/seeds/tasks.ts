import { db } from '@/db';
import { tasks } from '@/db/schema';

async function main() {
    const sampleTasks = [
        {
            userId: 'test-user-1',
            title: 'Implement Binary Search Algorithm',
            description: 'Create an efficient binary search implementation with proper edge case handling and time complexity of O(log n).',
            codeContent: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test the function
sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
result = binary_search(sorted_array, 11)
print(f"Element found at index: {result}")`,
            language: 'python',
            status: 'completed',
            createdAt: new Date('2024-12-15T10:30:00').toISOString(),
            updatedAt: new Date('2024-12-15T10:45:00').toISOString(),
        },
        {
            userId: 'test-user-1',
            title: 'React Component for User Dashboard',
            description: 'Build a responsive user dashboard component with state management, data fetching, and error handling.',
            codeContent: `import React, { useState, useEffect } from 'react';

const UserDashboard = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(\`/api/users/\${userId}\`);
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="dashboard">
            <h1>Welcome, {userData.name}</h1>
            <div className="stats">
                <p>Tasks: {userData.taskCount}</p>
                <p>Completed: {userData.completedTasks}</p>
            </div>
        </div>
    );
};

export default UserDashboard;`,
            language: 'javascript',
            status: 'evaluating',
            createdAt: new Date('2024-12-18T14:20:00').toISOString(),
            updatedAt: new Date('2024-12-18T14:25:00').toISOString(),
        },
        {
            userId: 'test-user-2',
            title: 'RESTful API Endpoint with Error Handling',
            description: 'Implement a robust Express.js API endpoint with proper validation, error handling, and response formatting.',
            codeContent: `import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    age: z.number().min(18).max(120),
});

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = userSchema.parse(req.body);
        
        const newUser = await db.users.create({
            data: validatedData,
        });
        
        return res.status(201).json({
            success: true,
            data: newUser,
            message: 'User created successfully',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                errors: error.errors,
            });
        }
        next(error);
    }
};`,
            language: 'typescript',
            status: 'completed',
            createdAt: new Date('2024-12-10T09:15:00').toISOString(),
            updatedAt: new Date('2024-12-10T09:30:00').toISOString(),
        },
        {
            userId: 'test-user-2',
            title: 'Data Structure: Linked List Implementation',
            description: 'Implement a complete singly linked list with insertion, deletion, and traversal operations in Java.',
            codeContent: `public class LinkedList {
    private Node head;
    
    private class Node {
        int data;
        Node next;
        
        Node(int data) {
            this.data = data;
            this.next = null;
        }
    }
    
    public void insertAtBeginning(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    
    public void insertAtEnd(int data) {
        Node newNode = new Node(data);
        
        if (head == null) {
            head = newNode;
            return;
        }
        
        Node current = head;
        while (current.next != null) {
            current = current.next;
        }
        current.next = newNode;
    }
    
    public void display() {
        Node current = head;
        while (current != null) {
            System.out.print(current.data + " -> ");
            current = current.next;
        }
        System.out.println("null");
    }
}`,
            language: 'java',
            status: 'pending',
            createdAt: new Date('2024-12-20T16:45:00').toISOString(),
            updatedAt: new Date('2024-12-20T16:45:00').toISOString(),
        },
        {
            userId: 'test-user-1',
            title: 'Async Function with Promise Handling',
            description: 'Create an async function that handles multiple API calls with proper error handling and Promise.all optimization.',
            codeContent: `async function fetchUserDataWithPosts(userId) {
    try {
        const [user, posts, comments] = await Promise.all([
            fetch(\`/api/users/\${userId}\`).then(res => res.json()),
            fetch(\`/api/users/\${userId}/posts\`).then(res => res.json()),
            fetch(\`/api/users/\${userId}/comments\`).then(res => res.json())
        ]);
        
        return {
            user,
            posts,
            comments,
            metadata: {
                totalPosts: posts.length,
                totalComments: comments.length,
                joinedDate: user.createdAt
            }
        };
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
    }
}

// Usage with error handling
fetchUserDataWithPosts(123)
    .then(data => console.log('User data:', data))
    .catch(error => console.error('Error:', error.message));`,
            language: 'javascript',
            status: 'completed',
            createdAt: new Date('2024-12-12T11:00:00').toISOString(),
            updatedAt: new Date('2024-12-12T11:20:00').toISOString(),
        },
        {
            userId: 'test-user-2',
            title: 'Database Query Optimization',
            description: 'Optimize a complex database query using proper indexing, joins, and query planning in Python with SQLAlchemy.',
            codeContent: `from sqlalchemy import select, and_, or_
from sqlalchemy.orm import joinedload, selectinload
from models import User, Post, Comment

async def get_users_with_activity(db_session, min_posts=5):
    # Optimized query with eager loading and proper indexing
    query = (
        select(User)
        .options(
            selectinload(User.posts).selectinload(Post.comments),
            joinedload(User.profile)
        )
        .join(Post)
        .group_by(User.id)
        .having(func.count(Post.id) >= min_posts)
        .filter(
            and_(
                User.is_active == True,
                User.created_at >= datetime.now() - timedelta(days=365)
            )
        )
        .order_by(User.created_at.desc())
        .limit(100)
    )
    
    result = await db_session.execute(query)
    users = result.unique().scalars().all()
    
    return users`,
            language: 'python',
            status: 'evaluating',
            createdAt: new Date('2024-12-19T13:30:00').toISOString(),
            updatedAt: new Date('2024-12-19T13:35:00').toISOString(),
        },
        {
            userId: 'test-user-3',
            title: 'Authentication Middleware',
            description: 'Build a secure authentication middleware with JWT verification, role-based access control, and request validation.',
            codeContent: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token required',
            });
        }
        
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JWTPayload;
        
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions',
            });
        }
        next();
    };
};`,
            language: 'typescript',
            status: 'pending',
            createdAt: new Date('2024-12-21T08:00:00').toISOString(),
            updatedAt: new Date('2024-12-21T08:00:00').toISOString(),
        },
        {
            userId: 'test-user-3',
            title: 'Array Manipulation Function',
            description: 'Write a function to manipulate arrays with filtering, mapping, and reducing operations.',
            codeContent: `function processUserData(users) {
    const result = users
        .filter(user => user.age >= 18)
        .map(user => {
            return {
                id: user.id
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email
            };
        })
        .reduce((acc, user) => {
            acc[user.id] = user
            return acc;
        }, {});
    
    return result
}

const users = [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 25, email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 17, email: 'jane@example.com' }
];

console.log(processUserData(users));`,
            language: 'javascript',
            status: 'failed',
            createdAt: new Date('2024-12-17T15:00:00').toISOString(),
            updatedAt: new Date('2024-12-17T15:10:00').toISOString(),
        },
    ];

    await db.insert(tasks).values(sampleTasks);
    
    console.log('✅ Tasks seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});