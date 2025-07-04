"""
Agent creation pattern for Pydantic AI.

This example demonstrates:
- Agent creation with proper type hints
- Dependency injection with deps_type
- Tool registration with @agent.tool decorator
- Multi-agent patterns (agent-as-tool)
- Proper async handling throughout
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.models import Model

from .providers import LLMProvider
from .tools import SearchTool, EmailTool


class AgentDependencies(BaseModel):
    """Dependencies injected into agent context."""
    search_tool: SearchTool
    email_tool: Optional[EmailTool] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class ResearchQuery(BaseModel):
    """Structured input for research queries."""
    query: str = Field(..., description="The research topic to investigate")
    max_results: int = Field(10, ge=1, le=50, description="Maximum number of results")
    include_summary: bool = Field(True, description="Whether to include a summary")


class ResearchResult(BaseModel):
    """Structured output from research agent."""
    query: str
    results: List[Dict[str, Any]]
    summary: Optional[str] = None
    sources_count: int
    confidence_score: float = Field(ge=0.0, le=1.0)


# Create the research agent with dependency injection
research_agent = Agent(
    model=None,  # Will be set when creating agent instance
    deps_type=AgentDependencies,
    result_type=ResearchResult,
    system_prompt="""
    You are a research assistant that helps users find comprehensive information on topics.
    
    Your capabilities:
    - Search for information using the search tool
    - Create email drafts when requested
    - Provide structured, well-sourced responses
    
    Always:
    - Use the search tool to gather current information
    - Cite your sources clearly
    - Provide confidence scores for your findings
    - Ask clarifying questions when the query is ambiguous
    """,
)


@research_agent.tool
async def search_information(
    ctx: RunContext[AgentDependencies], 
    query: str, 
    max_results: int = 10
) -> str:
    """Search for information on a given topic."""
    search_tool = ctx.deps.search_tool
    
    try:
        results = await search_tool.search(query, max_results=max_results)
        
        # Format results for the agent
        formatted_results = []
        for i, result in enumerate(results, 1):
            formatted_results.append(
                f"{i}. **{result.get('title', 'No title')}**\n"
                f"   URL: {result.get('url', 'No URL')}\n"
                f"   Summary: {result.get('description', 'No description')}\n"
            )
        
        return "\n".join(formatted_results)
    
    except Exception as e:
        return f"Search failed: {str(e)}"


@research_agent.tool
async def create_email_draft(
    ctx: RunContext[AgentDependencies],
    recipient: str,
    subject: str,
    content: str,
    cc: Optional[List[str]] = None
) -> str:
    """Create an email draft based on research findings."""
    email_tool = ctx.deps.email_tool
    
    if not email_tool:
        return "Email functionality not available - no email tool configured"
    
    try:
        draft_id = await email_tool.create_draft(
            to=[recipient],
            subject=subject,
            body=content,
            cc=cc or []
        )
        
        return f"Email draft created successfully with ID: {draft_id}"
    
    except Exception as e:
        return f"Failed to create email draft: {str(e)}"


def create_research_agent(
    llm_provider: LLMProvider,
    search_tool: SearchTool,
    email_tool: Optional[EmailTool] = None,
    user_id: Optional[str] = None
) -> Agent[AgentDependencies, ResearchResult]:
    """
    Factory function to create a configured research agent.
    
    Args:
        llm_provider: The LLM provider to use
        search_tool: Tool for searching information
        email_tool: Optional tool for creating email drafts
        user_id: Optional user identifier for session tracking
    
    Returns:
        Configured research agent instance
    """
    # Create a new agent instance with the specified model
    agent = Agent(
        model=llm_provider.get_model(),
        deps_type=AgentDependencies,
        result_type=ResearchResult,
        system_prompt=research_agent.system_prompt,
    )
    
    # Register the same tools
    agent.tool(search_information)
    agent.tool(create_email_draft)
    
    return agent


def create_agent_dependencies(
    search_tool: SearchTool,
    email_tool: Optional[EmailTool] = None,
    user_id: Optional[str] = None,
    session_id: Optional[str] = None
) -> AgentDependencies:
    """
    Factory function to create agent dependencies.
    
    This pattern allows for easy testing and dependency injection.
    """
    return AgentDependencies(
        search_tool=search_tool,
        email_tool=email_tool,
        user_id=user_id,
        session_id=session_id
    )


# Example of agent-as-tool pattern
async def run_research_agent_as_tool(
    query: str,
    llm_provider: LLMProvider,
    search_tool: SearchTool,
    email_tool: Optional[EmailTool] = None,
    usage_context: Optional[Any] = None
) -> ResearchResult:
    """
    Run the research agent as a tool for another agent.
    
    This demonstrates the agent-as-tool pattern where one agent
    can invoke another agent as part of its workflow.
    """
    agent = create_research_agent(llm_provider, search_tool, email_tool)
    deps = create_agent_dependencies(search_tool, email_tool)
    
    # CRITICAL: Pass usage context for token tracking in multi-agent scenarios
    result = await agent.run(
        query,
        deps=deps,
        usage=usage_context  # Important for multi-agent token tracking
    )
    
    return result.data
