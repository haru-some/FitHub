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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.admin.model.service.AdminService;
import kr.co.fithub.member.model.dto.DelMemberDTO;
import kr.co.fithub.member.model.dto.MemberDTO;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/admin")
public class AdminController {
	@Autowired
	private AdminService adminService;
	
	@GetMapping("/memberList")
	public ResponseEntity<Map> memberList(@RequestParam int memberPage) {
		Map map = adminService.memberList(memberPage);
		return ResponseEntity.ok(map);
	}
	@GetMapping("/delMemberList")
	public ResponseEntity<Map> delMemberList(@RequestParam int delMemberPage) {
		Map map = adminService.delMemberList(delMemberPage);
		return ResponseEntity.ok(map);
	}
	
	
	@GetMapping("/boardList")
	public ResponseEntity<Map> boardList(@RequestParam int communityPage, @RequestParam int commentPage) {
		Map map = adminService.boardList(communityPage, commentPage);
		return ResponseEntity.ok(map);
	}

	@PatchMapping("/member/{memberId}")
	public ResponseEntity<Integer> adminMemberChange(@PathVariable String memberId, @RequestBody MemberDTO memberData) {
		System.out.println(memberData);
		int result = adminService.adminMemberChange(memberId, memberData);
		return ResponseEntity.ok(result);
	}
	
	
}
