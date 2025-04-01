package kr.co.fithub.community.model.dao;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;


@Mapper
public interface CommunityDao {

	List selectCommunityList(int memberNo);

	CommunityDTO selectOneCommunity(HashMap<String, Integer> map);


	int deleteLike(HashMap<String, Integer> map);

	int selectLikeCount(int communityNo);

	int insertLike(HashMap<String, Integer> map);

	CommentDTO selectCommentList(int communityNo);

	int insertCommunity(CommunityDTO community);

	int deleteFollow(HashMap<String, Integer> map);

	int insertFollow(HashMap<String, Integer> map);
	
}
