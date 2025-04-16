package kr.co.fithub.dm.model.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.fithub.dm.model.dto.DmAlarm;
import kr.co.fithub.dm.model.dto.DmDto;
import kr.co.fithub.dm.model.dto.DmMessage;

@Component
public class DmAlarmHandler extends TextWebSocketHandler{
	
	@Autowired
	private DmService dmService;
	
	private Map<Integer, WebSocketSession> members = new HashMap<>();
	private ObjectMapper om = new ObjectMapper();
	
	
	public void sendReadYetCountTo(int memberNo) {
	    WebSocketSession session = members.get(memberNo);
	    if (session != null) {
	        try {
	            int readYetCount = dmService.selectReadYetCount(memberNo);
	            DmAlarm alarm = new DmAlarm();
	            alarm.setReadYetCount(readYetCount);
	            alarm.setRefreshRequest("refresh");
	            String data = om.writeValueAsString(alarm);
	            session.sendMessage(new TextMessage(data));
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	    }
	}
	
	private Map<String, String> parseQueryString(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null) return map;

        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2) {
                map.put(pair[0], pair[1]);
            }
        }
        return map;
    }
	
	
	@Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        //System.out.println("알람용 클라이언트 접속 : " + session);
        String query = session.getUri().getQuery(); // "memberNo=123"
        Map<String, String> paramMap = parseQueryString(query);
        int memberNo = Integer.parseInt(paramMap.get("memberNo"));
        members.put(memberNo, session);
        
        int readYetCount = dmService.selectReadYetCount(memberNo);
        //System.out.println("안읽은 메시지 개수: "+readYetCount);
        DmAlarm da = new DmAlarm();
        da.setReadYetCount(readYetCount);
        da.setRefreshRequest("refresh");
        String data = om.writeValueAsString(da);
        session.sendMessage(new TextMessage(data));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

            
            
            
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        Integer disconnectedMemberNo = null;
        for (Map.Entry<Integer, WebSocketSession> entry : members.entrySet()) {
            if (entry.getValue().equals(session)) {
                disconnectedMemberNo = entry.getKey();
                break;
            }
        }

        if (disconnectedMemberNo != null) {
            members.remove(disconnectedMemberNo);

            // 나간 메시지 알림 (선택 사항)
            DmDto leaveMsg = new DmDto();
            leaveMsg.setType("out");
            leaveMsg.setSenderNo(disconnectedMemberNo);

            String data = om.writeValueAsString(leaveMsg);
            TextMessage sendMsg = new TextMessage(data);

            // 필요 시 다른 사용자에게 알릴 수 있음 (지금은 안 보냄)
        }
    }

	
}
