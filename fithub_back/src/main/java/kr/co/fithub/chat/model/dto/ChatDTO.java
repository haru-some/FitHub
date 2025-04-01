package kr.co.fithub.chat.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatDTO {
	private String memberId;
	private String chatMessage;
	private MessageType chatType; // 메시지 타입 (입장, 채팅, 퇴장)

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
