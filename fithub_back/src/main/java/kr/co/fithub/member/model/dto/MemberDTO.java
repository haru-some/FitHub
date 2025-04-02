package kr.co.fithub.member.model.dto;

import org.apache.ibatis.type.Alias;

import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
public class MemberDTO {
	private int memberNo;              // 회원번호(PK)
    private String memberName;         // 이름
    private String memberId;           // 아이디
    private String memberPw;           // 비밀번호
    private String memberEmail;        // 이메일
    private String memberAddr;         // 주소
    private String memberPhone;        // 전화번호
    private String memberThumb;        // 프로필사진
    private String memberProfile;      // 자기소개
    private int memberLevel;           // 회원등급 (1:관리자 / 2:일반)
    private int warningLevel;          // 경고등급
    private String delStatus;          // 탈퇴 여부 ('Y'/'N')
    private String loginType;          // 로그인 방식 ('local', 'kakao', 'google')
    private String oauthId;            // 소셜 로그인 식별자
    private String joinDate;		   // 가입일
	private String accessToken;
	private String refreshToken;
	private int isFollow;
}
