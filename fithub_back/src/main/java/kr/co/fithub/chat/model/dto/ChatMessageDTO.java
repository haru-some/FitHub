package kr.co.fithub.chat.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="chatMessage")
public class ChatMessageDTO {
	private int messageNo;
    private int chatRoomNo; // 채팅방 번호
    private String chatMemberId;
    private String messageContent;
    private String messageDate; // 메시지 전송 시간
    private String isRead; // 'Y' 또는 'N'
    private String messageType; // enter, message, out
}