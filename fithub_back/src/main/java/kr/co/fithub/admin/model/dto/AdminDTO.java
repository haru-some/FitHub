package kr.co.fithub.admin.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="admin")
@Schema(description = "관리자 정보 DTO")
public class AdminDTO {
	@Schema(description = "정회원 수", example = "1")
    private int memberCount;
    @Schema(description = "관리자 수", example = "1")
    private int adminCount;
    @Schema(description = "탈퇴한 회원 수", example = "1")
    private int delMemberCount;
    @Schema(description = "차단된 회원 수", example = "1")
    private int kickMemberCount;
}
