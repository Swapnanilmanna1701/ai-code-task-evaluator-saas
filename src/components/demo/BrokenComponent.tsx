"use client";

/**
 * DEMO: Broken UI Component
 * 
 * This component has intentional bugs that demonstrate the AI coding assistant's
 * ability to fix issues:
 * 
 * BUGS FIXED:
 * 1. Missing "use client" directive (fixed)
 * 2. Missing key prop in list items (fixed)
 * 3. Incorrect state update pattern (fixed)
 * 4. Missing null check causing potential crash (fixed)
 * 5. Incorrect event handler binding (fixed)
 * 
 * ORIGINAL BROKEN VERSION (commented out below):
 */

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: number;
  name: string;
  status: "active" | "inactive";
}

// FIXED VERSION
export function BrokenComponent() {
  const [items, setItems] = useState<Item[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulated API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setItems([
          { id: 1, name: "Task Alpha", status: "active" },
          { id: 2, name: "Task Beta", status: "inactive" },
          { id: 3, name: "Task Gamma", status: "active" },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // FIXED: Correct state update pattern using functional update
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1);
  };

  // FIXED: Proper toggle with correct state update
  const toggleStatus = (id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Demo Component (Fixed)
          <Badge variant="outline">Count: {count}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* FIXED: Added key prop to list items */}
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <span>{item.name}</span>
                <Button
                  variant={item.status === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleStatus(item.id)}
                >
                  {item.status}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No items found</p>
          )}
          <Button onClick={incrementCount} className="w-full">
            Increment Counter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ORIGINAL BROKEN VERSION - DO NOT USE
 * 
 * This was the original buggy code that was fixed:
 * 
 * // Missing "use client" directive - BUG #1
 * 
 * import { useState, useEffect } from "react";
 * 
 * export function BrokenComponent() {
 *   const [items, setItems] = useState([]);
 *   const [count, setCount] = useState(0);
 * 
 *   useEffect(() => {
 *     // Missing error handling - BUG #2
 *     fetch('/api/items').then(res => res.json()).then(setItems);
 *   }, []);
 * 
 *   // BUG #3: Incorrect state update, not using functional update
 *   const incrementCount = () => {
 *     setCount(count + 1);  // Should be: setCount(prev => prev + 1)
 *   };
 * 
 *   // BUG #4: Mutating state directly
 *   const toggleStatus = (id) => {
 *     const item = items.find(i => i.id === id);
 *     item.status = item.status === 'active' ? 'inactive' : 'active';  // Direct mutation!
 *     setItems(items);  // Won't trigger re-render
 *   };
 * 
 *   return (
 *     <div>
 *       // BUG #5: Missing key prop
 *       {items.map((item) => (
 *         <div>  // Should have key={item.id}
 *           <span>{item.name}</span>
 *           // BUG #6: Missing null check - will crash if items is undefined
 *           <button onClick={toggleStatus(item.id)}>{item.status}</button>  // Wrong! This calls immediately
 *         </div>
 *       ))}
 *       <button onClick={incrementCount}>Count: {count}</button>
 *     </div>
 *   );
 * }
 */

export default BrokenComponent;
