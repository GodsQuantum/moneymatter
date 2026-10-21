import { standardOAuthTokenResponse } from './oauth-token-interop';

describe('Better Auth OAuth token response interoperability', () => {
  const sample = {
    access_token: 'synthetic-not-a-secret',
    refresh_token: 'synthetic-refresh',
    token_type: 'Bearer',
    expires_in: 72 * 3600,
    expires_at: 1793000000,
    scope: 'finance:read offline_access',
  };

  test('removes only the non-standard numeric expiry from authorization_code response', () => {
    const result = standardOAuthTokenResponse('/oauth2/token', sample);
    expect(result).toEqual({
      access_token: sample.access_token,
      refresh_token: sample.refresh_token,
      token_type: sample.token_type,
      expires_in: sample.expires_in,
      scope: sample.scope,
    });
    expect(sample.expires_at).toBe(1793000000);
  });

  test('handles refresh responses while preserving rotated refresh tokens', () => {
    const response = { ...sample, expires_in: 3600, refresh_token: 'new-refresh' };
    expect(standardOAuthTokenResponse('/oauth2/token', response)).toEqual({
      access_token: sample.access_token,
      refresh_token: 'new-refresh',
      token_type: 'Bearer',
      expires_in: 3600,
      scope: sample.scope,
    });
  });

  test('does not change other auth endpoints or error responses', () => {
    expect(standardOAuthTokenResponse('/oauth2/authorize', sample)).toBeNull();
    expect(standardOAuthTokenResponse('/oauth2/introspect', sample)).toBeNull();
    expect(standardOAuthTokenResponse('/oauth2/token', { error: 'invalid_grant' })).toBeNull();
    expect(standardOAuthTokenResponse('/oauth2/token', { ...sample, expires_at: undefined })).toBeNull();
    expect(standardOAuthTokenResponse('/oauth2/token', null)).toBeNull();
  });
});
