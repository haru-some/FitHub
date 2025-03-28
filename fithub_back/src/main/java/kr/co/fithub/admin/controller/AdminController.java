package kr.co.fithub.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.admin.model.service.AdminService;
import kr.co.fithub.member.model.dto.MemberDTO;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/admin")
public class AdminController {
	@Autowired
	private AdminService adminService;
	
	@GetMapping("/member")
	public ResponseEntity<List<MemberDTO>> memberList() {
		List list = adminService.memberList();
		return ResponseEntity.ok(list);
	}

	@PatchMapping("/member/{memberId}")
	public ResponseEntity<Integer> adminMemberChange(@PathVariable String memberId, @RequestBody MemberDTO memberData) {
		System.out.println(memberData);
		int result = adminService.adminMemberChange(memberId, memberData);
		return ResponseEntity.ok(result);
	}
}
