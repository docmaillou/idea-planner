"""
Multi-provider LLM configuration pattern.

This example demonstrates:
- Abstract provider interface
- Environment-based provider selection
- Consistent API across different LLM providers
- Configuration management
- Error handling for provider initialization
"""

import os
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from pydantic import BaseModel
from pydantic_ai.models import Model, OpenAIModel, AnthropicModel


class LLMConfig(BaseModel):
    """Configuration for LLM providers."""
    provider: str
    model: str
    api_key: str
    base_url: Optional[str] = None
    temperature: float = 0.7
    max_tokens: Optional[int] = None
    timeout: int = 30


class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    def __init__(self, config: LLMConfig):
        self.config = config
        self._model: Optional[Model] = None
    
    @abstractmethod
    def _create_model(self) -> Model:
        """Create the provider-specific model instance."""
        pass
    
    def get_model(self) -> Model:
        """Get or create the model instance."""
        if self._model is None:
            self._model = self._create_model()
        return self._model
    
    @property
    def provider_name(self) -> str:
        """Get the provider name."""
        return self.config.provider
    
    @property
    def model_name(self) -> str:
        """Get the model name."""
        return self.config.model


class OpenAIProvider(LLMProvider):
    """OpenAI provider implementation."""
    
    def _create_model(self) -> Model:
        """Create OpenAI model instance."""
        return OpenAIModel(
            model_name=self.config.model,
            api_key=self.config.api_key,
            base_url=self.config.base_url,
            timeout=self.config.timeout
        )


class AnthropicProvider(LLMProvider):
    """Anthropic provider implementation."""
    
    def _create_model(self) -> Model:
        """Create Anthropic model instance."""
        return AnthropicModel(
            model_name=self.config.model,
            api_key=self.config.api_key,
            timeout=self.config.timeout
        )


class AzureOpenAIProvider(LLMProvider):
    """Azure OpenAI provider implementation."""
    
    def _create_model(self) -> Model:
        """Create Azure OpenAI model instance."""
        # Azure requires additional configuration
        azure_config = {
            "api_version": os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview"),
            "azure_endpoint": self.config.base_url,
            "azure_deployment": self.config.model
        }
        
        return OpenAIModel(
            model_name=self.config.model,
            api_key=self.config.api_key,
            base_url=self.config.base_url,
            timeout=self.config.timeout,
            **azure_config
        )


# Provider registry for easy lookup
PROVIDER_REGISTRY: Dict[str, type[LLMProvider]] = {
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "azure": AzureOpenAIProvider,
}


# Default model configurations
DEFAULT_MODELS = {
    "openai": "gpt-4",
    "anthropic": "claude-3-sonnet-20240229",
    "azure": "gpt-4",
}


def create_provider_config(
    provider_name: str,
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    timeout: int = 30
) -> LLMConfig:
    """
    Create provider configuration with environment variable fallbacks.
    
    Args:
        provider_name: Name of the LLM provider
        model: Model name (uses default if not provided)
        api_key: API key (reads from environment if not provided)
        base_url: Base URL for API (optional)
        temperature: Sampling temperature
        max_tokens: Maximum tokens to generate
        timeout: Request timeout in seconds
        
    Returns:
        LLMConfig instance
    """
    # Use provided model or default
    if model is None:
        model = DEFAULT_MODELS.get(provider_name, "gpt-4")
    
    # Get API key from environment if not provided
    if api_key is None:
        env_key_map = {
            "openai": "OPENAI_API_KEY",
            "anthropic": "ANTHROPIC_API_KEY",
            "azure": "AZURE_OPENAI_API_KEY"
        }
        env_key = env_key_map.get(provider_name, f"{provider_name.upper()}_API_KEY")
        api_key = os.getenv(env_key)
        
        if not api_key:
            raise ValueError(f"API key not found for {provider_name}. Set {env_key} environment variable.")
    
    # Handle provider-specific base URLs
    if base_url is None and provider_name == "azure":
        base_url = os.getenv("AZURE_OPENAI_ENDPOINT")
        if not base_url:
            raise ValueError("Azure OpenAI endpoint required. Set AZURE_OPENAI_ENDPOINT environment variable.")
    
    return LLMConfig(
        provider=provider_name,
        model=model,
        api_key=api_key,
        base_url=base_url,
        temperature=temperature,
        max_tokens=max_tokens,
        timeout=timeout
    )


def create_provider(
    provider_name: str,
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    base_url: Optional[str] = None,
    **kwargs
) -> LLMProvider:
    """
    Factory function to create LLM provider instances.
    
    Args:
        provider_name: Name of the provider (openai, anthropic, azure)
        model: Model name to use
        api_key: API key for the provider
        base_url: Base URL for the API
        **kwargs: Additional configuration options
        
    Returns:
        Configured LLMProvider instance
        
    Raises:
        ValueError: If provider is not supported
    """
    if provider_name not in PROVIDER_REGISTRY:
        available = ", ".join(PROVIDER_REGISTRY.keys())
        raise ValueError(f"Unsupported provider: {provider_name}. Available: {available}")
    
    config = create_provider_config(
        provider_name=provider_name,
        model=model,
        api_key=api_key,
        base_url=base_url,
        **kwargs
    )
    
    provider_class = PROVIDER_REGISTRY[provider_name]
    return provider_class(config)


def get_provider_from_env(
    provider_name: Optional[str] = None,
    model: Optional[str] = None
) -> LLMProvider:
    """
    Create provider from environment variables.
    
    This is the most common pattern for production usage.
    
    Environment variables used:
    - LLM_PROVIDER: Provider name (default: openai)
    - LLM_MODEL: Model name (uses provider default if not set)
    - {PROVIDER}_API_KEY: API key for the provider
    - AZURE_OPENAI_ENDPOINT: Required for Azure provider
    
    Args:
        provider_name: Override provider from environment
        model: Override model from environment
        
    Returns:
        Configured LLMProvider instance
    """
    # Get provider from parameter or environment
    if provider_name is None:
        provider_name = os.getenv("LLM_PROVIDER", "openai")
    
    # Get model from parameter or environment
    if model is None:
        model = os.getenv("LLM_MODEL")
    
    return create_provider(
        provider_name=provider_name,
        model=model
    )


# Example usage patterns
def example_usage():
    """Example of how to use the provider system."""
    
    # Method 1: Direct creation with explicit parameters
    provider1 = create_provider(
        provider_name="openai",
        model="gpt-4",
        api_key="sk-...",
        temperature=0.5
    )
    
    # Method 2: From environment variables (recommended)
    provider2 = get_provider_from_env()
    
    # Method 3: Override specific parameters
    provider3 = get_provider_from_env(
        provider_name="anthropic",
        model="claude-3-opus-20240229"
    )
    
    # Get the model for use with agents
    model1 = provider1.get_model()
    model2 = provider2.get_model()
    model3 = provider3.get_model()
    
    return model1, model2, model3
