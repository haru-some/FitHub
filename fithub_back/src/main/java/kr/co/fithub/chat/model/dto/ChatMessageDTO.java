package kr.co.fithub.chat.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="chatMessage")
@Schema(description = "채팅 메시지 DTO")
public class ChatMessageDTO {
	@Schema(description = "채팅 메시지 번호", example = "1")
	private int messageNo;
	@Schema(description = "채팅방 번호", example = "1")
    private int chatRoomNo; // 채팅방 번호
	@Schema(description = "채팅 회원 아이디", example = "kingjoji")
    private String chatMemberId;
	@Schema(description = "채팅 내역", example = "안녕하세요")
    private String messageContent;
	@Schema(description = "채팅 날짜", example = "2025-04-10 16:44:11")
    private String messageDate; // 메시지 전송 시간
	@Schema(description = "채팅 읽음", example = "1")
    private int isRead; // 1 안읽음 / 2 읽음
	@Schema(description = "채팅 회원 프로필 사진", example = "시동냥이.jpg")
    private String memberThumb;
	@Schema(description = "회원 등급", example = "1")
    private int memberLevel;
	@Schema(description = "회원 경고", example = "1")
    private int warningLevel;
}