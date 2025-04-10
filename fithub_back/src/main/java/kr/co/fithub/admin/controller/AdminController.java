package kr.co.fithub.admin.controller;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.fithub.admin.model.service.AdminService;
import kr.co.fithub.member.model.dto.MemberDTO;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/admin")
@Tag(name = "04. 관리자 페이지 API", description = "관리자 관련 기능")
public class AdminController {
	@Autowired
	private AdminService adminService;
	
	@Operation(summary = "전체 회원 조회", description = "모든 회원 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/memberList")
	public ResponseEntity<Map> memberList(@RequestParam int memberPage) {
		Map map = adminService.memberList(memberPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 탈퇴한 회원 조회", description = "모든 탈퇴한 회원 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/delMemberList")
	public ResponseEntity<Map> delMemberList(@RequestParam int delMemberPage) {
		Map map = adminService.delMemberList(delMemberPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 게시글 조회", description = "모든 게시글 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/communityList")
	public ResponseEntity<Map> communityList(@RequestParam int communityPage) {
		Map map = adminService.communityList(communityPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 댓글 조회", description = "모든 댓글 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/commentList")
	public ResponseEntity<Map> commentList(@RequestParam int commentPage) {
		Map map = adminService.commentList(commentPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "회원 정보 수정", description = "회원 정보를 수정합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "수정 성공")
	})
	@PatchMapping("/member/{memberId}")
	public ResponseEntity<Integer> adminMemberChange(@PathVariable String memberId, @RequestBody MemberDTO memberData) {
		System.out.println(memberData);
		int result = adminService.adminMemberChange(memberId, memberData);
		return ResponseEntity.ok(result);
	}
	
	
}
