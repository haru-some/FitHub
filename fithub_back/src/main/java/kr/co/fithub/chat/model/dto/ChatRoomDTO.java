package kr.co.fithub.chat.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Alias(value="chatRoom")
public class ChatRoomDTO {
	private int chatRoomNo;
	private String chatMemberId;
	private int chatRoomAlarm;
	private String lastMessage;
	private String lastDate;
	private String memberThumb;
	private int unreadCount;
}

