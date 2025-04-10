package kr.co.fithub.member.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="delMember")
@Schema(description = "탈퇴한 회원 정보 DTO")
public class DelMemberDTO {
    @Schema(description = "회원 번호", example = "12")
    private int memberNo;
    @Schema(description = "회원 아이디", example = "fithub_exuser")
    private String memberId;
    @Schema(description = "회원 이메일", example = "exuser@example.com")
    private String memberEmail;
    @Schema(description = "가입일", example = "2023-08-15")
    private String joinDate;
    @Schema(description = "탈퇴일", example = "2024-03-01")
    private String delDate;
}