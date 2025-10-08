import connectDB from './db';
import RateLimit from '@/models/RateLimit';

/**
 * Check if user has exceeded rate limit
 * @param userId - User ID
 * @param action - Action type (e.g., 'contact_request')
 * @param limit - Max number of actions allowed
 * @param windowMs - Time window in milliseconds
 */
export async function checkRateLimit(
  userId: string,
  action: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  await connectDB();

  const windowStart = new Date(Date.now() - windowMs);

  // Count actions in the current window
  const count = await RateLimit.countDocuments({
    userId,
    action,
    createdAt: { $gte: windowStart },
  });

  const allowed = count < limit;
  const remaining = Math.max(0, limit - count);

  if (allowed) {
    // Record this action
    await RateLimit.create({ userId, action });
  }

  const resetAt = new Date(Date.now() + windowMs);

  return { allowed, remaining, resetAt };
}

/**
 * Get remaining requests for a user
 */
export async function getRateLimitStatus(
  userId: string,
  action: string,
  limit: number,
  windowMs: number
) {
  await connectDB();

  const windowStart = new Date(Date.now() - windowMs);
  const count = await RateLimit.countDocuments({
    userId,
    action,
    createdAt: { $gte: windowStart },
  });

  return {
    used: count,
    remaining: Math.max(0, limit - count),
    limit,
    resetAt: new Date(Date.now() + windowMs),
  };
}