package kr.co.fithub.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
	
	@PostMapping(value="/login")
	public ResponseEntity<LoginMemberDTO> login(@RequestBody MemberDTO member){
		LoginMemberDTO loginMember = memberService.login(member);
		if(loginMember != null) {
			return ResponseEntity.ok(loginMember);
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
	public ResponseEntity<LoginMemberDTO> refresh(@RequestHeader("Authorization") String refreshToken){
		LoginMemberDTO loginMember = memberService.refresh(refreshToken);
		return ResponseEntity.ok(loginMember);
	}
	
	@PatchMapping(value="/{memberId}")
	public ResponseEntity<Integer> updateMember(@PathVariable String memberId, 
												@ModelAttribute MultipartFile thumbnail,
												@ModelAttribute MemberDTO member){
		if(thumbnail != null) {
			String savepath = root + "/member/thumb/";
			String filepath = fileUtils.upload(savepath, thumbnail);
			member.setMemberThumb(filepath);
		}
		int result = memberService.updateMember(member);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value="/{memberId}")
	public ResponseEntity<Integer> deleteMember(@PathVariable String memberId){
		int result = memberService.deleteMember(memberId);
		return ResponseEntity.ok(result);
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
}
