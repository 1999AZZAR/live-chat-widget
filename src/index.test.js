// @ts-ignore
import { SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
describe('Live Chat Widget Worker', () => {
    it('responds with running message on root', async () => {
        const response = await SELF.fetch('https://example.com/');
        expect(await response.text()).toBe('Live Chat Widget Worker is running!');
    });
    it('returns widget.js', async () => {
        const response = await SELF.fetch('https://example.com/widget.js');
        expect(response.headers.get('Content-Type')).toContain('application/javascript');
        const body = await response.text();
        expect(body).toContain('Live Chat Widget');
        expect(body).toContain('workerOrigin');
    });
    it('returns widget-iframe', async () => {
        const response = await SELF.fetch('https://example.com/widget-iframe');
        expect(response.headers.get('Content-Type')).toContain('text/html');
        const body = await response.text();
        expect(body).toContain('Chat with FREA');
    });
    it('handles cache-stats', async () => {
        const response = await SELF.fetch('https://example.com/api/cache-stats');
        expect(response.status).toBe(200);
        const stats = await response.json();
        expect(stats).toHaveProperty('size');
    });
    it('handles chat request when AI is missing', async () => {
        const response = await SELF.fetch('https://example.com/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: 'Hello' }),
            headers: { 'Content-Type': 'application/json' },
        });
        expect(response.status).toBe(200); // Code currently returns 200 with error message string
        const body = await response.json();
        expect(body.response).toContain('AI service is not properly configured');
    });
});
