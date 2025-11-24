"""API schemas for trading endpoints - Request/Response"""

from pydantic import BaseModel
from typing import Dict, List, Optional, Any

class CreateSessionRequest(BaseModel):
    user_id: str
    session_name: Optional[str] = None

class StartTradingRequest(BaseModel):
    session_id: str
    pair: str
    timeframe: str
    strategy_name: str
    config: Dict[str, Any]

class TradingResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class SessionStatusResponse(BaseModel):
    session_id: str
    active_tasks: List[Dict[str, Any]]
    is_active: bool
    mt5_connected: bool