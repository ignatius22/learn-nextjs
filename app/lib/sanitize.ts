/**
 * Input sanitization utilities for security
 */

/**
 * Sanitize search input to prevent injection attacks
 * Removes potentially harmful characters while allowing reasonable search terms
 */
export function sanitizeSearchInput(input: string): string {
  if (!input) return '';

  // Trim and limit length
  let sanitized = input.trim().slice(0, 100);

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // Remove potentially dangerous SQL patterns (defense in depth)
  // Note: We use parameterized queries, but this adds an extra layer
  const dangerousPatterns = [
    /;.*--/gi,      // SQL comments
    /UNION.*SELECT/gi,
    /DROP.*TABLE/gi,
    /INSERT.*INTO/gi,
    /DELETE.*FROM/gi,
    /UPDATE.*SET/gi,
    /<script/gi,    // XSS prevention
    /javascript:/gi,
    /on\w+\s*=/gi,  // Event handlers
  ];

  dangerousPatterns.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';

  // Basic email sanitization
  let sanitized = email.trim().toLowerCase().slice(0, 254); // RFC 5321

  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>;"']/g, '');

  return sanitized;
}

/**
 * Validate and sanitize numeric ID
 */
export function sanitizeId(id: string): string {
  if (!id) return '';

  // UUIDs are safe, just validate format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (uuidRegex.test(id)) {
    return id.toLowerCase();
  }

  // If numeric ID, ensure only digits
  if (/^\d+$/.test(id)) {
    return id;
  }

  throw new Error('Invalid ID format');
}

/**
 * Sanitize string for general use (names, addresses, etc.)
 */
export function sanitizeString(input: string, maxLength: number = 255): string {
  if (!input) return '';

  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);

  // Remove null bytes and control characters
  sanitized = sanitized.replace(/[\0\x08\x0B\x0C\x0E-\x1F]/g, '');

  // Remove HTML tags and script content
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  return sanitized;
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const sanitized = url.trim();

  // Only allow http and https protocols
  try {
    const parsed = new URL(sanitized);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL');
  }
}
