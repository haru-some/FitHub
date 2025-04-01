package kr.co.fithub.chat.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatDTO {
	private Long chatRoomNo;   // 채팅방 번호
    private String memberId;     // 보낸 사람 ID (관리자 or 유저)
    private String messageContent;    // 메시지 내용
    private String messageType; // "CHAT" (일반 메시지) | "JOIN" (입장) | "LEAVE" (퇴장)
    private String messageDate;  

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
