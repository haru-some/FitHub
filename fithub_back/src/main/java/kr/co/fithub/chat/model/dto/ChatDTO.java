package kr.co.fithub.chat.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatDTO {
    private String type; // enter, message, out
    private String memberId;
    private String message;
    private String chatRoomNo; // 채팅방 번호
    private String sentAt; // 메시지 전송 시간
    private String isRead; // 'Y' 또는 'N'
}