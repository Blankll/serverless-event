import fetch from 'node-fetch';

export interface HttpClient {
  get: (path: string) => Promise<{ status: number; message: string; body: string }>;
}

export const loadHttpClient = (host: string): HttpClient => ({
  get: async (path: string) => {
    try {
      const res = await fetch(`${host}${path}`);
      const data = await res.json();
      if (!res.ok) {
        throw {
          message: 'failed to send http request',
          status: res.status,
          stack: JSON.stringify(data),
        };
      }
      return { status: res.status, message: data.message || res.statusText, body: data };
    } catch (err) {
      console.error(err, 'failed to send http request');
      throw err;
    }
  },
});
