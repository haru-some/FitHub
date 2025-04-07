package kr.co.fithub.dm.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="dmMessage")
public class DmMessage {
	private int dmMessageNo;
	private int dmRoomNo;
	private int senderNo;
	private String dmContent;
	private String sentAt;
	private String isRead;
}
