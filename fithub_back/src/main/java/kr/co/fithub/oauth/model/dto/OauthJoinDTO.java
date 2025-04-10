package kr.co.fithub.oauth.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "소셜 로그인 회원가입 요청 DTO")
public class OauthJoinDTO {
    @Schema(description = "소셜 로그인 식별자", example = "10382930291202013091230")
    private String oauthId;
    @Schema(description = "로그인 타입 (google, kakao 등)", example = "google")
    private String loginType;
    @Schema(description = "회원 아이디", example = "fithub_social")
    private String memberId;
    @Schema(description = "회원 이름", example = "최소셜")
    private String name;
    @Schema(description = "전화번호", example = "010-5678-1234")
    private String phone;
    @Schema(description = "주소", example = "서울특별시 중구 세종대로 110")
    private String address;
    @Schema(description = "이메일", example = "socialuser@gmail.com")
    private String email;
}