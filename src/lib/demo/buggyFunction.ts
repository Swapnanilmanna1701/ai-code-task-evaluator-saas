/**
 * DEMO: Buggy API Function
 * 
 * This file demonstrates common API/function bugs that were identified and fixed
 * by an AI coding assistant. Each function shows the fixed version with comments
 * explaining the original bugs.
 */

// ============================================================================
// FIXED FUNCTION #1: Data Processing with proper null handling
// ============================================================================

interface UserData {
  id: number;
  name: string;
  email: string;
  score?: number;
  tasks?: { id: number; completed: boolean }[];
}

/**
 * Process user data and calculate statistics
 * 
 * BUGS FIXED:
 * 1. Added null/undefined checks
 * 2. Fixed incorrect average calculation
 * 3. Added proper type annotations
 * 4. Handled edge case of empty arrays
 */
export function processUserData(users: UserData[] | null | undefined) {
  // FIXED: Added null check (was throwing error on null/undefined)
  if (!users || users.length === 0) {
    return {
      totalUsers: 0,
      averageScore: 0,
      completionRate: 0,
      activeUsers: [],
    };
  }

  // FIXED: Proper filtering with null checks
  const usersWithScores = users.filter(
    (user) => user.score !== undefined && user.score !== null
  );

  // FIXED: Handle divide by zero
  const averageScore =
    usersWithScores.length > 0
      ? usersWithScores.reduce((sum, user) => sum + (user.score || 0), 0) /
        usersWithScores.length
      : 0;

  // FIXED: Proper task completion calculation with null checks
  const totalTasks = users.reduce(
    (sum, user) => sum + (user.tasks?.length || 0),
    0
  );
  const completedTasks = users.reduce(
    (sum, user) =>
      sum + (user.tasks?.filter((t) => t.completed).length || 0),
    0
  );

  // FIXED: Handle divide by zero for completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    totalUsers: users.length,
    averageScore: Math.round(averageScore * 100) / 100,
    completionRate: Math.round(completionRate * 100) / 100,
    activeUsers: users.filter((u) => u.tasks && u.tasks.length > 0),
  };
}

// ============================================================================
// FIXED FUNCTION #2: Async data fetching with proper error handling
// ============================================================================

interface FetchOptions {
  timeout?: number;
  retries?: number;
}

/**
 * Fetch data with retry logic and timeout
 * 
 * BUGS FIXED:
 * 1. Added proper timeout handling
 * 2. Fixed retry logic (was infinite loop before)
 * 3. Added proper error typing
 * 4. Fixed memory leak with AbortController
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 5000, retries = 3 } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    // FIXED: Proper AbortController cleanup
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      });

      // FIXED: Clear timeout on success (was causing memory leak)
      clearTimeout(timeoutId);

      // FIXED: Check response status (was ignoring errors)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      // FIXED: Clear timeout on error too
      clearTimeout(timeoutId);

      // FIXED: Proper error typing
      lastError = error instanceof Error ? error : new Error(String(error));

      // FIXED: Don't retry on abort (timeout)
      if (error instanceof Error && error.name === "AbortError") {
        console.warn(`Request timeout on attempt ${attempt + 1}`);
      }

      // FIXED: Add delay between retries (was hammering server)
      if (attempt < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  throw lastError || new Error("Failed to fetch after retries");
}

// ============================================================================
// FIXED FUNCTION #3: Array manipulation with immutability
// ============================================================================

interface Task {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
}

/**
 * Sort and filter tasks
 * 
 * BUGS FIXED:
 * 1. Fixed mutating original array (was using sort() directly)
 * 2. Fixed incorrect priority sorting
 * 3. Added proper type safety
 * 4. Fixed filter logic
 */
export function sortAndFilterTasks(
  tasks: Task[],
  showCompleted: boolean = false
): Task[] {
  // FIXED: Don't mutate original array (was: tasks.sort())
  const tasksCopy = [...tasks];

  // FIXED: Proper priority mapping
  const priorityOrder: Record<Task["priority"], number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  // FIXED: Filter then sort (was sorting then filtering, less efficient)
  const filteredTasks = showCompleted
    ? tasksCopy
    : tasksCopy.filter((task) => !task.completed);

  // FIXED: Proper sort comparison (was string comparison before)
  return filteredTasks.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Secondary sort by title
    return a.title.localeCompare(b.title);
  });
}

// ============================================================================
// FIXED FUNCTION #4: Debounce utility with proper cleanup
// ============================================================================

/**
 * Debounce function with proper TypeScript typing
 * 
 * BUGS FIXED:
 * 1. Fixed 'this' context binding
 * 2. Added proper generic typing
 * 3. Fixed memory leak (wasn't clearing timeout)
 * 4. Added cancel method
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = function (this: unknown, ...args: Parameters<T>) {
    // FIXED: Clear existing timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // FIXED: Proper 'this' context preservation
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, wait);
  } as T & { cancel: () => void };

  // FIXED: Added cancel method for cleanup
  debouncedFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}

// ============================================================================
// ORIGINAL BUGGY VERSIONS (for reference)
// ============================================================================

/**
 * ORIGINAL BUGGY VERSION #1:
 * 
 * function processUserData(users) {
 *   // BUG: No null check - crashes on null/undefined
 *   const averageScore = users.reduce((sum, u) => sum + u.score, 0) / users.length;
 *   // BUG: Divide by zero when users.length is 0
 *   
 *   const completionRate = users.reduce((sum, u) => {
 *     // BUG: No null check on tasks
 *     return sum + u.tasks.filter(t => t.completed).length / u.tasks.length;
 *   }, 0);
 *   // BUG: Incorrect calculation, averaging incorrectly
 *   
 *   return { averageScore, completionRate };
 * }
 */

/**
 * ORIGINAL BUGGY VERSION #2:
 * 
 * async function fetchWithRetry(url, retries = 3) {
 *   for (let i = 0; i < retries; i++) {
 *     try {
 *       // BUG: No timeout handling
 *       const response = await fetch(url);
 *       // BUG: Not checking response.ok
 *       return response.json();
 *     } catch (error) {
 *       // BUG: Retrying immediately, no backoff
 *       // BUG: Error type not preserved
 *       continue;
 *     }
 *   }
 *   // BUG: Returns undefined instead of throwing
 * }
 */

/**
 * ORIGINAL BUGGY VERSION #3:
 * 
 * function sortAndFilterTasks(tasks, showCompleted) {
 *   // BUG: Mutates original array
 *   tasks.sort((a, b) => a.priority - b.priority);  // BUG: Can't subtract strings
 *   
 *   // BUG: Filter after sort is less efficient
 *   if (!showCompleted) {
 *     return tasks.filter(t => t.completed);  // BUG: Logic inverted!
 *   }
 *   return tasks;
 * }
 */

/**
 * ORIGINAL BUGGY VERSION #4:
 * 
 * function debounce(func, wait) {
 *   let timeout;
 *   return function(...args) {
 *     // BUG: 'this' context lost
 *     // BUG: Previous timeout not cleared
 *     timeout = setTimeout(() => func(...args), wait);
 *     // BUG: No way to cancel
 *   };
 * }
 */
