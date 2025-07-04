"""
Pytest configuration and fixtures for testing Pydantic AI agents.

This example demonstrates:
- Test fixture patterns for agents and dependencies
- Mock setup for external APIs
- Test data factories
- Async test configuration
"""

import pytest
import asyncio
from unittest.mock import AsyncMock, MagicMock
from typing import List, Dict, Any

from agent.agent import AgentDependencies, create_research_agent, create_agent_dependencies
from agent.tools import SearchTool, EmailTool, SearchResult
from agent.providers import LLMProvider, LLMConfig, OpenAIProvider


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def mock_llm_config():
    """Mock LLM configuration for testing."""
    return LLMConfig(
        provider="openai",
        model="gpt-4",
        api_key="test-key",
        temperature=0.7,
        timeout=30
    )


@pytest.fixture
def mock_llm_provider(mock_llm_config):
    """Mock LLM provider for testing."""
    provider = OpenAIProvider(mock_llm_config)
    # Mock the model creation to avoid actual API calls
    mock_model = MagicMock()
    provider._model = mock_model
    return provider


@pytest.fixture
def sample_search_results():
    """Sample search results for testing."""
    return [
        SearchResult(
            title="AI Safety Research Overview",
            url="https://example.com/ai-safety",
            description="Comprehensive overview of AI safety research and methodologies.",
            score=0.95
        ),
        SearchResult(
            title="Machine Learning Ethics",
            url="https://example.com/ml-ethics",
            description="Ethical considerations in machine learning development.",
            score=0.87
        ),
        SearchResult(
            title="Responsible AI Development",
            url="https://example.com/responsible-ai",
            description="Best practices for responsible AI development and deployment.",
            score=0.82
        )
    ]


@pytest.fixture
def mock_search_tool(sample_search_results):
    """Mock search tool that returns predefined results."""
    mock_tool = AsyncMock(spec=SearchTool)
    mock_tool.search.return_value = sample_search_results
    return mock_tool


@pytest.fixture
def mock_email_tool():
    """Mock email tool for testing."""
    mock_tool = AsyncMock(spec=EmailTool)
    mock_tool.create_draft.return_value = "draft_123456"
    mock_tool.send_draft.return_value = "sent_123456"
    return mock_tool


@pytest.fixture
def agent_dependencies(mock_search_tool, mock_email_tool):
    """Create agent dependencies with mocked tools."""
    return create_agent_dependencies(
        search_tool=mock_search_tool,
        email_tool=mock_email_tool,
        user_id="test_user",
        session_id="test_session"
    )


@pytest.fixture
def research_agent(mock_llm_provider, mock_search_tool, mock_email_tool):
    """Create a research agent with mocked dependencies."""
    return create_research_agent(
        llm_provider=mock_llm_provider,
        search_tool=mock_search_tool,
        email_tool=mock_email_tool,
        user_id="test_user"
    )


@pytest.fixture
def mock_agent_response():
    """Mock agent response for testing."""
    class MockResult:
        def __init__(self, data):
            self.data = data
    
    return MockResult({
        "query": "AI safety research",
        "results": [
            {
                "title": "AI Safety Research Overview",
                "url": "https://example.com/ai-safety",
                "description": "Comprehensive overview of AI safety research."
            }
        ],
        "summary": "AI safety research focuses on ensuring AI systems are safe and beneficial.",
        "sources_count": 3,
        "confidence_score": 0.9
    })


# Test data factories
class TestDataFactory:
    """Factory for creating test data."""
    
    @staticmethod
    def create_search_query(
        query: str = "test query",
        max_results: int = 10,
        include_summary: bool = True
    ) -> Dict[str, Any]:
        """Create a test search query."""
        return {
            "query": query,
            "max_results": max_results,
            "include_summary": include_summary
        }
    
    @staticmethod
    def create_email_request(
        to: List[str] = None,
        subject: str = "Test Subject",
        body: str = "Test email body",
        cc: List[str] = None
    ) -> Dict[str, Any]:
        """Create a test email request."""
        if to is None:
            to = ["test@example.com"]
        
        return {
            "to": to,
            "subject": subject,
            "body": body,
            "cc": cc or []
        }
    
    @staticmethod
    def create_search_results(count: int = 3) -> List[SearchResult]:
        """Create a list of test search results."""
        results = []
        for i in range(count):
            results.append(SearchResult(
                title=f"Test Result {i+1}",
                url=f"https://example.com/result-{i+1}",
                description=f"Description for test result {i+1}",
                score=0.9 - (i * 0.1)
            ))
        return results


@pytest.fixture
def test_data_factory():
    """Provide test data factory."""
    return TestDataFactory


# Async test helpers
@pytest.fixture
def async_mock():
    """Create an AsyncMock for testing async functions."""
    return AsyncMock()


# Environment variable mocking
@pytest.fixture
def mock_env_vars(monkeypatch):
    """Mock environment variables for testing."""
    test_env = {
        "LLM_PROVIDER": "openai",
        "LLM_MODEL": "gpt-4",
        "OPENAI_API_KEY": "test-openai-key",
        "ANTHROPIC_API_KEY": "test-anthropic-key",
        "BRAVE_API_KEY": "test-brave-key",
        "GMAIL_CREDENTIALS_PATH": "./test_credentials.json"
    }
    
    for key, value in test_env.items():
        monkeypatch.setenv(key, value)
    
    return test_env


# Error simulation fixtures
@pytest.fixture
def failing_search_tool():
    """Mock search tool that raises exceptions."""
    mock_tool = AsyncMock(spec=SearchTool)
    mock_tool.search.side_effect = Exception("Search API unavailable")
    return mock_tool


@pytest.fixture
def failing_email_tool():
    """Mock email tool that raises exceptions."""
    mock_tool = AsyncMock(spec=EmailTool)
    mock_tool.create_draft.side_effect = Exception("Email service unavailable")
    return mock_tool


# Performance testing fixtures
@pytest.fixture
def slow_search_tool(sample_search_results):
    """Mock search tool with artificial delay."""
    async def slow_search(*args, **kwargs):
        await asyncio.sleep(0.1)  # Simulate slow API
        return sample_search_results
    
    mock_tool = AsyncMock(spec=SearchTool)
    mock_tool.search.side_effect = slow_search
    return mock_tool
