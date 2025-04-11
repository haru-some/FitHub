package kr.co.fithub.chat.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias(value="chatRoom")
@Schema(description = "채팅방 DTO")
public class ChatRoomDTO {
	@Schema(description = "채팅방 번호", example = "1")
	private int chatRoomNo;
	@Schema(description = "채팅방 회원 아이디", example = "kingjoji")
	private String chatMemberId;
	@Schema(description = "채팅방 알림", example = "1")
	private int chatRoomAlarm;
	@Schema(description = "채팅방 마지막 채팅", example = "안녕하세요")
	private String lastMessage;
	@Schema(description = "채팅방 마지막 채팅 날짜", example = "2025-04-10 12:10:11")
	private String lastDate;
	@Schema(description = "채팅방 회원 프로필 사진", example = "시동냥이.jpg")
	private String memberThumb;
	@Schema(description = "채팅방 안읽은 채팅 갯수", example = "1")
	private int unreadCount;
}

