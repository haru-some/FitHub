package kr.co.fithub.member.controller;

import java.io.File;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.fithub.member.model.service.MemberService;
import kr.co.fithub.util.FileUtils;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.member.model.dto.MemberDTO;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
public class MemberController {
	@Autowired
	private MemberService memberService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@PostMapping
	public ResponseEntity<Integer> joinMember(@RequestBody MemberDTO member) {
		int result = memberService.joinMember(member);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/exists")
	public ResponseEntity<Integer> exists(@RequestParam String memberId){
		int result = memberService.exists(memberId);
		return ResponseEntity.ok(result);
	}
	@GetMapping("/exists/email")
	public ResponseEntity<Integer> existsEmail(@RequestParam String memberEmail) {
	    int result = memberService.existsEmail(memberEmail);
	    return ResponseEntity.ok(result);
	}
	@PostMapping(value="/login")
	public ResponseEntity<MemberDTO> login(@RequestBody MemberDTO member){
		MemberDTO memberInfo = memberService.login(member);
		if(memberInfo != null) {
			return ResponseEntity.ok(memberInfo);
		}else {
			return ResponseEntity.status(404).build();
		}
	}
	@GetMapping(value="/{memberId}")
	public ResponseEntity<MemberDTO> selectOneMember(@PathVariable String memberId, @RequestHeader("Authorization") String accessToken){
		MemberDTO m = memberService.selectOneMember(memberId, accessToken);
		return ResponseEntity.ok(m);
	}
	@GetMapping(value="/refresh")
	public ResponseEntity<MemberDTO> refresh(@RequestHeader("Authorization") String refreshToken){
		MemberDTO loginMember = memberService.refresh(refreshToken);
		return ResponseEntity.ok(loginMember);
	}
	@PatchMapping
	public ResponseEntity<String> updateMember(
	        @ModelAttribute MemberDTO member,
	        @RequestParam(required = false) MultipartFile thumbnail) {
	    try {
	    	if ("null".equals(member.getMemberThumb())) {
	    	    member.setMemberThumb(null);
	    	}
	        if (thumbnail != null && !thumbnail.isEmpty()) {
	            String savepath = root + "/member/profileimg/";
				String filepath = fileUtils.upload(savepath, thumbnail);
				member.setMemberThumb(filepath);
	        } 
	        int result = memberService.updateMember(member);
	        if (result > 0) {
	            return ResponseEntity.ok("회원 정보가 수정되었습니다.");
	        } else {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("회원 정보 수정 실패");
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("서버 오류 발생");
	    }
	}
	@DeleteMapping(value="/profileimg")
	public ResponseEntity<String> deleteProfileImage(@RequestParam String memberId) {
		MemberDTO member = memberService.findByMemberId(memberId);
		if (member == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보 없음");
		}
		String fileName = member.getMemberThumb();
		member.setMemberThumb(null);
		memberService.updateMember(member);
		if (fileName != null && !fileName.isEmpty()) {
			if (fileName.contains("..")) {
				return ResponseEntity.badRequest().body("잘못된 파일명입니다.");
			}
			String savepath = root + "/member/profileimg/";
			File file = new File(savepath  + fileName);
			if (file.exists()) {
				file.delete();
			}else {
				System.out.println("파일이 존재하지 않음: " + file.getPath());
			}
		}
		return ResponseEntity.ok("프로필 이미지 삭제 완료");
	}
	@DeleteMapping(value="/{memberId}")
	public ResponseEntity<String> deleteMember(@PathVariable String memberId) {
	    int result = memberService.deleteMember(memberId);
	    if (result > 0) {
	        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴에 실패했습니다.");
	    }
	}
	@PostMapping(value="/pw-check")
	public ResponseEntity<Integer> checkPw(@RequestBody MemberDTO member){
		int result = memberService.checkPw(member);
		return ResponseEntity.ok(result);
	}
	@PatchMapping(value="/memberPw")
	public ResponseEntity<Integer> changePw(@RequestBody MemberDTO member){
		int result = memberService.changePw(member);
		return ResponseEntity.ok(result);
	}
	@PostMapping(value="/find-id")
	public ResponseEntity<String> findId(@RequestBody MemberDTO member) {
		String name = member.getMemberName();
		String email = member.getMemberEmail();
	    MemberDTO m = memberService.findIdByNameAndEmail(name, email);
	    if (m != null) {
	        return ResponseEntity.ok(m.getMemberId());
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 회원이 없습니다.");
	    }
	}
	@PostMapping(value="/find-pw")
	public ResponseEntity<String> findPw(@RequestBody MemberDTO member) {
	    String memberId = member.getMemberId();
	    String memberEmail = member.getMemberEmail();
	    boolean result = memberService.sendTempPasswordByIdAndEmail(memberId, memberEmail);
	    if (result) {
	        return ResponseEntity.ok("임시 비밀번호가 전송되었습니다.");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 회원이 없습니다.");
	    }
	}
}
