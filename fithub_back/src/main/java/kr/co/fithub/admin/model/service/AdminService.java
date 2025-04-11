package kr.co.fithub.admin.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.admin.model.dao.AdminDao;
import kr.co.fithub.admin.model.dto.AdsDTO;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.PageInfo;
import kr.co.fithub.util.PageInfoUtil;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;
	@Autowired
	private PageInfoUtil pageInfoUtil;

	public Map memberList(int memberPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int memberTotalCount = adminDao.memberTotalCount();
		
		PageInfo memberPi = pageInfoUtil.getPageInfo(memberPage, numPerPage, pageNaviSize, memberTotalCount);
		
		List memberList = adminDao.memberList(memberPi);
		
		Map<String, Object> map = new HashMap<>();
		map.put("memberList", memberList);
		map.put("memberPi", memberPi);
		return map;
	}
	
	public Map delMemberList(int delMemberPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int delMemberTotalCount = adminDao.delMemberTotalCount();
		
		PageInfo delMemberPi = pageInfoUtil.getPageInfo(delMemberPage, numPerPage, pageNaviSize, delMemberTotalCount);
		List delMemberList = adminDao.delMemberList(delMemberPi);
		
		Map<String, Object> map = new HashMap<>();
		map.put("delMemberList", delMemberList);
		map.put("delMemberPi", delMemberPi);
		return null;
	}
	
	@Transactional
	public int adminMemberChange(String memberId, MemberDTO memberData) {
		memberData.setMemberId(memberId);
		int result = adminDao.adminMemberChange(memberData);
		return result;
	}

	public Map communityList(int communityPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int communityTotalCount = adminDao.communityTotalCount();
		
		PageInfo communityPi = pageInfoUtil.getPageInfo(communityPage, numPerPage, pageNaviSize, communityTotalCount);
		
		List communityList = adminDao.communityList(communityPi);

		Map<String, Object> map = new HashMap<>();
		map.put("communityList", communityList);
		map.put("communityPi", communityPi);
		return map;
	}

	public Map commentList(int commentPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int commentTotalCount = adminDao.commnetTotalCount();
		
		PageInfo commentPi = pageInfoUtil.getPageInfo(commentPage, numPerPage, pageNaviSize, commentTotalCount);
		
		List commentList = adminDao.commentList(commentPi);
		Map<String, Object> map = new HashMap<>();
		map.put("commentList", commentList);
		map.put("commentPi", commentPi);
		return map;
	}
	
	@Transactional
	public int writeAds(AdsDTO ads) {
		int result = adminDao.writeAds(ads);
		return result;
	}

	public List getAds() {
		List list = adminDao.getAds();
		return list;
	}
	
	
}
