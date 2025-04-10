package kr.co.fithub.admin.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.admin.model.dto.AdsDTO;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.PageInfo;

@Mapper
public interface AdminDao {

	List memberList(PageInfo memberPi);

	int adminMemberChange(MemberDTO memberData);

	List delMemberList(PageInfo delMemberPi);

	List communityList(PageInfo communityPi);

	List commentList(PageInfo commentPi);

	int memberTotalCount();

	int delMemberTotalCount();

	int communityTotalCount();

	int commnetTotalCount();

	int writeAds(AdsDTO ads);

	List getAds();

}
