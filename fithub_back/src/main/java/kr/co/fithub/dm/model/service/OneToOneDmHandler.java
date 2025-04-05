package kr.co.fithub.dm.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.fithub.dm.model.dto.DmDto;

@Component
public class OneToOneDmHandler extends TextWebSocketHandler {

    // 회원 번호 (memberNo)를 key로 세션을 value로 저장
    private Map<Integer, WebSocketSession> members = new HashMap<>();

    private ObjectMapper om = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("클라이언트 접속 : " + session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println(payload);
        DmDto dm = om.readValue(payload, DmDto.class);
        System.out.println("메시지 수신: " + dm);

        String type = dm.getType();

        if ("enter".equals(type)) {
            members.put(dm.getSenderNo(), session);
            System.out.println("접속 등록: 회원번호 " + dm.getSenderNo());
            return;
        }

        if ("message".equals(type)) {
            int receiverNo = dm.getReceiverNo();
            WebSocketSession receiverSession = members.get(receiverNo);

            String data = om.writeValueAsString(dm);

            // 받는 사람에게만 메시지 전송
            if (receiverSession != null && receiverSession.isOpen()) {
                receiverSession.sendMessage(new TextMessage(data));
            }

            // 보내는 사람에게도 echo (선택 사항)
            session.sendMessage(new TextMessage(data));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("클라이언트 접속 끊김");

        Integer disconnectedMemberNo = null;
        for (Map.Entry<Integer, WebSocketSession> entry : members.entrySet()) {
            if (entry.getValue().equals(session)) {
                disconnectedMemberNo = entry.getKey();
                break;
            }
        }

        if (disconnectedMemberNo != null) {
            members.remove(disconnectedMemberNo);
            System.out.println("접속 해제: 회원번호 " + disconnectedMemberNo);

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
