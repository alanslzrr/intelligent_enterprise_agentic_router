"""
FastAPI Backend for Intelligent Enterprise Agentic Router
Provides REST API and WebSocket endpoints for real-time agent workflow execution
"""

import asyncio
import base64
import json
import os
from pathlib import Path
from typing import Optional, List, Union
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import router workflow and hooks
from router import run_workflow_async, WorkflowInput, RouterContext, RunHooks
from agents.run import RunContextWrapper
from agents import Agent

app = FastAPI(title="Intelligent Enterprise Agentic Router")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_path = Path(__file__).parent / "static"
static_path.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Mount src directory for assets
src_path = Path(__file__).parent / "src"
if src_path.exists():
    app.mount("/src", StaticFiles(directory=src_path), name="src")

# Data directory
DATA_DIR = Path(__file__).parent / "data"


class WorkflowRequest(BaseModel):
    """Request model for workflow execution"""
    text: Optional[str] = None
    file_path: Optional[str] = None


class ConnectionManager:
    """Manages WebSocket connections for real-time updates"""
    
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_message(self, message: dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending message: {e}")
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


class WebSocketRunHooks(RunHooks[RouterContext]):
    """Custom hooks to send real-time updates via WebSocket"""
    
    def __init__(self, websocket: WebSocket, manager: ConnectionManager):
        self.websocket = websocket
        self.manager = manager
        self.step = 0
        self.max_chars = 2000  # Limit for input/output display
    
    def _truncate(self, text: str) -> str:
        """Truncate long text for display"""
        if text is None:
            return ""
        if len(text) <= self.max_chars:
            return text
        return text[:self.max_chars] + f"\n... [{len(text) - self.max_chars} chars omitted]"
    
    def _serialize_output(self, output) -> dict:
        """Serialize agent output to dict"""
        try:
            if hasattr(output, 'model_dump'):
                return output.model_dump()
            elif isinstance(output, dict):
                return output
            elif hasattr(output, '__dict__'):
                return output.__dict__
            else:
                return {"value": str(output)}
        except:
            return {"value": str(output)}
    
    async def on_agent_start(self, context: RunContextWrapper[RouterContext], agent: Agent[RouterContext]) -> None:
        self.step += 1
        await self.manager.send_message({
            "type": "agent_start",
            "agent": agent.name,
            "step": self.step,
            "timestamp": datetime.now().isoformat()
        }, self.websocket)
    
    async def on_llm_start(
        self,
        context: RunContextWrapper[RouterContext],
        agent: Agent[RouterContext],
        system_prompt: Optional[str],
        input_items: list,
    ) -> None:
        """Capture LLM input before processing"""
        # Extract user content from input items
        input_text = ""
        for item in input_items:
            if isinstance(item, dict):
                if item.get("role") == "user":
                    content = item.get("content", "")
                    if isinstance(content, str):
                        input_text += content + "\n"
                    elif isinstance(content, list):
                        for c in content:
                            if isinstance(c, dict) and c.get("type") == "text":
                                input_text += c.get("text", "") + "\n"
            elif hasattr(item, 'content'):
                input_text += str(item.content) + "\n"
        
        await self.manager.send_message({
            "type": "agent_input",
            "agent": agent.name,
            "input": self._truncate(input_text.strip()),
            "timestamp": datetime.now().isoformat()
        }, self.websocket)
    
    async def on_llm_end(
        self,
        context: RunContextWrapper[RouterContext],
        agent: Agent[RouterContext],
        response,
    ) -> None:
        """Capture reasoning and response from LLM"""
        reasoning_text = ""
        response_text = ""
        
        # Extract reasoning if available
        if hasattr(response, 'reasoning') and response.reasoning:
            reasoning_text = str(response.reasoning)
        
        # Extract response content
        if hasattr(response, 'content'):
            response_text = str(response.content)
        elif hasattr(response, 'text'):
            response_text = str(response.text)
        else:
            response_text = str(response)
        
        await self.manager.send_message({
            "type": "agent_thinking",
            "agent": agent.name,
            "reasoning": self._truncate(reasoning_text),
            "response": self._truncate(response_text),
            "timestamp": datetime.now().isoformat()
        }, self.websocket)
    
    async def on_agent_end(self, context: RunContextWrapper[RouterContext], agent: Agent[RouterContext], output) -> None:
        # Get usage stats
        u = context.usage
        
        # Serialize output
        output_data = self._serialize_output(output)
        
        await self.manager.send_message({
            "type": "agent_end",
            "agent": agent.name,
            "output": output_data,
            "usage": {
                "requests": u.requests,
                "input_tokens": u.input_tokens,
                "output_tokens": u.output_tokens,
                "total_tokens": u.total_tokens
            },
            "timestamp": datetime.now().isoformat()
        }, self.websocket)
    
    async def on_handoff(self, context: RunContextWrapper[RouterContext], from_agent: Agent[RouterContext], to_agent: Agent[RouterContext]) -> None:
        await self.manager.send_message({
            "type": "handoff",
            "from_agent": from_agent.name,
            "to_agent": to_agent.name,
            "timestamp": datetime.now().isoformat()
        }, self.websocket)


manager = ConnectionManager()


@app.get("/", response_class=HTMLResponse)
async def get_index():
    """Serve the main HTML page"""
    html_file = Path(__file__).parent / "static" / "index.html"
    if html_file.exists():
        return FileResponse(html_file)
    return HTMLResponse("<h1>Frontend not found. Please check static/index.html</h1>")


@app.get("/api/data-files")
async def list_data_files():
    """List all files in the data directory"""
    try:
        files = []
        if DATA_DIR.exists():
            for file_path in DATA_DIR.iterdir():
                if file_path.is_file():
                    files.append({
                        "name": file_path.name,
                        "path": str(file_path.relative_to(Path(__file__).parent)),
                        "size": file_path.stat().st_size,
                        "modified": datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
                    })
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/file-preview")
async def preview_file(path: str):
    """Get preview content of a file"""
    try:
        file_path = Path(__file__).parent / path
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Check if file is in the data directory (security check)
        if not str(file_path.resolve()).startswith(str(DATA_DIR.resolve())):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Handle different file types
        file_ext = file_path.suffix.lower()
        
        if file_ext == '.pdf':
            # For PDF files, return the path for direct viewing
            return {
                "success": True,
                "type": "pdf",
                "path": f"/{path}",
                "filename": file_path.name,
                "size": file_path.stat().st_size
            }
        else:
            # For text files, read and return content
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Limit preview to first 5000 characters
                    if len(content) > 5000:
                        content = content[:5000] + "\n\n... [Content truncated for preview]"
                    return {
                        "success": True,
                        "type": "text",
                        "content": content
                    }
            except UnicodeDecodeError:
                # If file is not text, return error
                return {
                    "success": False,
                    "error": "This file type cannot be previewed. Use 'Process Workflow' to analyze it."
                }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/data/{filename}")
async def serve_data_file(filename: str):
    """Serve files from the data directory"""
    try:
        file_path = DATA_DIR / filename
        
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Security check
        if not str(file_path.resolve()).startswith(str(DATA_DIR.resolve())):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return FileResponse(file_path)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Handle file uploads"""
    try:
        # Save uploaded file to data directory
        file_path = DATA_DIR / file.filename
        content = await file.read()
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        return {
            "success": True,
            "filename": file.filename,
            "path": str(file_path.relative_to(Path(__file__).parent)),
            "size": len(content)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/workflow")
async def execute_workflow(request: WorkflowRequest):
    """Execute workflow without WebSocket (simple REST endpoint)"""
    try:
        workflow_input = None
        
        if request.text:
            workflow_input = WorkflowInput(input_as_text=request.text)
        elif request.file_path:
            file_path = Path(__file__).parent / request.file_path
            
            if not file_path.exists():
                raise HTTPException(status_code=404, detail="File not found")
            
            # Read file and determine type
            if file_path.suffix.lower() in ['.pdf']:
                # For PDF, encode as base64
                with open(file_path, "rb") as f:
                    pdf_bytes = f.read()
                    pdf_b64 = base64.b64encode(pdf_bytes).decode('utf-8')
                
                workflow_input = WorkflowInput(
                    input_messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "input_file",
                                    "file_data": f"data:application/pdf;base64,{pdf_b64}",
                                    "filename": file_path.name
                                }
                            ]
                        },
                        {
                            "role": "user",
                            "content": "Proceso este documento y analízalo"
                        }
                    ]
                )
            else:
                # For text files
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                workflow_input = WorkflowInput(input_as_text=content)
        else:
            raise HTTPException(status_code=400, detail="Either text or file_path must be provided")
        
        # Execute workflow
        result = await run_workflow_async(workflow_input)
        
        return {"success": True, "result": result}
        
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time workflow execution"""
    await manager.connect(websocket)
    
    try:
        while True:
            # Receive workflow request
            data = await websocket.receive_json()
            
            # Send acknowledgment
            await manager.send_message({
                "type": "status",
                "message": "🚀 Iniciando workflow...",
                "timestamp": datetime.now().isoformat()
            }, websocket)
            
            try:
                # Prepare workflow input
                workflow_input = None
                
                if data.get("text"):
                    workflow_input = WorkflowInput(input_as_text=data["text"])
                elif data.get("file_path"):
                    file_path = Path(__file__).parent / data["file_path"]
                    
                    if not file_path.exists():
                        await manager.send_message({
                            "type": "error",
                            "message": "File not found",
                            "timestamp": datetime.now().isoformat()
                        }, websocket)
                        continue
                    
                    # Read file based on type
                    if file_path.suffix.lower() in ['.pdf']:
                        with open(file_path, "rb") as f:
                            pdf_bytes = f.read()
                            pdf_b64 = base64.b64encode(pdf_bytes).decode('utf-8')
                        
                        workflow_input = WorkflowInput(
                            input_messages=[
                                {
                                    "role": "user",
                                    "content": [
                                        {
                                            "type": "input_file",
                                            "file_data": f"data:application/pdf;base64,{pdf_b64}",
                                            "filename": file_path.name
                                        }
                                    ]
                                },
                                {
                                    "role": "user",
                                    "content": "Proceso este documento y analízalo"
                                }
                            ]
                        )
                    else:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                        workflow_input = WorkflowInput(input_as_text=content)
                
                if not workflow_input:
                    await manager.send_message({
                        "type": "error",
                        "message": "No input provided",
                        "timestamp": datetime.now().isoformat()
                    }, websocket)
                    continue
                
                # Create WebSocket hooks for real-time updates
                ws_hooks = WebSocketRunHooks(websocket, manager)
                
                try:
                    # Execute workflow with WebSocket hooks
                    result = await run_workflow_async(workflow_input, hooks=ws_hooks)
                    
                    # Send final result
                    await manager.send_message({
                        "type": "result",
                        "result": result,
                        "timestamp": datetime.now().isoformat()
                    }, websocket)
                    
                except Exception as workflow_error:
                    raise workflow_error
                
            except Exception as e:
                await manager.send_message({
                    "type": "error",
                    "message": str(e),
                    "timestamp": datetime.now().isoformat()
                }, websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
