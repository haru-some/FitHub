package kr.co.fithub.member.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="delMember")
public class DelMemberDTO {
	private int memberNo;
	private String memberId;
	private String memberEmail;
	private String joinDate;
	private String delDate;
}
