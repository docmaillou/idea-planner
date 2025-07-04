#!/usr/bin/env python3
"""
CLI implementation pattern for Pydantic AI agents.

This example demonstrates:
- Streaming response handling
- Color-coded output for better UX
- Tool execution visibility
- Proper async handling in CLI context
- Session management for conversation context
"""

import asyncio
import sys
from typing import Optional
import click
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.live import Live

# Note: In a real implementation, you would import from your actual modules:
# from agent.agent import create_research_agent
# from agent.providers import get_provider_from_env
# from agent.tools import create_search_tool, create_email_tool

console = Console()


def create_mock_agent():
    """Create a mock agent for demonstration purposes."""
    class MockAgent:
        async def run_stream(self, query: str):
            """Mock streaming response."""
            class MockStreamResult:
                async def stream(self):
                    # Simulate streaming response
                    responses = [
                        type('Message', (), {'content': f"Searching for information about: {query}..."})(),
                        type('Message', (), {'content': f"\n\nFound relevant information about {query}."})(),
                        type('Message', (), {'content': f"\n\nSummary: This is a mock response for demonstration purposes."})(),
                    ]
                    for response in responses:
                        yield response
                        await asyncio.sleep(0.5)  # Simulate processing time
            
            return MockStreamResult()
    
    return MockAgent()


class StreamingDisplay:
    """Handles streaming display of agent responses with tool visibility."""
    
    def __init__(self):
        self.content = ""
        self.current_tool = None
        self.tools_used = []
    
    def update_content(self, new_content: str):
        """Update the main content being streamed."""
        self.content += new_content
    
    def start_tool(self, tool_name: str):
        """Indicate a tool is being executed."""
        self.current_tool = tool_name
        self.tools_used.append(tool_name)
    
    def end_tool(self):
        """Indicate tool execution is complete."""
        self.current_tool = None
    
    def render(self) -> Panel:
        """Render the current state as a Rich panel."""
        text = Text(self.content)
        
        if self.current_tool:
            text.append(f"\n\n🔧 Using tool: {self.current_tool}", style="yellow")
        
        if self.tools_used:
            tools_text = " → ".join(self.tools_used)
            text.append(f"\n\n📋 Tools used: {tools_text}", style="dim")
        
        return Panel(text, title="Agent Response", border_style="blue")


async def stream_agent_response(agent, query: str, display: StreamingDisplay):
    """Stream agent response with tool visibility."""
    try:
        async with agent.run_stream(query) as result:
            async for message in result.stream():
                if hasattr(message, 'content'):
                    display.update_content(message.content)
                elif hasattr(message, 'tool_name'):
                    if message.type == 'tool_call':
                        display.start_tool(message.tool_name)
                    elif message.type == 'tool_result':
                        display.end_tool()
                
                yield display.render()
    
    except Exception as e:
        error_text = Text(f"Error: {str(e)}", style="red")
        yield Panel(error_text, title="Error", border_style="red")


@click.command()
@click.option('--provider', default=None, help='LLM provider (openai, anthropic, etc.)')
@click.option('--model', default=None, help='Model name to use')
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose output')
def main(provider: Optional[str], model: Optional[str], verbose: bool):
    """Interactive CLI for the research agent."""
    
    console.print(Panel.fit(
        "🔬 Research Agent CLI\n"
        "Type your research queries and get comprehensive results.\n"
        "Type 'quit' or 'exit' to end the session.",
        title="Welcome",
        border_style="green"
    ))
    
    # Initialize agent with provider
    try:
        # In a real implementation:
        # llm_provider = get_provider_from_env(provider_name=provider, model=model)
        # search_tool = create_search_tool(os.getenv("BRAVE_API_KEY"))
        # email_tool = create_email_tool(os.getenv("GMAIL_CREDENTIALS_PATH"))
        # agent = create_research_agent(llm_provider, search_tool, email_tool)
        
        # For this example, we'll create a mock agent
        agent = create_mock_agent()
        
        if verbose:
            console.print(f"✅ Initialized with provider: {provider or 'default'}, model: {model or 'default'}")
    
    except Exception as e:
        console.print(f"❌ Failed to initialize agent: {e}", style="red")
        sys.exit(1)
    
    # Interactive loop
    while True:
        try:
            query = console.input("\n[bold blue]Research Query:[/bold blue] ")
            
            if query.lower() in ['quit', 'exit', 'q']:
                console.print("👋 Goodbye!", style="green")
                break
            
            if not query.strip():
                continue
            
            # Stream the response
            display = StreamingDisplay()
            
            with Live(display.render(), refresh_per_second=4) as live:
                async def update_display():
                    async for panel in stream_agent_response(agent, query, display):
                        live.update(panel)
                
                asyncio.run(update_display())
        
        except KeyboardInterrupt:
            console.print("\n👋 Goodbye!", style="green")
            break
        except Exception as e:
            console.print(f"❌ Error: {e}", style="red")


if __name__ == "__main__":
    main()
