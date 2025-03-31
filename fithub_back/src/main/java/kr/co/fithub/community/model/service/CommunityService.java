package kr.co.fithub.community.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.community.model.dao.CommunityDao;
import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.util.JwtUtils;

@Service
public class CommunityService {
	@Autowired
	private CommunityDao communityDao;
	@Autowired
	private JwtUtils jwtUtil;

	public List selectCommunityList(int memberNo) {
		List list = communityDao.selectCommunityList(memberNo);
		
		
		return list;
	}

	public CommunityDTO selectOneCommunity(int communityNo, int memberNo) {
		HashMap<String, Integer> map = new HashMap<>();
		map.put("communityNo", communityNo);
		map.put("memberNo", memberNo);
		CommunityDTO c = communityDao.selectOneCommunity(map);
		CommentDTO com = communityDao.selectCommentList(communityNo);
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
}
