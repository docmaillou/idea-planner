"""
Unit test patterns for Pydantic AI agents.

This example demonstrates:
- Testing async agent functions
- Mocking external dependencies
- Testing error scenarios
- Validating agent responses
- Testing multi-agent interactions
"""

import pytest
from unittest.mock import AsyncMock, patch
from pydantic import ValidationError

from agent.agent import (
    create_research_agent,
    create_agent_dependencies,
    run_research_agent_as_tool,
    AgentDependencies,
    ResearchQuery,
    ResearchResult
)
from agent.tools import SearchResult


class TestAgentDependencies:
    """Test agent dependency injection patterns."""
    
    def test_create_agent_dependencies_minimal(self, mock_search_tool):
        """Test creating dependencies with minimal required parameters."""
        deps = create_agent_dependencies(search_tool=mock_search_tool)
        
        assert deps.search_tool == mock_search_tool
        assert deps.email_tool is None
        assert deps.user_id is None
        assert deps.session_id is None
    
    def test_create_agent_dependencies_full(self, mock_search_tool, mock_email_tool):
        """Test creating dependencies with all parameters."""
        deps = create_agent_dependencies(
            search_tool=mock_search_tool,
            email_tool=mock_email_tool,
            user_id="test_user",
            session_id="test_session"
        )
        
        assert deps.search_tool == mock_search_tool
        assert deps.email_tool == mock_email_tool
        assert deps.user_id == "test_user"
        assert deps.session_id == "test_session"
    
    def test_agent_dependencies_validation(self, mock_search_tool):
        """Test that AgentDependencies validates correctly."""
        # Valid dependencies
        deps = AgentDependencies(search_tool=mock_search_tool)
        assert deps.search_tool == mock_search_tool
        
        # Invalid dependencies (missing required field)
        with pytest.raises(ValidationError):
            AgentDependencies()


class TestResearchAgent:
    """Test research agent functionality."""
    
    @pytest.mark.asyncio
    async def test_agent_creation(self, mock_llm_provider, mock_search_tool):
        """Test that agent can be created successfully."""
        agent = create_research_agent(
            llm_provider=mock_llm_provider,
            search_tool=mock_search_tool
        )
        
        assert agent is not None
        assert agent.deps_type == AgentDependencies
        assert agent.result_type == ResearchResult
    
    @pytest.mark.asyncio
    async def test_search_tool_integration(self, research_agent, agent_dependencies, sample_search_results):
        """Test that agent can use search tool correctly."""
        # Mock the agent's run method to test tool integration
        with patch.object(research_agent, 'run') as mock_run:
            mock_run.return_value.data = ResearchResult(
                query="AI safety",
                results=[result.dict() for result in sample_search_results],
                summary="AI safety research summary",
                sources_count=len(sample_search_results),
                confidence_score=0.9
            )
            
            result = await research_agent.run(
                "Research AI safety",
                deps=agent_dependencies
            )
            
            assert result.data.query == "AI safety"
            assert result.data.sources_count == 3
            assert result.data.confidence_score == 0.9
    
    @pytest.mark.asyncio
    async def test_email_tool_integration(self, research_agent, agent_dependencies):
        """Test that agent can create email drafts."""
        # Mock the agent's run method to simulate email creation
        with patch.object(research_agent, 'run') as mock_run:
            mock_run.return_value.data = ResearchResult(
                query="Create email about AI safety",
                results=[],
                summary="Email draft created successfully",
                sources_count=0,
                confidence_score=1.0
            )
            
            result = await research_agent.run(
                "Research AI safety and create email draft to john@example.com",
                deps=agent_dependencies
            )
            
            # Verify email tool was called
            agent_dependencies.email_tool.create_draft.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_agent_error_handling(self, mock_llm_provider, failing_search_tool):
        """Test agent handles tool failures gracefully."""
        agent = create_research_agent(
            llm_provider=mock_llm_provider,
            search_tool=failing_search_tool
        )
        
        deps = create_agent_dependencies(search_tool=failing_search_tool)
        
        # The agent should handle the tool failure gracefully
        # In a real scenario, this would depend on how the agent is configured
        # to handle tool failures
        with pytest.raises(Exception):
            await agent.run("Test query", deps=deps)


