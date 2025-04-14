package kr.co.fithub.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import kr.co.fithub.chat.model.service.WebSocketSessionManager;

@Component
public class WebSocketEventListener {

    @Autowired
    private WebSocketSessionManager sessionManager;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = sha.getSessionId();
        String memberId = sha.getFirstNativeHeader("memberId");
        String roomId = sha.getFirstNativeHeader("roomId");
        
        if (sessionId != null && memberId != null && roomId != null) {
            sessionManager.addSession(sessionId, roomId, memberId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        sessionManager.removeSession(sessionId);
    }
}
