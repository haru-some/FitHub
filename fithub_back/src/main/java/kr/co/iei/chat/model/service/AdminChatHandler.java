package kr.co.iei.chat.model.service;

import java.util.HashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.iei.chat.model.dto.ChatDTO;

@Component
public class AdminChatHandler extends TextWebSocketHandler{
	//접속한 회원 정보를 저장할 컬렉션

	private HashMap<WebSocketSession, String> members;
	
	public AdminChatHandler() {
		super();
		members = new HashMap<>();
	}

	//클라이언트가 소켓에 최초 접속하면 자동으로 실행되는 메소드
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("클라이언트 접속 : " + session);
	}

	//클라이언트가 소켓으로 데이터를 전송하면 실행되는 메소드
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println(message.getPayload());
		//클라이언트가 보낸 메세지는 json을 문자열로 변환해서 전송
		//받은 메세지는 TextMessage객체의 payLoad에 저장
		//문자열 형태로 가지고 있으면 구분해서 사용하기가 어려움 -> 자바 객체형태로 변환
		ObjectMapper om = new ObjectMapper();
		ChatDTO chat = om.readValue(message.getPayload(), ChatDTO.class);
		System.out.println(chat);
		//최초 접속이면 members에 접속자 정보 추가
		if(chat.getType().equals("enter")) {
			members.put(session, chat.getMemberId());
		}
		//DB작업이 필요하면 service 호출해서 insert(ex.insert)
		String data = om.writeValueAsString(chat);//객체를 다시 문자열로 변환
		TextMessage sendData = new TextMessage(data);
		for(WebSocketSession s : members.keySet()) {
			s.sendMessage(sendData);
		}
		super.handleTextMessage(session, message);
	}

	//클라이언트가 소켓에서 접속이 끊어지면 자동으로 호출되는 메소드
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("클라이언트 접속 끊김");
		//members에서 제거하기 전에 최장메세지를 위해 접속이 끊긴 회원의 아이디를 먼저 추출
		String memberId = members.get(session);
		//접속이 끊어진 회원은 members에서 제거
		members.remove(session);
		//접속이 끊어진 회원의 정보를 남은 회원들에게 전송(나갔습니다 메세지를 출력하기 위해서)
		ChatDTO chat = new ChatDTO();
		chat.setType("out");
		chat.setMemberId(memberId);
		ObjectMapper om = new ObjectMapper();
		String data = om.writeValueAsString(chat);
		TextMessage sendMessage = new TextMessage(data);
		for(WebSocketSession s : members.keySet()) {
			s.sendMessage(sendMessage);
		}
	}
	

}
