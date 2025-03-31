package kr.co.fithub.chat.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import kr.co.fithub.chat.model.dto.ChatDTO;

@Controller
public class ChatController {
	
	@MessageMapping("/chat.sendMessage") // 클라이언트가 메시지를 보내는 주소 (/app/chat.sendMessage)
    @SendTo("/topic/public") // 구독 중인 클라이언트에게 메시지 전송
    public ResponseEntity<ChatDTO> sendMessage(ChatDTO chatMessage) {
        return ResponseEntity.ok(chatMessage); // 받은 메시지를 그대로 클라이언트에 반환
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ResponseEntity<ChatDTO> addUser(ChatDTO chatMessage) {
        chatMessage.setChatMessage(chatMessage.getMemberId() + "님이 입장하셨습니다.");
        return ResponseEntity.ok(chatMessage);
    }
}
