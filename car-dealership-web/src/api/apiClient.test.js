import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiClient, { setToken } from './apiClient';
import { server } from '../test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('apiClient', () => {
  beforeEach(() => {
    // Reset the in-memory token before each test
    setToken(null);
  });

  it('should attach Authorization header if token exists', async () => {
    // We create a temporary MSW handler just for this test to inspect the headers
    let capturedHeader = null;
    server.use(
      http.get('http://localhost:8080/api/test-auth', ({ request }) => {
        capturedHeader = request.headers.get('Authorization');
        return HttpResponse.json({ success: true });
      })
    );

    setToken('fake-jwt-token');
    
    await apiClient.get('/test-auth');
    
    expect(capturedHeader).toBe('Bearer fake-jwt-token');
  });

  it('should not attach Authorization header if token does not exist', async () => {
    let capturedHeader = null;
    server.use(
      http.get('http://localhost:8080/api/test-auth', ({ request }) => {
        capturedHeader = request.headers.get('Authorization');
        return HttpResponse.json({ success: true });
      })
    );

    await apiClient.get('/test-auth');
    
    expect(capturedHeader).toBeNull();
  });
});
