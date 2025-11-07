# Contributing to Live Chat Widget

Thank you for your interest in contributing to the Live Chat Widget! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Community](#community)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. By participating, you agree to:

- Be respectful and inclusive
- Focus on constructive feedback
- Accept responsibility for mistakes
- Show empathy towards other contributors
- Help create a positive community

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 16 or later
- npm or yarn
- Git
- A Cloudflare account (for testing with Workers)
- Basic knowledge of JavaScript/TypeScript

### First Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/live-chat-widget.git
   cd live-chat-widget
   ```
3. **Set up upstream remote:**
   ```bash
   git remote add upstream https://github.com/1999AZZAR/live-chat-widget.git
   ```
4. **Install dependencies:**
   ```bash
   npm install
   ```
5. **Set up development environment:**
   ```bash
   npm run dev
   ```

## Development Setup

### Local Development

The project supports two development modes:

#### Remote Mode (Recommended)
```bash
npm run dev
```
- Full Cloudflare integration
- AI and KV storage access
- End-to-end testing capabilities

#### Local Mode
```bash
npm run dev -- --local
```
- No external dependencies
- UI testing only
- Faster startup

### Environment Configuration

Create a `.env` file for local configuration:

```bash
# Copy from wrangler.toml bindings
# Add any local overrides here
```

### Testing Environment

Access local development:
- **Worker URL:** `http://127.0.0.1:8787`
- **Widget Script:** `http://127.0.0.1:8787/widget.js`
- **API Endpoints:** `http://127.0.0.1:8787/api/*`

## Development Workflow

### Branching Strategy

- **main:** Production-ready code
- **feature/xxx:** New features
- **bugfix/xxx:** Bug fixes
- **hotfix/xxx:** Critical fixes

### Commit Guidelines

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Examples:
```
feat(widget): add dark mode support
fix(api): resolve rate limiting bug
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test:**
   ```bash
   # Test locally
   npm run dev
   # Run tests if available
   npm test
   ```

3. **Update documentation:**
   - Update README.md for user-facing changes
   - Update API.md for API changes
   - Add code comments for complex logic

4. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat(widget): add new feature"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request:**
   - Use PR template
   - Provide clear description
   - Reference related issues
   - Request review from maintainers

## Code Style and Standards

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions for anonymous functions
- Use template literals for string interpolation
- Follow consistent naming conventions

### Code Formatting

```javascript
// Good
const handleMessage = async (message) => {
  if (!message || message.length === 0) {
    throw new Error('Message cannot be empty');
  }

  const response = await processMessage(message);
  return formatResponse(response);
};

// Avoid
function handleMessage(message){if(!message||message.length===0){throw new Error('Message cannot be empty');}var response=await processMessage(message);return formatResponse(response);}
```

### File Structure

```
src/
├── index.js              # Main worker logic
├── systemInstruction.txt # AI configuration
├── widget-generator.js   # Widget script generation
├── iframe-generator.js   # UI generation
├── lru-handler.js        # Caching logic
└── crawl.txt            # Additional resources
```

### Error Handling

- Use specific error types
- Provide meaningful error messages
- Handle async errors properly
- Log errors for debugging

```javascript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error(`Operation failed: ${error.message}`);
}
```

### Security Considerations

- Validate all user inputs
- Use HTTPS for all external requests
- Implement proper rate limiting
- Avoid logging sensitive information
- Sanitize HTML content

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/          # Unit tests
├── integration/  # Integration tests
└── e2e/          # End-to-end tests
```

### Writing Tests

```javascript
// Example unit test
describe('Chat API', () => {
  test('should handle valid message', async () => {
    const response = await sendMessage('Hello');
    expect(response).toHaveProperty('response');
    expect(typeof response.response).toBe('string');
  });

  test('should reject empty message', async () => {
    await expect(sendMessage('')).rejects.toThrow('Message cannot be empty');
  });
});
```

### Testing Checklist

- [ ] Unit tests for new functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing
- [ ] Security testing

## Documentation

### Code Documentation

- Use JSDoc for function documentation
- Document parameters and return types
- Explain complex logic with comments
- Keep comments up to date

```javascript
/**
 * Processes a chat message and returns AI response
 * @param {string} message - The user's message
 * @param {Array} history - Previous conversation messages
 * @param {Object} options - Processing options
 * @returns {Promise<Object>} Response object with message and metadata
 */
async function processChatMessage(message, history = [], options = {}) {
  // Implementation
}
```

### Documentation Updates

When making changes:

1. **User-facing changes:** Update README.md
2. **API changes:** Update API.md
3. **New features:** Add examples and usage
4. **Breaking changes:** Update changelog

## Submitting Changes

### Pull Request Template

Use this template for pull requests:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Cross-browser testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
- [ ] No linting errors
- [ ] Ready for review

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks:** CI/CD runs tests and linting
2. **Peer Review:** At least one maintainer reviews code
3. **Feedback:** Address any review comments
4. **Approval:** Maintainers approve and merge
5. **Deployment:** Changes automatically deploy to production

## Reporting Issues

### Bug Reports

When reporting bugs, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details:**
  - Browser and version
  - Operating system
  - Node.js version
  - Project version
- **Screenshots or logs** if applicable
- **Minimal reproduction case**

### Feature Requests

For new features, provide:

- **Clear description** of the proposed feature
- **Use case** and problem it solves
- **Implementation suggestions** (optional)
- **Mockups or examples** (optional)

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation updates
- `question`: Questions or discussions
- `help wanted`: Good for newcomers
- `good first issue`: Simple tasks for beginners

## Community

### Getting Help

- **Documentation:** Check README.md and API.md first
- **Issues:** Search existing issues before creating new ones
- **Discussions:** Use GitHub Discussions for questions
- **Discord/Slack:** Join our community channels (if available)

### Recognition

Contributors are recognized through:

- **GitHub contributor statistics**
- **Changelog entries** for significant contributions
- **Credits in documentation** for major features
- **Social media mentions** for outstanding work

### Communication

- Be respectful and constructive
- Use clear, concise language
- Provide context for your questions
- Help others when possible

---

Thank you for contributing to the Live Chat Widget! Your contributions help make this project better for everyone.
