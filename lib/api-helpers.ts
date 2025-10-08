import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Get authenticated user from session
 */
export async function getAuthUser(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new ApiError(401, 'Unauthorized');
  }
  return session.user;
}

/**
 * Require specific role(s)
 */
export async function requireRole(req: NextRequest, roles: string[]) {
  const user = await getAuthUser(req);
  if (!roles.includes(user.role || '')) {
    throw new ApiError(403, 'Forbidden: Insufficient permissions');
  }
  return user;
}

/**
 * Error handler wrapper for API routes
 */
export function apiHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error: any) {
      console.error('API Error:', error);

      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.errors },
          { status: 400 }
        );
      }

      // Default error
      return NextResponse.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Success response helper
 */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}