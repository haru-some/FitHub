package kr.co.fithub.community.model.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;


@Mapper
public interface CommunityDao {

	List selectCommunityList(Map<String, Object> map);

	CommunityDTO selectOneCommunity(HashMap<String, Integer> map);

	int deleteLike(HashMap<String, Integer> map);

	int selectLikeCount(int communityNo);

	int insertLike(HashMap<String, Integer> map);

	int insertCommunity(CommunityDTO community);

	int deleteFollow(HashMap<String, Integer> map);

	int insertFollow(HashMap<String, Integer> map);

	List<CommentDTO> selectCommentList(int communityNo);

	int insertComment(CommentDTO comment);

	int totalCount();

	int deleteCommunity(int communityNo);

	int updateCommunity(CommunityDTO community);

	CommunityDTO selectCommunity(HashMap<String, Integer> map);

	int deleteComment(int commentNo);

	int updateComment(CommentDTO comment);
	
}
