# Live Chat Widget API Reference

This document provides details about the API endpoints available for the Live Chat Widget, which is powered by Cloudflare Workers.

## Common Headers

All API responses include the following CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
Error responses will typically have a `Content-Type: application/json` header.

---

## Endpoints

### 1. Get Widget JavaScript

Serves the main JavaScript file required to embed and initialize the chat widget.

- **Method:** `GET`
- **Path:** `/widget.js`
- **Response:**
    - `Content-Type: application/javascript`
    - The widget's JavaScript code.

### 2. Get Widget Iframe HTML

Serves the HTML content for the chat widget's iframe. This is typically loaded by `widget.js`.

- **Method:** `GET`
- **Path:** `/widget-iframe`
- **Query Parameters (Optional, for theming):**
    - `theme`: The base theme mode (`light` or `dark`).
    - `primary-color`: Main accent color.
    - `on-primary`: Text color on primary backgrounds.
    - `background`: Chat window background color.
    - `text-color`: General text color.
    - `border-radius`: Border radius for chat bubbles and inputs.
    - `font-family`: The font family to be used in the widget.
    - *...and other inferred or explicitly set CSS variable values.*
- **Response:**
    - `Content-Type: text/html`
    - The HTML structure for the chat interface, styled with the provided parameters.

### 3. Chat Interaction

Handles sending user messages to the AI and receiving responses. This endpoint also intelligently integrates Wikipedia information and applies rate limiting.

- **Method:** `POST`
- **Path:** `/api/chat`
- **Request Body:**
    - `Content-Type: application/json`
    ```json
    {
      "message": "Your message to the AI.",
      "history": [
        {"role": "user", "content": "Previous user message"},
        {"role": "assistant", "content": "Previous AI response"}
      ]
    }
    ```
    - `message` (string, required): The current message from the user.
    - `history` (array, optional): An array of previous messages in the conversation, alternating between "user" and "assistant" roles. The history is trimmed to the last 10 messages (5 exchanges) to manage context length.
- **Behavior:**
    - **Wikipedia Integration:** If the `message` contains patterns suggesting a factual query (e.g., "what is", "who is"), the system may query Wikipedia and inject relevant information into the AI's context.
    - **Rate Limiting:** This endpoint is subject to rate limiting. See the [Rate Limiting](#rate-limiting) section for details.
- **Response (Success - 200 OK):**
    - `Content-Type: application/json`
    ```json
    {
      "response": "AI's response text."
    }
    ```
- **Response (Error - e.g., 400 Bad Request, 429 Too Many Requests, 500 Internal Server Error):**
    - `Content-Type: application/json`
    ```json
    {
      "error": "Description of the error."
    }
    ```
    - A `429 Too Many Requests` status will be returned if the rate limit is exceeded, with a `Retry-After` header indicating when to retry.

### 4. Get Cache Statistics (Debugging)

Provides statistics about the in-memory (LRU) cache.

- **Method:** `GET`
- **Path:** `/api/cache-stats`
- **Response (Success - 200 OK):**
    - `Content-Type: application/json`
    ```json
    {
      "memoryCache": {
        "size": 0, // Number of items currently in the cache
        // Note: The properties below reflect the cache's configuration.
        // If in weighted mode (current default):
        "currentWeight": 0, // Current total weight of items in cache
        "maxWeight": 10485760, // Configured maximum total weight (e.g., 10MB)
        "isWeightedMode": true,
        // If in item count mode:
        // "maxSize": 50 // Configured maximum number of items
      }
    }
    ```
    *(The exact fields for `maxSize`/`maxWeight` in the response depend on the cache's current operational mode. The example shows both for clarity, but only relevant ones will appear. The current `memoryCache` instance is weighted.)*

---

*This API documentation is subject to change. Please refer to the source code for the most up-to-date details.*

---

## Rate Limiting

To ensure fair usage and prevent abuse, the `/api/chat` endpoint is subject to rate limiting.

- **Mechanism:** Rate limiting is applied based on the client's IP address (extracted from `CF-Connecting-IP` header).
- **Limit:** Each unique IP address is allowed a maximum of **100 requests per minute**.
- **Response on Exceeding Limit:** If the rate limit is exceeded, the API will return a `429 Too Many Requests` HTTP status code with a `Content-Type: application/json` body containing an error message, and a `Retry-After` header indicating the number of seconds to wait before making another request.
- **Implementation:** The rate limiting counter is stored in a Cloudflare KV namespace (`RATE_LIMITER_KV`) for persistence across Worker instances. 