from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import json


class ResponseModificationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Call the next middleware or route handler
        response: Response = await call_next(request)

        # Modify headers
        response.headers["X-Custom-Header"] = f"Modified at {request.url.path}"

        # Modify response body if it's JSON
        if "application/json" in response.headers.get("content-type", ""):
            body = b""
            async for chunk in response.body_iterator:
                body += chunk
            if body:
                try:
                    data = json.loads(body.decode())
                    data["custom_message"] = f"Processed by middleware on {request.url.path}"
                    response.body = json.dumps(data).encode()
                    response.headers["content-length"] = str(
                        len(response.body))
                except json.JSONDecodeError:
                    pass  # Skip modification if not valid JSON

        return response
