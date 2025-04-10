package kr.co.fithub.community.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="comment")
@Schema(description = "댓글 정보 DTO")
public class CommentDTO {
	@Schema(description = "댓글 번호", example = "1")
	private int commentNo;
	@Schema(description = "커뮤니티 번호", example = "1")
	private int communityNo;
	@Schema(description = "회원 번호", example = "1")
	private int memberNo;
	@Schema(description = "댓글 내용", example = "진짜 멋있어요")
	private String commentContent;
	@Schema(description = "댓글 작성 날짜", example = "2025-04-10")
	private String commentDate;
	@Schema(description = "아이디", example = "Allright24")
	private String memberId;
	@Schema(description = "프로필 이미지 파일명", example = "profile1.png")
	private String memberThumb;
}
