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

	public List selectCommunityList(String accessToken) {
		String memberId = null;
		List list = null;
		if(accessToken != null) {			
			LoginMemberDTO loginMember = jwtUtil.checkToken(accessToken);
			memberId = loginMember.getMemberId();			
			int memberNo = communityDao.selectMemberNo(memberId);
			list = communityDao.selectCommunityList(memberNo);
		}else {
			list = communityDao.selectCommunityList(0);
			
		}
		return list;
	}

	public CommunityDTO selectOneCommunity(int communityNo, String accessToken) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("communityNo", communityNo);
		if(accessToken != null) {			
			LoginMemberDTO loginMember = jwtUtil.checkToken(accessToken);
			map.put("memberId", loginMember.getMemberId());
		}else {			
			map.put("memberId", null);
		}
		CommunityDTO c = communityDao.selectOneCommunity(map);
		CommentDTO com = communityDao.selectCommentList(communityNo);
		return c;
	}	
	
	@Transactional
	public int deleteLike(String memberId, int communityNo) {
		int memberNo = communityDao.selectMemberNo(memberId);
		HashMap<String, Integer> map = new HashMap<>();
		map.put("memberNo", memberNo);
		map.put("communityNo", communityNo);
		int result = communityDao.deleteLike(map);		
		int likeCount = communityDao.selectLikeCount(communityNo);
		return likeCount;
	}

	@Transactional
	public int insertLike(String memberId, int communityNo) {
		int memberNo = communityDao.selectMemberNo(memberId);
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
