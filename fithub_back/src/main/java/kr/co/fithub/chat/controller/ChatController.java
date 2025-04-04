package kr.co.fithub.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.chat.model.dto.ChatRoomDTO;
import kr.co.fithub.chat.model.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin("*")
@RestController
@RequestMapping("/chat")
@Slf4j
public class ChatController {
	@Autowired
	private ChatService chatService;
	
	@PostMapping("/create")
	public ResponseEntity<Integer> createChatRoom(@RequestParam String memberId) {
		int r = chatService.createChatRoom(memberId);
		return ResponseEntity.ok(r);
	}
	
	@GetMapping("/list")
	public ResponseEntity<List> chatRoomList() {
		List list = chatService.chatRoomList();
		return ResponseEntity.ok(list);
	}
	
	@MessageMapping("/sendMessage") // /app/sendMessage
    @SendTo("/topic/messages") // 구독 중인 모든 클라이언트에게 전송
    public String sendMessage(String message) {
        return message;
    }
}
