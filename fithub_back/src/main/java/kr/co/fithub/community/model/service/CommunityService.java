package kr.co.fithub.community.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.community.model.dao.CommunityDao;

@Service
public class CommunityService {
	@Autowired
	private CommunityDao communityDao;
}
