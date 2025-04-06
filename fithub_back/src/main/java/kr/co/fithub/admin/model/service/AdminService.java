package kr.co.fithub.admin.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.admin.model.dao.AdminDao;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.PageInfo;
import kr.co.fithub.util.PageInfoUtil;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;
	@Autowired
	private PageInfoUtil pageInfoUtil;

	public Map memberList(int memberPage, int delMemberPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int memberTotalCount = adminDao.memberTotalCount();
		int delMemberTotalCount = adminDao.delMemberTotalCount();
		
		PageInfo memberPi = pageInfoUtil.getPageInfo(memberPage, numPerPage, pageNaviSize, memberTotalCount);
		PageInfo delMemberPi = pageInfoUtil.getPageInfo(delMemberPage, numPerPage, pageNaviSize, delMemberTotalCount);
		
		List memberList = adminDao.memberList();
		List delMemberList = adminDao.delMemberList();
		
		Map<String, Object> map = new HashMap<>();
		map.put("memberList", memberList);
		map.put("delMemberList", delMemberList);
		map.put("memberPi", memberPi);
		map.put("delMemberPi", delMemberPi);
		return map;
	}
	
	@Transactional
	public int adminMemberChange(String memberId, MemberDTO memberData) {
		memberData.setMemberId(memberId);
		int result = adminDao.adminMemberChange(memberData);
		return result;
	}

	public Map boardList(int communityPage, int commentPage) {
		int numPerPage = 6;
		int pageNaviSize = 5;
		int communityTotalCount = adminDao.communityTotalCount();
//		int commentTotalCount = adminDao.commnetTotalCount();
		
		PageInfo communityPi = pageInfoUtil.getPageInfo(communityPage, numPerPage, pageNaviSize, communityTotalCount);
//		PageInfo commentPi = pageInfoUtil.getPageInfo(commentPage, numPerPage, pageNaviSize, commentTotalCount);
		
		List communityList = adminDao.communityList();
//		List commentList = adminDao.commentList();
		
		Map<String, Object> map = new HashMap<>();
		map.put("communityList", communityList);
//		map.put("commentList", commentList);
		map.put("communityPi", communityPi);
//		map.put("commentPi", commentPi);
		return map;
	}
	
}
