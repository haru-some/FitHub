package kr.co.fithub.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
	
	private Map<String, Integer> sessions = new HashMap<>();
	
	@EventListener(SessionConnectEvent.class)
    public void onConnect(SessionConnectEvent event){
        String sessionId = event.getMessage().getHeaders().get("simpSessionId").toString();
        String userNo = event.getMessage().getHeaders().get("nativeHeaders").toString().split("\\[")[4].split("]")[0];
        if (userNo != null) {
            // 세션에 사용자 정보를 저장
            sessions.put(sessionId, Integer.parseInt(userNo));
            System.out.println("Session connected: " + sessionId + ", User No: " + userNo);
        }
    }
	
	@EventListener(SessionDisconnectEvent.class)
    public void onDisconnect(SessionDisconnectEvent event) {
		sessions.remove(event.getSessionId());
        System.out.println("Session disconnected: " + event.getSessionId());
    }
}
