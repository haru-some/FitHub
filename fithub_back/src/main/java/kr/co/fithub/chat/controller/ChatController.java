package kr.co.fithub.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.chat.model.dto.ChatMessageDTO;
import kr.co.fithub.chat.model.dto.ChatRoomDTO;
import kr.co.fithub.chat.model.service.ChatService;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/chat")
@Slf4j
public class ChatController {
	@Autowired
	private ChatService chatService;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@PutMapping("/create")
	public ResponseEntity<Integer> createChatRoom(@RequestParam String memberId) {
		int r = chatService.createChatRoom(memberId);
		return ResponseEntity.ok(r);
	}
	
	@GetMapping("/getRoomId")
	public ResponseEntity<ChatRoomDTO> getRoomId(@RequestParam String memberId) {
		ChatRoomDTO cr = chatService.getRoomId(memberId);
		return ResponseEntity.ok(cr);
	}
	
	@GetMapping("/list")
	public ResponseEntity<List> chatRoomList() {
		List list = chatService.chatRoomList();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/loadChatMessage")
	public ResponseEntity<List> loadChatMessage(@RequestParam int chatRoomNo) {
		List list = chatService.loadChatMessage(chatRoomNo);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping("/loadChatMember")
	public ResponseEntity<List> loadChatMember(@RequestParam String memberId) {
		List list = chatService.loadChatMember(memberId);
		return ResponseEntity.ok(list);
	}
	
	@PatchMapping("/viewOk")
	public ResponseEntity<Integer> viewOk(@RequestParam int roomNo, @RequestParam String chatMemberId) {
		int result = chatService.viewOk(roomNo, chatMemberId);
		return ResponseEntity.ok(result);
	}
	
	@MessageMapping("/chat/sendMessage/{roomId}")
	public void sendMessage(@DestinationVariable("roomId") int roomId, @Payload ChatMessageDTO message) {
	    message.setChatRoomNo(roomId);
	    int r = chatService.inputChatMessage(message);
	    System.out.println(message);
	    messagingTemplate.convertAndSend("/topic/chat/messages/" + roomId, message);
	}
	
	@MessageMapping("/chat/alarm")
    public void sendNotificationToOtherRoomUsers(int notificationMessage) {
        messagingTemplate.convertAndSend("/queue/notifications", notificationMessage);
    }
	
	@SubscribeMapping("/chat/enter/{roomId}")
	public void onUserJoin(@DestinationVariable String roomId) {
	    // 사용자가 채팅방에 들어올 때 해당 채팅방의 모든 메시지에 대해 isRead를 2로 변경
//	    chatService.updateMessagesReadStatus(Integer.parseInt(roomId), 2);

	    // 메시지 업데이트 후 채팅방의 상태를 알리는 메시지를 전송
	    String view = "view"; // 예시로 "view" 메시지 전송
	    messagingTemplate.convertAndSend("/topic/chat/messages/" + roomId, view);
	}
	
}
