package kr.co.fithub.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.fithub.chat.model.dto.ChatMessageDTO;
import kr.co.fithub.chat.model.dto.ChatRoomDTO;
import kr.co.fithub.chat.model.service.ChatService;
import kr.co.fithub.chat.model.service.WebSocketSessionManager;
import lombok.extern.slf4j.Slf4j;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/chat")
@Slf4j
@Tag(name = "문의 채팅 API 💬", description = "문의 채팅 기능")
public class ChatController {
	@Autowired
	private ChatService chatService;
	
	@Autowired
	private SimpMessagingTemplate messagingTemplate;
	
	@Autowired
	private WebSocketSessionManager sessionManager;
	
	@Operation(summary = "회원의 문의 채팅방 생성", description = "관리자와의 문의 채팅방을 생성합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@PostMapping("/room")
	public ResponseEntity<Integer> createChatRoom(@RequestParam String memberId) {
		int r = chatService.createChatRoom(memberId);
		return ResponseEntity.ok(r);
	}
	
	@Operation(summary = "회원의 문의 방 조회", description = "회원의 문의 채팅방 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/check/room")
	public ResponseEntity<ChatRoomDTO> getRoomId(@RequestParam String memberId) {
		ChatRoomDTO cr = chatService.getRoomId(memberId);
		return ResponseEntity.ok(cr);
	}
	
	@Operation(summary = "관리자의 전체 회원 채팅방 조회", description = "관리자의 모든 채팅방들의 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/rooms")
	public ResponseEntity<List> chatRoomList() {
		List list = chatService.chatRoomList();
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "관리자의 특정 회원 채팅방의 글 조회", description = "관리자와 특정 회원과의 채팅 내역을 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/room/admin/message")
	public ResponseEntity<List> loadChatMessage(@RequestParam int chatRoomNo) {
		List list = chatService.loadChatMessage(chatRoomNo);
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "회원의 관리자와의 채팅방의 글 조회", description = "관리자와 회원의 채팅 내역을 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/room/member/message")
	public ResponseEntity<List> loadChatMember(@RequestParam String memberId) {
		List list = chatService.loadChatMember(memberId);
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "채팅방 입장 시 읽음 처리", description = "관리자, 회원 모두 채팅방 입장시 읽음 처리되게 수정합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@PatchMapping("/view")
	public ResponseEntity<Integer> viewOk(@RequestParam int roomNo, @RequestParam String chatMemberId) {
		int result = chatService.viewOk(roomNo, chatMemberId);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "채팅 전송", description = "특정 채팅방에 들어온 사람들에게 채팅을 보냅니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@MessageMapping("/chat/sendMessage/{roomNo}")
	public void sendMessage(@DestinationVariable("roomNo") int roomNo, @Payload ChatMessageDTO message) {
		message.setChatRoomNo(roomNo);
	    // 메시지 저장
	    int result = chatService.inputChatMessage(message);
	    messagingTemplate.convertAndSend("/topic/chat/messages/" + roomNo, message);
	} 
	
	@Operation(summary = "채팅 알람", description = "채팅 중이지 않은 채팅방에 채팅이 왔을 때 알림을 날립니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@MessageMapping("/chat/alarm")
    public void sendNotificationToOtherRoomUsers(int notificationMessage) {
        messagingTemplate.convertAndSend("/queue/notifications", notificationMessage);
    }
	
}
