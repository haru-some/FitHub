package kr.co.fithub.community.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.community.model.dao.CommunityDao;
import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.util.JwtUtils;
import kr.co.fithub.util.PageInfoUtil;

@Service
public class CommunityService {
	@Autowired
	private CommunityDao communityDao;
	@Autowired
	private JwtUtils jwtUtil;
	@Autowired
	private PageInfoUtil pageInfoUtil;

	public List selectCommunityList(int memberNo, int page, int size) {		
		int startRow = (page - 1) * size + 1;
		int endRow = page * size;
 		Map<String, Object> map = new HashMap<>();
        map.put("memberNo", memberNo);
        map.put("startRow", startRow);
        map.put("endRow", endRow);

		List list = communityDao.selectCommunityList(map);
		return list;
	}

	public CommunityDTO selectOneCommunity(int communityNo, int memberNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("communityNo", communityNo);
		map.put("memberNo", memberNo);
		CommunityDTO c = communityDao.selectOneCommunity(map);
		List<CommentDTO> commentList = communityDao.selectCommentList(communityNo);
		c.setCommentList(commentList);
		return c;
	}	
	
	@Transactional
	public int deleteLike(int memberNo, int communityNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("communityNo", communityNo);
		int result = communityDao.deleteLike(map);		
		int likeCount = communityDao.selectLikeCount(communityNo);
		return likeCount;
	}

	@Transactional
	public int insertLike(int memberNo, int communityNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("communityNo", communityNo);		
		int result = communityDao.insertLike(map);
		int likeCount = communityDao.selectLikeCount(communityNo);
		return likeCount;
	}

	@Transactional
	public int insertCommunity(CommunityDTO community) {
		int result = communityDao.insertCommunity(community);
		return result;
	}

	@Transactional
	public int deleteFollow(int memberNo, int followMemberNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("followMemberNo", followMemberNo);
		int result = communityDao.deleteFollow(map);
		return result;
	}

	@Transactional
	public int insertFollow(int memberNo, int followMemberNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("followMemberNo", followMemberNo);
		int result = communityDao.insertFollow(map);
		return result;
	}

	@Transactional
	public int insertComment(CommentDTO comment) {
		int result = communityDao.insertComment(comment);
		return result;
	}
	
	@Transactional
	public CommunityDTO deleteCommunity(int communityNo, int page, int memberNo) {
		
		int result = communityDao.deleteCommunity(communityNo);
		int endRow = page * 10;
		HashMap<String, Integer> map = new HashMap<>();
		map.put("endRow", endRow);
		map.put("memberNo", memberNo);
		
		CommunityDTO community = communityDao.selectCommunity(map);
		return community;
	}
	
	@Transactional
	public int updateCommunity(CommunityDTO community) {
		int result = communityDao.updateCommunity(community);
		return result;
	}

	
}
