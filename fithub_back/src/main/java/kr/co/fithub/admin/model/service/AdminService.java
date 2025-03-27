package kr.co.fithub.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.admin.model.dao.AdminDao;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	public List memberList() {
		List list = adminDao.memberList();
		return list;
	}
}
