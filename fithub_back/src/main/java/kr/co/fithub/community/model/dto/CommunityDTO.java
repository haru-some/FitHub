package kr.co.fithub.community.model.dto;

import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="community")
@Schema(description = "커뮤니티 정보 DTO")
public class CommunityDTO {
	@Schema(description = "커뮤니티 번호", example = "1")
	private int communityNo;
	@Schema(description = "커뮤니티 내용", example = "오늘은 어깨운동 하는 날")
	private String communityContent;
	@Schema(description = "회원 번호", example = "1")
	private String memberNo;
	@Schema(description = "커뮤니티 작성 날짜", example = "2025-04-10")
	private String communityDate;
	@Schema(description = "커뮤니티 공개 여부 (1: 공개, 2: 비공개)", example = "1")
	private int communityStatus;
	@Schema(description = "프로필 이미지 파일명", example = "profile1.png")
	private String memberThumb;
	@Schema(description = "커뮤니티 좋아요 개수", example = "156")
	private int likeCount;
	@Schema(description = "커뮤니티 좋아요 여부 (1: 좋아요 함, 0: 아님)", example = "1")
	private int isLike;
	@Schema(description = "아이디", example = "Allright24")
	private String memberId;
	@Schema(description = "댓글 갯수", example = "56")
	private int commentCount;
	@Schema(description = "팔로우 여부 (1: 팔로잉 중, 0: 아님)", example = "0")
	private int isFollow;
	@Schema(
	    description = "댓글 전체 목록",
	    example = "[{\"commentNo\":1,\"communityNo\":10,\"memberNo\":3,\"commentContent\":\"몸이 좋으세요!\",\"commentDate\":\"2024-04-09\",\"memberId\":\"Allright24\",\"memberThumb\":\"profile1.png\"}]"
	)
	private List<CommentDTO> commentList;
}
