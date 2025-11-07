# Live Chat Widget API Reference

This comprehensive API reference provides detailed documentation for integrating with the Live Chat Widget, a Cloudflare Workers-powered AI chat interface.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Common Headers](#common-headers)
- [Endpoints](#endpoints)
  - [Get Widget JavaScript](#1-get-widget-javascript)
  - [Get Widget Iframe HTML](#2-get-widget-iframe-html)
  - [Chat Interaction](#3-chat-interaction)
  - [Get Cache Statistics](#4-get-cache-statistics)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [SDK and Libraries](#sdk-and-libraries)
- [Examples](#examples)
- [Performance](#performance)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)

## Overview

The Live Chat Widget API provides programmatic access to AI-powered chat functionality. Built on Cloudflare Workers infrastructure, the API offers:

- **Real-time AI Responses:** Powered by Llama 3.1 language model
- **Wikipedia Integration:** Automatic factual information retrieval
- **Intelligent Caching:** Multi-layer caching for optimal performance
- **Rate Limiting:** Built-in protection against abuse
- **CORS Support:** Cross-origin resource sharing enabled
- **TypeScript Support:** Full type definitions available

### Base URL

```
https://your-worker-name.your-account.workers.dev
```

Replace `your-worker-name` and `your-account` with your actual Cloudflare Workers deployment details.

### API Versioning

The API uses URL-based versioning. Current version is v1 (implied in all endpoints).

### Content Types

- **Request:** `application/json`
- **Response:** `application/json` (except widget endpoints which return HTML/JavaScript)

## Authentication

The API currently operates without authentication for public widget access. However, consider these security measures:

### API Keys (Future)

For enterprise deployments, API key authentication may be implemented:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello"}' \
     https://your-worker.your-account.workers.dev/api/chat
```

### Rate Limiting

All endpoints are subject to rate limiting based on IP address and optional API keys.

## Common Headers

### Response Headers

All API responses include standard CORS headers for cross-origin requests:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 86400
```

### Request Headers

For authenticated requests (when implemented):

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-Client-Version: 1.0.0
```

### Rate Limiting Headers

When rate limits are approached or exceeded:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### Content Type Headers

- **JSON Requests:** `Content-Type: application/json`
- **Error Responses:** `Content-Type: application/json`
- **Widget Scripts:** `Content-Type: application/javascript`
- **Widget HTML:** `Content-Type: text/html`

## Endpoints

### 1. Get Widget JavaScript

Serves the main JavaScript file required to embed and initialize the chat widget on any website.

- **Method:** `GET`
- **Path:** `/widget.js`
- **Query Parameters:**
  - `v` (optional): Cache-busting version parameter
  - `theme` (optional): Force theme (`light`, `dark`, or `auto`)
  - `lang` (optional): Force language (`en`, `id`)

- **Response:**
  - **Status:** `200 OK`
  - **Content-Type:** `application/javascript`
  - **Cache-Control:** `no-cache, no-store, must-revalidate`
  - **Body:** Complete JavaScript code for widget initialization

#### Usage Examples

**Basic embedding:**
```html
<script src="https://your-worker.your-account.workers.dev/widget.js"></script>
```

**Force specific theme:**
```html
<script src="https://your-worker.your-account.workers.dev/widget.js?theme=dark"></script>
```

**Force specific language:**
```html
<script src="https://your-worker.your-account.workers.dev/widget.js?lang=id"></script>
```

#### Response Example

The endpoint returns a complete JavaScript file (typically 30-40KB) that includes:
- Widget initialization code
- Theme detection logic
- Chat interface management
- API communication functions

#### Error Responses

- **404 Not Found:** If the widget script is not available
- **500 Internal Server Error:** If there's a server-side issue generating the script

### 2. Get Widget Iframe HTML

Serves the HTML content for the chat widget's iframe interface. This endpoint is typically called automatically by the widget JavaScript but can be used directly for custom implementations.

- **Method:** `GET`
- **Path:** `/widget-iframe`
- **Query Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `theme` | string | Theme mode (`light`, `dark`, `auto`) | `auto` |
| `primary-color` | string | Main accent color (hex, rgb, hsl) | Auto-detected |
| `on-primary` | string | Text color on primary backgrounds | Auto-calculated |
| `background` | string | Chat window background color | Auto-detected |
| `text-color` | string | General text color | Auto-detected |
| `border-radius` | string | Border radius for elements (px, rem) | `12px` |
| `font-family` | string | Font family for widget text | System font |
| `lang` | string | Language code (`en`, `id`) | Auto-detected |

- **Response:**
  - **Status:** `200 OK`
  - **Content-Type:** `text/html`
  - **Cache-Control:** `no-cache, no-store, must-revalidate`
  - **Body:** Complete HTML interface for the chat widget

#### Advanced Theming Parameters

The iframe endpoint supports extensive theming through CSS custom properties:

```javascript
// Example URL with full theming
https://your-worker.your-account.workers.dev/widget-iframe?theme=dark&primary-color=%23007bff&background=%23121212&text-color=%23ffffff&border-radius=16px&font-family=Inter,sans-serif
```

#### Supported CSS Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `--primary-color` | Primary buttons and accents | `#007bff` |
| `--on-primary` | Text on primary backgrounds | `#ffffff` |
| `--background` | Chat window background | `#ffffff` |
| `--surface-color` | Cards and panels background | `rgba(255,255,255,0.9)` |
| `--text-color` | Primary text color | `#212529` |
| `--border-radius` | Corner radius | `12px` |
| `--font-family` | Font stack | `Inter, sans-serif` |
| `--shadow-color` | Shadow color | `rgba(0,0,0,0.1)` |

#### Usage Examples

**Basic iframe loading:**
```javascript
const iframe = document.createElement('iframe');
iframe.src = 'https://your-worker.your-account.workers.dev/widget-iframe';
iframe.style.border = 'none';
iframe.style.width = '400px';
iframe.style.height = '600px';
document.body.appendChild(iframe);
```

**Custom themed iframe:**
```javascript
const iframe = document.createElement('iframe');
iframe.src = 'https://your-worker.your-account.workers.dev/widget-iframe?' +
  new URLSearchParams({
    theme: 'dark',
    'primary-color': '#ff6b35',
    'background': '#1a1a1a',
    'text-color': '#ffffff',
    'border-radius': '16px'
  });
document.body.appendChild(iframe);
```

#### Response Structure

The HTML response includes:
- Chat message container
- Input field and send button
- Theme-aware styling
- Responsive design elements
- Accessibility attributes
- Error handling UI

#### Error Responses

- **400 Bad Request:** Invalid theme or color parameter format
- **404 Not Found:** If iframe template is not available
- **500 Internal Server Error:** Server-side rendering issues

### 3. Chat Interaction

The core endpoint for AI-powered chat interactions. Processes user messages through the Llama 3.1 language model with intelligent Wikipedia integration and response deduplication.

- **Method:** `POST`
- **Path:** `/api/chat`
- **Content-Type:** `application/json`

#### Request Schema

```json
{
  "message": "string (required)",
  "history": [
    {
      "role": "user|assistant",
      "content": "string"
    }
  ],
  "options": {
    "temperature": "number (optional, 0.0-1.0)",
    "max_tokens": "number (optional)",
    "disable_wikipedia": "boolean (optional)"
  }
}
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | The user's message to send to the AI |
| `history` | array | No | Previous conversation messages (max 10 messages) |
| `options.temperature` | number | No | AI creativity level (0.0-1.0, default: 0.7) |
| `options.max_tokens` | number | No | Maximum response length (default: 250) |
| `options.disable_wikipedia` | boolean | No | Disable Wikipedia integration (default: false) |

#### History Format

```json
[
  {"role": "user", "content": "Hello, how are you?"},
  {"role": "assistant", "content": "I'm doing well, thank you! How can I help you today?"},
  {"role": "user", "content": "What's the capital of France?"}
]
```

#### Behavior & Features

**AI Processing:**
- Messages are processed through Llama 3.1 model
- Context window maintains conversation history
- Response deduplication prevents repetitive answers
- Automatic language detection and response

**Wikipedia Integration:**
- Automatically detects factual queries ("what is", "who was", "when did", etc.)
- Queries Wikipedia API for accurate information
- Integrates facts seamlessly into AI responses
- Can be disabled per request with `disable_wikipedia: true`

**Rate Limiting:**
- IP-based limiting (100 requests/minute)
- Customer-based limiting for API keys (30 requests/minute)
- Exponential backoff for retries

**Caching:**
- Multi-layer caching (memory + KV storage)
- Intelligent cache key generation
- Automatic cache invalidation

#### Response Schema

**Success Response (200 OK):**
```json
{
  "response": "string",
  "metadata": {
    "wikipedia_used": "boolean",
    "cached": "boolean",
    "tokens_used": "number",
    "processing_time_ms": "number"
  }
}
```

**Error Response:**
```json
{
  "error": "string",
  "code": "string",
  "retry_after": "number (optional)"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `response` | string | The AI-generated response |
| `metadata.wikipedia_used` | boolean | Whether Wikipedia was queried |
| `metadata.cached` | boolean | Whether response came from cache |
| `metadata.tokens_used` | number | AI tokens consumed |
| `metadata.processing_time_ms` | number | Processing time in milliseconds |

#### Usage Examples

**Basic chat request:**
```bash
curl -X POST https://your-worker.your-account.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

**Request with conversation history:**
```bash
curl -X POST https://your-worker.your-account.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is machine learning?",
    "history": [
      {"role": "user", "content": "Hello"},
      {"role": "assistant", "content": "Hello! How can I help you today?"}
    ]
  }'
```

**Request with custom options:**
```bash
curl -X POST https://your-worker.your-account.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me a creative story",
    "options": {
      "temperature": 0.9,
      "max_tokens": 500,
      "disable_wikipedia": true
    }
  }'
```

#### JavaScript Example

```javascript
async function sendMessage(message, history = []) {
  const response = await fetch('https://your-worker.your-account.workers.dev/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      history: history,
      options: {
        temperature: 0.7,
        disable_wikipedia: false
      }
    })
  });

  const data = await response.json();

  if (response.ok) {
    return {
      success: true,
      response: data.response,
      metadata: data.metadata
    };
  } else {
    return {
      success: false,
      error: data.error,
      retryAfter: response.headers.get('Retry-After')
    };
  }
}

// Usage
const result = await sendMessage("What is the weather like today?", []);
console.log(result.response);
```

#### Error Codes

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 400 | `INVALID_REQUEST` | Malformed request or missing required fields |
| 401 | `UNAUTHORIZED` | Invalid or missing API key |
| 429 | `RATE_LIMITED` | Rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Server-side processing error |
| 502 | `AI_SERVICE_ERROR` | AI model service unavailable |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable |

#### Rate Limiting Response

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retry_after": 60
}
```

Headers included:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### 4. Get Cache Statistics (Debugging)

Provides detailed statistics about the caching system performance and usage. Useful for monitoring and optimization.

- **Method:** `GET`
- **Path:** `/api/cache-stats`
- **Authentication:** None (debug endpoint)

#### Response Schema

```json
{
  "memoryCache": {
    "size": "number",
    "currentWeight": "number",
    "maxWeight": "number",
    "isWeightedMode": "boolean",
    "hitRate": "number",
    "totalRequests": "number",
    "totalHits": "number"
  },
  "kvCache": {
    "size": "number",
    "hitRate": "number",
    "totalRequests": "number",
    "totalHits": "number"
  },
  "uptime": "number",
  "version": "string"
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `memoryCache.size` | number | Current number of items in memory cache |
| `memoryCache.currentWeight` | number | Current total weight of cached items (bytes) |
| `memoryCache.maxWeight` | number | Maximum allowed weight (default: 10MB) |
| `memoryCache.isWeightedMode` | boolean | Whether cache uses weighted mode |
| `memoryCache.hitRate` | number | Cache hit rate (0.0-1.0) |
| `memoryCache.totalRequests` | number | Total cache requests since startup |
| `memoryCache.totalHits` | number | Total cache hits since startup |
| `kvCache.size` | number | Current number of items in KV cache |
| `kvCache.hitRate` | number | KV cache hit rate |
| `kvCache.totalRequests` | number | Total KV cache requests |
| `kvCache.totalHits` | number | Total KV cache hits |
| `uptime` | number | Worker uptime in seconds |
| `version` | string | API version |

#### Usage Example

```bash
curl https://your-worker.your-account.workers.dev/api/cache-stats
```

#### Sample Response

```json
{
  "memoryCache": {
    "size": 45,
    "currentWeight": 245760,
    "maxWeight": 10485760,
    "isWeightedMode": true,
    "hitRate": 0.87,
    "totalRequests": 1520,
    "totalHits": 1322
  },
  "kvCache": {
    "size": 128,
    "hitRate": 0.92,
    "totalRequests": 890,
    "totalHits": 818
  },
  "uptime": 345600,
  "version": "1.0.0"
}
```

#### Error Responses

- **403 Forbidden:** If debug endpoints are disabled in production
- **500 Internal Server Error:** If cache system is unavailable

---

*This API documentation is subject to change. Please refer to the source code for the most up-to-date details.*

---

## Rate Limiting

To ensure fair usage and prevent abuse, the API implements multi-tier rate limiting.

### Limits by Endpoint

| Endpoint | IP Limit | API Key Limit | Window |
|----------|----------|---------------|--------|
| `POST /api/chat` | 100/min | 30/min | 1 minute |
| `GET /widget.js` | Unlimited | Unlimited | N/A |
| `GET /widget-iframe` | Unlimited | Unlimited | N/A |
| `GET /api/cache-stats` | 10/min | 10/min | 1 minute |

### Rate Limiting Headers

When rate limits are active, these headers are included:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### Rate Limit Response

```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMITED",
  "retry_after": 60
}
```

### Implementation Details

- **IP-based limiting:** Uses `CF-Connecting-IP` header for client identification
- **KV storage:** Counters stored in Cloudflare KV for persistence across instances
- **Sliding window:** One-minute rolling windows prevent boundary attacks
- **Burst handling:** Short bursts above limits are allowed to prevent false positives

## Error Handling

The API provides comprehensive error handling with structured error responses and appropriate HTTP status codes.

### Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "error": "string",
  "code": "string",
  "details": "object (optional)",
  "retry_after": "number (optional)"
}
```

### Common Error Codes

| Status Code | Error Code | Description | Retryable |
|-------------|------------|-------------|-----------|
| 400 | `INVALID_REQUEST` | Malformed request or invalid parameters | No |
| 400 | `MISSING_REQUIRED_FIELD` | Required field is missing | No |
| 401 | `UNAUTHORIZED` | Invalid or missing authentication | No |
| 403 | `FORBIDDEN` | Access denied to resource | No |
| 404 | `NOT_FOUND` | Requested endpoint or resource not found | No |
| 405 | `METHOD_NOT_ALLOWED` | HTTP method not supported | No |
| 413 | `PAYLOAD_TOO_LARGE` | Request body exceeds size limit | No |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Content-Type not supported | No |
| 422 | `VALIDATION_ERROR` | Request validation failed | No |
| 429 | `RATE_LIMITED` | Rate limit exceeded | Yes |
| 500 | `INTERNAL_ERROR` | Unexpected server error | Yes |
| 502 | `AI_SERVICE_ERROR` | AI model service unavailable | Yes |
| 503 | `SERVICE_UNAVAILABLE` | Service temporarily unavailable | Yes |
| 504 | `TIMEOUT` | Request timed out | Yes |

## SDK and Libraries

### Official SDKs

**JavaScript/TypeScript SDK** (Coming Soon)
```javascript
import { LiveChatWidget } from '@live-chat-widget/sdk';

const client = new LiveChatWidget({
  baseURL: 'https://your-worker.your-account.workers.dev'
});

const response = await client.chat({
  message: 'Hello!',
  options: { temperature: 0.8 }
});
```

### Community Libraries

- **Python SDK:** `pip install live-chat-widget`
- **Go SDK:** `go get github.com/live-chat-widget/go-sdk`
- **PHP SDK:** `composer require live-chat-widget/php-sdk`

## Examples

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to my site!</h1>

    <!-- Live Chat Widget -->
    <script src="https://your-worker.your-account.workers.dev/widget.js"></script>
</body>
</html>
```

### Advanced JavaScript Integration

```javascript
class CustomChatWidget {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.history = [];
  }

  async sendMessage(message) {
    const response = await fetch(`${this.apiUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history: this.history.slice(-10)
      })
    });

    const data = await response.json();

    if (response.ok) {
      this.history.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      );
      return data.response;
    } else {
      throw new Error(data.error);
    }
  }
}
```

## Performance

### Response Times

Typical response times vary by request complexity:

- **Simple greetings:** 200-500ms
- **Basic questions:** 300-800ms
- **Complex queries with Wikipedia:** 800-2000ms
- **Creative writing tasks:** 1000-3000ms

### Caching Performance

The API implements multi-layer caching:

- **Memory Cache:** Sub-millisecond access for recent conversations
- **KV Cache:** Millisecond access for persistent storage
- **Cache Hit Rate:** Typically 70-90% for repeated queries

## Troubleshooting

### Common Issues

**Widget doesn't appear**
- Check browser console for JavaScript errors
- Verify script URL is accessible
- Clear browser cache and reload

**AI responses are slow**
- Check internet connection
- Verify not hitting rate limits
- Monitor cache statistics via `/api/cache-stats`

**Rate limiting errors**
- Implement exponential backoff
- Check `X-RateLimit-Remaining` header

### Debugging Tools

**Check API Health:**
```bash
curl -I https://your-worker.your-account.workers.dev/api/chat
```

**View Cache Performance:**
```bash
curl https://your-worker.your-account.workers.dev/api/cache-stats
```

## Changelog

### Version 1.0.0 (Current)

**Released:** January 2025

**Features:**
- AI-powered chat with Llama 3.1 integration
- Wikipedia knowledge integration
- Intelligent response deduplication
- Multi-layer caching system
- Rate limiting protection
- Theming and customization options

**API Endpoints:**
- `GET /widget.js` - Widget JavaScript
- `GET /widget-iframe` - Chat interface HTML
- `POST /api/chat` - Chat interactions
- `GET /api/cache-stats` - Cache statistics

---

*This API documentation is maintained alongside the codebase. For the latest updates, please refer to the source repository.* 