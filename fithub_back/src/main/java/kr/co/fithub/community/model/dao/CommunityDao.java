package kr.co.fithub.community.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.community.model.dto.CommunityDTO;


@Mapper
public interface CommunityDao {

	List selectCommunityList(int memberNo);

	CommunityDTO selectOneCommunity(int communityNo);


	int selectMemberNo(String memberId);

	int deleteLike(HashMap<String, Integer> map);

	int selectLikeCount(int communityNo);

	int insertLike(HashMap<String, Integer> map);
	
}
