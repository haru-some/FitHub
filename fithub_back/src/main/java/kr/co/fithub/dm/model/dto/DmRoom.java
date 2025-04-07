package kr.co.fithub.dm.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="dmRoom")
public class DmRoom {
	private int dmRoomNo;
	private String member1No;
	private String member2No;
	private String createdAt;
	private String lastMessageAt;
	private int otherMemberNo;
	private String otherMemberId;
	private String otherMemberName;
	private String otherMemberThumb;
	private String lastMessageContent;
	private String lastMessageSentAt;

}
