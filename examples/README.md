# Examples Directory

This directory contains code examples that demonstrate patterns and best practices for building Pydantic AI multi-agent systems. These examples serve as templates for the Context Engineering workflow.

## Structure

- `cli.py` - CLI implementation pattern with streaming responses and tool visibility
- `agent/` - Agent architecture patterns
  - `agent.py` - Agent creation pattern with dependency injection
  - `tools.py` - Tool implementation pattern for external API integrations
  - `providers.py` - Multi-provider LLM configuration pattern
- `tests/` - Testing patterns
  - `test_agent.py` - Unit test patterns for agents
  - `conftest.py` - Pytest configuration and fixtures

## Usage

These examples are referenced by the PRP generation system to understand:

1. **Code Structure Patterns** - How to organize modules and imports
2. **Testing Patterns** - Test file structure and mocking approaches
3. **Integration Patterns** - API client implementations and authentication flows
4. **CLI Patterns** - Argument parsing, output formatting, and error handling

## Important Notes

- These are **pattern examples** - don't copy directly, adapt to your specific use case
- Focus on the architectural patterns and conventions shown
- Pay attention to async/await usage throughout
- Note the dependency injection patterns used with Pydantic AI
- Observe error handling and validation approaches

## Key Patterns Demonstrated

### Agent Creation
- Using `Agent` class with proper type hints
- Dependency injection with `deps_type`
- Tool registration with `@agent.tool` decorator

### Multi-Provider Support
- Abstract provider interface
- Environment-based provider selection
- Consistent API across different LLM providers

### CLI Design
- Streaming response handling
- Color-coded output for better UX
- Tool execution visibility
- Proper async handling in CLI context

### Testing
- Mocking external API calls
- Testing async agent functions
- Fixture patterns for test data
- Error case coverage
