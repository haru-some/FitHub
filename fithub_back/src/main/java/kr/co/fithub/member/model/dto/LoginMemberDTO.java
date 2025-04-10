package kr.co.fithub.member.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "로그인 후 반환되는 회원 인증 정보 DTO")
public class LoginMemberDTO {
    @Schema(description = "Access Token (JWT)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    @Schema(description = "Refresh Token (JWT)", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String refreshToken;
    @Schema(description = "회원 아이디", example = "fithub123")
    private String memberId;
    @Schema(description = "회원 등급 (1: 관리자, 2: 일반회원)", example = "2")
    private int memberLevel;
}