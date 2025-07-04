"""
Tool implementation patterns for external API integrations.

This example demonstrates:
- Abstract base classes for tools
- Async API client implementations
- Error handling and retry logic
- Rate limiting and authentication
- Structured data models for API responses
"""

import asyncio
import json
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import httpx
from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    """Structured search result model."""
    title: str
    url: str
    description: str
    score: float = Field(0.0, ge=0.0, le=1.0)
    published_date: Optional[datetime] = None


class EmailDraft(BaseModel):
    """Structured email draft model."""
    to: List[str]
    subject: str
    body: str
    cc: Optional[List[str]] = None
    bcc: Optional[List[str]] = None
    draft_id: Optional[str] = None


class BaseTool(ABC):
    """Abstract base class for all tools."""
    
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self._client: Optional[httpx.AsyncClient] = None
        self._rate_limit_reset: Optional[datetime] = None
        self._requests_remaining = 0
    
    async def __aenter__(self):
        """Async context manager entry."""
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=30.0,
            headers=self._get_headers()
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._client:
            await self._client.aclose()
    
    @abstractmethod
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for API requests."""
        pass
    
    async def _check_rate_limit(self):
        """Check and handle rate limiting."""
        if self._rate_limit_reset and datetime.now() < self._rate_limit_reset:
            if self._requests_remaining <= 0:
                wait_time = (self._rate_limit_reset - datetime.now()).total_seconds()
                await asyncio.sleep(wait_time)
    
    async def _handle_response(self, response: httpx.Response) -> Dict[str, Any]:
        """Handle API response with error checking."""
        # Update rate limit info from headers
        if 'x-ratelimit-remaining' in response.headers:
            self._requests_remaining = int(response.headers['x-ratelimit-remaining'])
        
        if 'x-ratelimit-reset' in response.headers:
            reset_timestamp = int(response.headers['x-ratelimit-reset'])
            self._rate_limit_reset = datetime.fromtimestamp(reset_timestamp)
        
        if response.status_code == 429:
            raise Exception("Rate limit exceeded")
        
        response.raise_for_status()
        return response.json()


class SearchTool(BaseTool):
    """
    Example search tool implementation.
    
    This demonstrates patterns for:
    - API authentication
    - Query parameter handling
    - Response parsing and validation
    - Error handling
    """
    
    def __init__(self, api_key: str, base_url: str = "https://api.search.brave.com/res/v1"):
        super().__init__(api_key, base_url)
    
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": self.api_key
        }
    
    async def search(
        self, 
        query: str, 
        max_results: int = 10,
        country: str = "US",
        search_lang: str = "en"
    ) -> List[SearchResult]:
        """
        Search for information using the search API.
        
        Args:
            query: Search query string
            max_results: Maximum number of results to return
            country: Country code for localized results
            search_lang: Language code for search
            
        Returns:
            List of structured search results
        """
        await self._check_rate_limit()
        
        params = {
            "q": query,
            "count": min(max_results, 20),  # API limit
            "country": country,
            "search_lang": search_lang,
            "safesearch": "moderate"
        }
        
        try:
            response = await self._client.get("/web/search", params=params)
            data = await self._handle_response(response)
            
            # Parse results into structured format
            results = []
            for item in data.get("web", {}).get("results", []):
                result = SearchResult(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    description=item.get("description", ""),
                    score=item.get("score", 0.0)
                )
                results.append(result)
            
            return results[:max_results]
        
        except httpx.HTTPError as e:
            raise Exception(f"Search API error: {str(e)}")
        except Exception as e:
            raise Exception(f"Search failed: {str(e)}")


class EmailTool(BaseTool):
    """
    Example email tool implementation.
    
    This demonstrates patterns for:
    - OAuth2 authentication flow
    - File-based credential storage
    - MIME message formatting
    - Draft creation and management
    """
    
    def __init__(self, credentials_path: str, token_path: str = "token.json"):
        # Email tools typically don't use API keys in the same way
        super().__init__("", "https://gmail.googleapis.com")
        self.credentials_path = credentials_path
        self.token_path = token_path
        self._service = None
    
    def _get_headers(self) -> Dict[str, str]:
        # Gmail API uses OAuth2, headers set by google client library
        return {"Content-Type": "application/json"}
    
    async def _authenticate(self):
        """Handle OAuth2 authentication flow."""
        # This is a simplified example - real implementation would use
        # google-auth-oauthlib and google-api-python-client
        try:
            # Load existing token
            with open(self.token_path, 'r') as token_file:
                token_data = json.load(token_file)
                # Validate token and refresh if needed
                # ... OAuth2 refresh logic here ...
        
        except FileNotFoundError:
            # First time setup - would trigger OAuth2 flow
            # ... OAuth2 authorization flow here ...
            pass
    
    async def create_draft(
        self,
        to: List[str],
        subject: str,
        body: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None
    ) -> str:
        """
        Create an email draft.
        
        Args:
            to: List of recipient email addresses
            subject: Email subject line
            body: Email body content
            cc: Optional CC recipients
            bcc: Optional BCC recipients
            
        Returns:
            Draft ID string
        """
        await self._authenticate()
        
        # Create MIME message
        message_data = {
            "to": ", ".join(to),
            "subject": subject,
            "body": body
        }
        
        if cc:
            message_data["cc"] = ", ".join(cc)
        if bcc:
            message_data["bcc"] = ", ".join(bcc)
        
        try:
            # Simulate draft creation - real implementation would use Gmail API
            draft_id = f"draft_{datetime.now().isoformat()}"
            
            # In real implementation:
            # draft = service.users().drafts().create(
            #     userId='me',
            #     body={'message': {'raw': base64_message}}
            # ).execute()
            
            return draft_id
        
        except Exception as e:
            raise Exception(f"Failed to create email draft: {str(e)}")
    
    async def send_draft(self, draft_id: str) -> str:
        """Send a previously created draft."""
        await self._authenticate()
        
        try:
            # Simulate sending - real implementation would use Gmail API
            # sent = service.users().drafts().send(
            #     userId='me',
            #     body={'id': draft_id}
            # ).execute()
            
            return f"sent_{draft_id}"
        
        except Exception as e:
            raise Exception(f"Failed to send draft: {str(e)}")


# Factory functions for easy tool creation
def create_search_tool(api_key: str) -> SearchTool:
    """Factory function to create a search tool."""
    return SearchTool(api_key)


def create_email_tool(credentials_path: str, token_path: str = "token.json") -> EmailTool:
    """Factory function to create an email tool."""
    return EmailTool(credentials_path, token_path)
