package kr.co.fithub.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
@Schema(description = "회원 정보 DTO")
public class MemberDTO {
    @Schema(description = "회원 번호", example = "1")
    private int memberNo;
    @Schema(description = "이름", example = "최승현")
    private String memberName;
    @Schema(description = "아이디", example = "fithub123")
    private String memberId;
    @Schema(description = "비밀번호", example = "securePassword123!")
    private String memberPw;
    @Schema(description = "이메일", example = "fithub@example.com")
    private String memberEmail;
    @Schema(description = "주소", example = "서울특별시 강남구 역삼동 123-45")
    private String memberAddr;
    @Schema(description = "전화번호", example = "010-1234-5678")
    private String memberPhone;
    @Schema(description = "프로필 이미지 파일명", example = "profile1.png")
    private String memberThumb;
    @Schema(description = "자기소개", example = "운동을 사랑하는 개발자입니다.")
    private String memberProfile;
    @Schema(description = "회원 등급 (1: 관리자, 2: 일반회원)", example = "2")
    private int memberLevel;
    @Schema(description = "경고 등급", example = "0")
    private int warningLevel;
    @Schema(description = "탈퇴 여부 (Y/N)", example = "N")
    private String delStatus;
    @Schema(description = "로그인 방식 (local, kakao, google)", example = "local")
    private String loginType;
    @Schema(description = "소셜 로그인 식별자", example = "1234567890")
    private String oauthId;
    @Schema(description = "가입일", example = "2024-03-01")
    private String joinDate;
    @Schema(description = "Access Token", example = "eyJhbGciOiJIUzI1NiIsInR...")
    private String accessToken;
    @Schema(description = "Refresh Token", example = "eyJhbGciOiJIUzI1NiIsInR... (long-lived)")
    private String refreshToken;
    @Schema(description = "팔로우 여부 (1: 팔로잉 중, 0: 아님)", example = "1")
    private int isFollow;
}