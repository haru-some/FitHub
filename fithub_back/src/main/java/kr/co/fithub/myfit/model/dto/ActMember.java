package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="actMember")
public class ActMember {
	private int memberNo;
	private String memberName;
	private String memberThumb;
	private String memberId;
	private int followingCount;
	private int followerCount;
	private int communityCount;		   //게시물 갯수
	private int totalRecordDays;		//총 운동 일수
	private int totalRecordTime;		//총 운동 시간(분)
	private int weekRecordDays;			//최근 일주일간 운동 일
	private int weekRecordTime;			//최근 일주일간 운동 시간(분)
}
