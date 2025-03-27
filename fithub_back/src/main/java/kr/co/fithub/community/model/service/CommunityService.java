package kr.co.fithub.community.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.community.model.dao.CommunityDao;
import kr.co.fithub.community.model.dto.CommunityDTO;

@Service
public class CommunityService {
	@Autowired
	private CommunityDao communityDao;

	public List selectCommunityList() {
		List list = communityDao.selectCommunityList();
		return list;
	}

	public CommunityDTO selectOneCommunity(int communityNo) {
		CommunityDTO c = communityDao.selectOneCommunity(communityNo);
		return c;
	}
}