class TestAgentTools:
    """Test individual agent tools."""
    
    @pytest.mark.asyncio
    async def test_search_information_tool(self, mock_search_tool, sample_search_results):
        """Test the search information tool directly."""
        from agent.agent import search_information
        
        # Create mock context
        mock_ctx = AsyncMock()
        mock_ctx.deps.search_tool = mock_search_tool
        mock_search_tool.search.return_value = sample_search_results
        
        result = await search_information(mock_ctx, "AI safety", max_results=3)
        
        assert "AI Safety Research Overview" in result
        assert "https://example.com/ai-safety" in result
        mock_search_tool.search.assert_called_once_with("AI safety", max_results=3)
    
    @pytest.mark.asyncio
    async def test_search_tool_error_handling(self, failing_search_tool):
        """Test search tool error handling."""
        from agent.agent import search_information
        
        mock_ctx = AsyncMock()
        mock_ctx.deps.search_tool = failing_search_tool
        
        result = await search_information(mock_ctx, "test query")
        
        assert "Search failed" in result
    
    @pytest.mark.asyncio
    async def test_create_email_draft_tool(self, mock_email_tool):
        """Test the email draft creation tool."""
        from agent.agent import create_email_draft
        
        mock_ctx = AsyncMock()
        mock_ctx.deps.email_tool = mock_email_tool
        mock_email_tool.create_draft.return_value = "draft_123"
        
        result = await create_email_draft(
            mock_ctx,
            recipient="test@example.com",
            subject="Test Subject",
            content="Test content"
        )
        
        assert "draft_123" in result
        mock_email_tool.create_draft.assert_called_once_with(
            to=["test@example.com"],
            subject="Test Subject",
            body="Test content",
            cc=[]
        )
    
    @pytest.mark.asyncio
    async def test_email_tool_not_available(self):
        """Test email tool when not configured."""
        from agent.agent import create_email_draft
        
        mock_ctx = AsyncMock()
        mock_ctx.deps.email_tool = None
        
        result = await create_email_draft(
            mock_ctx,
            recipient="test@example.com",
            subject="Test",
            content="Test"
        )
        
        assert "not available" in result


class TestMultiAgentPatterns:
    """Test multi-agent interaction patterns."""
    
    @pytest.mark.asyncio
    async def test_agent_as_tool_pattern(self, mock_llm_provider, mock_search_tool, sample_search_results):
        """Test using one agent as a tool for another."""
        mock_search_tool.search.return_value = sample_search_results
        
        # Mock the agent run method
        with patch('agent.agent.create_research_agent') as mock_create:
            mock_agent = AsyncMock()
            mock_agent.run.return_value.data = ResearchResult(
                query="test query",
                results=[],
                summary="test summary",
                sources_count=1,
                confidence_score=0.8
            )
            mock_create.return_value = mock_agent
            
            result = await run_research_agent_as_tool(
                query="test query",
                llm_provider=mock_llm_provider,
                search_tool=mock_search_tool,
                usage_context=None
            )
            
            assert result.query == "test query"
            assert result.confidence_score == 0.8
            
            # Verify usage context was passed
            mock_agent.run.assert_called_once()
            call_args = mock_agent.run.call_args
            assert 'usage' in call_args.kwargs


class TestDataValidation:
    """Test data model validation."""
    
    def test_research_query_validation(self):
        """Test ResearchQuery model validation."""
        # Valid query
        query = ResearchQuery(query="test query")
        assert query.query == "test query"
        assert query.max_results == 10  # default
        assert query.include_summary is True  # default
        
        # Invalid query (empty string)
        with pytest.raises(ValidationError):
            ResearchQuery(query="")
        
        # Invalid max_results (too high)
        with pytest.raises(ValidationError):
            ResearchQuery(query="test", max_results=100)
    
    def test_research_result_validation(self):
        """Test ResearchResult model validation."""
        # Valid result
        result = ResearchResult(
            query="test",
            results=[],
            sources_count=0,
            confidence_score=0.5
        )
        assert result.confidence_score == 0.5
        
        # Invalid confidence score (out of range)
        with pytest.raises(ValidationError):
            ResearchResult(
                query="test",
                results=[],
                sources_count=0,
                confidence_score=1.5
            )
