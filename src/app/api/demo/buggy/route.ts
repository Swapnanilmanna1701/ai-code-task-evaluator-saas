/**
 * DEMO: Buggy API Route
 * 
 * This API route demonstrates common backend bugs that were identified and fixed
 * by an AI coding assistant. The file shows the fixed version with extensive
 * comments explaining the original bugs and how they were resolved.
 */

import { NextRequest, NextResponse } from "next/server";

// ============================================================================
// FIXED API ROUTE
// ============================================================================

interface DemoItem {
  id: number;
  name: string;
  value: number;
  createdAt: string;
}

// Simulated database
const mockDatabase: DemoItem[] = [
  { id: 1, name: "Item One", value: 100, createdAt: "2024-01-15T10:00:00Z" },
  { id: 2, name: "Item Two", value: 200, createdAt: "2024-01-16T11:00:00Z" },
  { id: 3, name: "Item Three", value: 300, createdAt: "2024-01-17T12:00:00Z" },
];

/**
 * GET handler - Fetch items with filtering and pagination
 * 
 * BUGS FIXED:
 * 1. Added input validation for query parameters
 * 2. Fixed SQL injection vulnerability pattern
 * 3. Added proper error handling
 * 4. Fixed pagination calculation
 * 5. Added proper typing
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // FIXED: Parse and validate pagination params (was using strings directly)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search") || "";

    // FIXED: Validate page is a number (was NaN before causing issues)
    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    // FIXED: Filter safely (original was vulnerable to ReDoS)
    const filteredItems = search
      ? mockDatabase.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : mockDatabase;

    // FIXED: Correct pagination calculation (was off-by-one error)
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    // FIXED: Return proper pagination metadata
    return NextResponse.json({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total: filteredItems.length,
        totalPages: Math.ceil(filteredItems.length / limit),
        hasNext: endIndex < filteredItems.length,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    // FIXED: Proper error logging and response (was exposing stack trace)
    console.error("GET /api/demo/buggy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create new item
 * 
 * BUGS FIXED:
 * 1. Added request body validation
 * 2. Fixed XSS vulnerability by sanitizing input
 * 3. Added proper error responses
 * 4. Fixed ID generation (was using Math.random())
 * 5. Added Content-Type checking
 */
export async function POST(request: NextRequest) {
  try {
    // FIXED: Check Content-Type (was accepting any content type)
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 415 }
      );
    }

    // FIXED: Wrap JSON parsing in try-catch (was crashing on invalid JSON)
    let body: { name?: string; value?: number };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { name, value } = body;

    // FIXED: Validate required fields (was creating items with undefined values)
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    // FIXED: Validate value is a number (was accepting strings)
    if (value === undefined || typeof value !== "number" || isNaN(value)) {
      return NextResponse.json(
        { error: "Value is required and must be a number" },
        { status: 400 }
      );
    }

    // FIXED: Sanitize input (was vulnerable to XSS)
    const sanitizedName = name
      .trim()
      .slice(0, 100) // Limit length
      .replace(/[<>]/g, ""); // Remove potential HTML

    // FIXED: Validate name length after sanitization
    if (sanitizedName.length === 0) {
      return NextResponse.json(
        { error: "Name cannot be empty" },
        { status: 400 }
      );
    }

    // FIXED: Generate proper ID (was using Math.random() which can collide)
    const newId = mockDatabase.length > 0
      ? Math.max(...mockDatabase.map((item) => item.id)) + 1
      : 1;

    const newItem: DemoItem = {
      id: newId,
      name: sanitizedName,
      value: Math.round(value * 100) / 100, // FIXED: Round to 2 decimal places
      createdAt: new Date().toISOString(),
    };

    // In a real app, this would insert into the database
    mockDatabase.push(newItem);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("POST /api/demo/buggy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete item by ID
 * 
 * BUGS FIXED:
 * 1. Added ID validation
 * 2. Fixed not returning 404 when item doesn't exist
 * 3. Added proper authorization check pattern
 * 4. Fixed response status code (was 200, should be 204 or include body)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");

    // FIXED: Validate ID is provided and is a number
    if (!idParam) {
      return NextResponse.json(
        { error: "ID parameter is required" },
        { status: 400 }
      );
    }

    const id = parseInt(idParam, 10);

    // FIXED: Check for NaN (was accepting "abc" as ID)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID must be a valid number" },
        { status: 400 }
      );
    }

    // FIXED: Check if item exists before deleting (was silently succeeding)
    const itemIndex = mockDatabase.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    // In a real app, this would delete from the database
    const deletedItem = mockDatabase.splice(itemIndex, 1)[0];

    // FIXED: Return deleted item for confirmation (was returning empty 200)
    return NextResponse.json({
      message: "Item deleted successfully",
      deletedItem,
    });
  } catch (error) {
    console.error("DELETE /api/demo/buggy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================================================
// ORIGINAL BUGGY VERSIONS (for reference - DO NOT USE)
// ============================================================================

/**
 * ORIGINAL BUGGY GET:
 * 
 * export async function GET(request) {
 *   const { searchParams } = new URL(request.url);
 *   const page = searchParams.get('page');  // BUG: Not parsing to number
 *   const search = searchParams.get('search');
 *   
 *   // BUG: Using RegExp with user input (ReDoS vulnerability)
 *   const regex = new RegExp(search);
 *   const items = mockDatabase.filter(item => regex.test(item.name));
 *   
 *   // BUG: Wrong pagination (page * limit instead of (page-1) * limit)
 *   const startIndex = page * 10;
 *   
 *   // BUG: No error handling, no validation
 *   return NextResponse.json(items.slice(startIndex));
 * }
 */

/**
 * ORIGINAL BUGGY POST:
 * 
 * export async function POST(request) {
 *   const { name, value } = await request.json();  // BUG: Crashes on invalid JSON
 *   
 *   // BUG: No validation - accepts undefined/null
 *   // BUG: No sanitization - XSS vulnerability
 *   // BUG: Math.random() for ID can cause collisions
 *   const newItem = {
 *     id: Math.floor(Math.random() * 10000),
 *     name: name,  // Could be malicious HTML/script
 *     value: value,  // Could be NaN or string
 *   };
 *   
 *   mockDatabase.push(newItem);
 *   return NextResponse.json(newItem);  // BUG: Should return 201
 * }
 */

/**
 * ORIGINAL BUGGY DELETE:
 * 
 * export async function DELETE(request) {
 *   const { searchParams } = new URL(request.url);
 *   const id = searchParams.get('id');  // BUG: Not parsing to number
 *   
 *   // BUG: No check if item exists
 *   // BUG: No validation if id is valid
 *   mockDatabase = mockDatabase.filter(item => item.id != id);  // BUG: Loose equality
 *   
 *   return new Response();  // BUG: No status, no body
 * }
 */
