package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "actMember")
@Schema(description = "활동 회원 정보 DTO")
public class ActMember {

    @Schema(description = "회원 번호", example = "101")
    private int memberNo;

    @Schema(description = "회원 이름", example = "홍길동")
    private String memberName;

    @Schema(description = "프로필 이미지 파일명", example = "profile1.png")
    private String memberThumb;

    @Schema(description = "회원 ID", example = "hong1234")
    private String memberId;

    @Schema(description = "팔로잉 수", example = "12")
    private int followingCount;

    @Schema(description = "팔로워 수", example = "30")
    private int followerCount;

    @Schema(description = "작성한 커뮤니티 게시물 수", example = "5")
    private int communityCount;

    @Schema(description = "총 운동 기록 일수", example = "20")
    private int totalRecordDays;

    @Schema(description = "총 운동 기록 시간 (분 단위)", example = "980")
    private int totalRecordTime;

    @Schema(description = "최근 일주일간 운동 일 수", example = "3")
    private int weekRecordDays;

    @Schema(description = "최근 일주일간 운동 시간 (분 단위)", example = "210")
    private int weekRecordTime;

    @Schema(description = "팔로우 여부 (0: 안함, 1: 팔로우 중)", example = "1")
    private int isFollow;
    
    private String memberProfile;
    
    private String delStatus;
}
