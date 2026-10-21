/**
 * Better Auth's OAuth provider includes an extra numeric `expires_at` field
 * in token responses. The MCPProxy/mcp-go client decodes that optional field
 * as a JSON RFC3339 timestamp (Go time.Time), so the numeric extension causes
 * an otherwise successful authorization-code exchange to fail.
 *
 * RFC 6749 uses `expires_in` in seconds; removing the optional extension
 * makes the response interoperable without changing token lifetime/storage.
 * Apply ONLY to successful /oauth2/token responses (both initial and refresh).
 */
export function standardOAuthTokenResponse(path: string, payload: unknown): Record<string, unknown> | null {
  if (path !== '/oauth2/token' || !payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }
  const fields = payload as Record<string, unknown>;
  if (
    typeof fields.access_token !== 'string' ||
    typeof fields.token_type !== 'string' ||
    typeof fields.expires_in !== 'number' ||
    !Number.isFinite(fields.expires_in) ||
    typeof fields.expires_at !== 'number'
  ) {
    return null;
  }
  const result = { ...fields };
  delete result.expires_at;
  return result;
}
