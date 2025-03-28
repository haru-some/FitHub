package kr.co.fithub.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.admin.model.dao.AdminDao;
import kr.co.fithub.member.model.dto.MemberDTO;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	public List memberList() {
		List list = adminDao.memberList();
		return list;
	}
	
	@Transactional
	public int adminMemberChange(String memberId, MemberDTO memberData) {
		memberData.setMemberId(memberId);
		int result = adminDao.adminMemberChange(memberData);
		return result;
	}
}
