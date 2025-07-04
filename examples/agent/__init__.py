"""
Agent package for Pydantic AI examples.

This package demonstrates patterns for building multi-agent systems
with Pydantic AI, including:

- Agent creation and configuration
- Tool implementation and integration
- Multi-provider LLM support
- Dependency injection patterns
"""

from .agent import (
    create_research_agent,
    create_agent_dependencies,
    run_research_agent_as_tool,
    AgentDependencies,
    ResearchQuery,
    ResearchResult
)

from .providers import (
    LLMProvider,
    LLMConfig,
    OpenAIProvider,
    AnthropicProvider,
    AzureOpenAIProvider,
    create_provider,
    get_provider_from_env
)

from .tools import (
    SearchTool,
    EmailTool,
    SearchResult,
    EmailDraft,
    create_search_tool,
    create_email_tool
)

__all__ = [
    # Agent components
    "create_research_agent",
    "create_agent_dependencies", 
    "run_research_agent_as_tool",
    "AgentDependencies",
    "ResearchQuery",
    "ResearchResult",
    
    # Provider components
    "LLMProvider",
    "LLMConfig",
    "OpenAIProvider",
    "AnthropicProvider", 
    "AzureOpenAIProvider",
    "create_provider",
    "get_provider_from_env",
    
    # Tool components
    "SearchTool",
    "EmailTool",
    "SearchResult",
    "EmailDraft",
    "create_search_tool",
    "create_email_tool"
]
