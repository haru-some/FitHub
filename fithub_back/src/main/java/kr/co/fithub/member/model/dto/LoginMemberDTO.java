package kr.co.fithub.member.model.dto;

import kr.co.fithub.member.model.dto.LoginMemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginMemberDTO {
	private String accessToken;
	private String refreshToken;
	private String memberId;
	private int memberLevel;
}