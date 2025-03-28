package kr.co.fithub.community.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.community.model.dao.CommunityDao;
import kr.co.fithub.community.model.dto.CommunityDTO;

@Service
public class CommunityService {
	@Autowired
	private CommunityDao communityDao;

	public List selectCommunityList(String memberId) {
		int memberNo = communityDao.selectMemberNo(memberId);
		List list = communityDao.selectCommunityList(memberNo);

		return list;
	}

	public CommunityDTO selectOneCommunity(int communityNo) {
		CommunityDTO c = communityDao.selectOneCommunity(communityNo);
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
}
