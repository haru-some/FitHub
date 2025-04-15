package kr.co.fithub.chat.model.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class WebSocketSessionManager {

    private final Map<String, String> sessionIdToRoomMap = new ConcurrentHashMap<>();

    public void addSession(String sessionId, String roomId, String memberId) {
        sessionIdToRoomMap.put(sessionId, roomId + "|" + memberId);
    }

    public void removeSession(String sessionId) {
        sessionIdToRoomMap.remove(sessionId);
    }

    public boolean isUserInRoom(String memberId, String roomId) {
        return sessionIdToRoomMap.values().stream()
                .anyMatch(info -> info.equals(roomId + "|" + memberId));
    }
}