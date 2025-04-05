package kr.co.fithub.dm.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DmDto {
	private String type;
	private int senderNo;   // 보낸 사람 회원번호
    private int receiverNo; // 받는 사람 회원번호
	private String message;
}
