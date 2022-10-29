from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser

@database_sync_to_async
def get_user(token):
    try:
        token_obj = Token.objects.get(key=token)
        if (token_obj.user.is_active):
            return token_obj.user
        return AnonymousUser()
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, app):
        super().__init__(app)

    async def __call__(self, scope, receive, send):
        query_string = scope['query_string'].decode()
        query_pair = query_string.split('&')
        query_params = {}
        for query in query_pair:
            (key, value) = query.split('=')
            query_params[key] = value
        token = query_params.get('token')
        scope['user'] = await get_user(token)
        return await super().__call__(scope, receive, send)
