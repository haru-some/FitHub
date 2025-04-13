package kr.co.fithub.member.controller;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
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
import io.swagger.v3.oas.annotations.media.ExampleObject;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.service.MemberService;
import kr.co.fithub.util.FileUtils;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.member.model.dto.MemberDTO;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
@Tag(name = "01. 회원 API", description = "회원 관련 기능")
public class MemberController {
	@Autowired
	private MemberService memberService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@Operation(summary = "회원가입", description = "회원 정보를 받아서 가입 처리합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "가입 성공")
	})
	@PostMapping
	public ResponseEntity<Integer> joinMember(@RequestBody MemberDTO member) {
		int result = memberService.joinMember(member);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "아이디 중복 확인", description = "입력한 아이디가 이미 사용 중인지 확인합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "중복 여부 확인 성공")
	})
	@GetMapping(value="/exists/id")
	public ResponseEntity<Integer> existsId(@Parameter(description = "중복 확인할 아이디", example = "fithub123")
											@RequestParam String memberId){
		int result = memberService.existsId(memberId);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "이메일 중복 확인", description = "입력한 이메일이 이미 사용 중인지 확인합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "중복 여부 확인 성공")
	})
	@GetMapping("/exists/email")
	public ResponseEntity<Integer> existsEmail(@Parameter(description = "중복 확인할 이메일", example = "user@example.com")
												@RequestParam String memberEmail) {
	    int result = memberService.existsEmail(memberEmail);
	    return ResponseEntity.ok(result);
	}
	
	@Operation(
	    summary = "로그인",
	    description = "아이디와 비밀번호를 입력받아 로그인 처리 후 회원 정보를 반환합니다.",
	    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
	        description = "로그인 요청 바디",
	        required = true,
	        content = @Content(schema = @Schema(implementation = MemberDTO.class))
	    )
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "로그인 성공"),
	    @ApiResponse(responseCode = "404", description = "아이디 또는 비밀번호 불일치",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "아이디 또는 비밀번호가 올바르지 않습니다.")
	        )
	    )
	})
	@PostMapping(value="/login")
	public ResponseEntity<MemberDTO> login(@RequestBody MemberDTO member){
		MemberDTO memberInfo = memberService.login(member);
		if(memberInfo != null) {
			return ResponseEntity.ok(memberInfo);
		}else {
			return ResponseEntity.status(404).build();
		}
	}
	
	@Operation(
	    summary = "회원 정보 조회",
	    description = "회원 ID와 Access Token을 이용하여 회원 정보를 조회합니다."
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "회원 정보 조회 성공"),
	    @ApiResponse(responseCode = "404", description = "해당 회원 없음",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "해당 회원을 찾을 수 없습니다.")
	        )
	    )
	})
	@GetMapping(value="/{memberId}")
	public ResponseEntity<MemberDTO> selectOneMember(@Parameter(description = "조회할 회원 ID", example = "fithub123")
												    @PathVariable String memberId,
												    @Parameter(description = "Access Token (Bearer 형식)", example = "Bearer eyJhbGciOiJIUzI1NiIs...")
												    @RequestHeader("Authorization") String accessToken){
		MemberDTO m = memberService.selectOneMember(memberId, accessToken);
		return ResponseEntity.ok(m);
	}
	
	@Operation(
	    summary = "Access Token 재발급",
	    description = "Refresh Token을 이용해 새로운 Access Token과 회원 정보를 반환합니다."
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "재발급 성공"),
	    @ApiResponse(responseCode = "401", description = "Refresh Token이 유효하지 않음",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "Refresh Token이 유효하지 않습니다.")
	        )
	    )
	})
	@GetMapping(value="/refresh")
	public ResponseEntity<MemberDTO> refresh(@Parameter(description = "Refresh Token (Bearer 형식)", example = "Bearer eyJhbGciOiJIUzI1NiIs...")
    										@RequestHeader("Authorization") String refreshToken){
		MemberDTO loginMember = memberService.refresh(refreshToken);
		return ResponseEntity.ok(loginMember);
	}
	
	@Operation(
	    summary = "회원 정보 수정",
	    description = "회원 정보를 수정합니다. 프로필 이미지(thumbnail)는 선택적으로 첨부할 수 있습니다."
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "회원 정보 수정 성공"),
	    @ApiResponse(responseCode = "500", description = "회원 정보 수정 실패 또는 서버 오류",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "회원 정보 수정에 실패했습니다.")
	        )
	    )
	})
	@PatchMapping
	public ResponseEntity<String> updateMember(
	    @Parameter(description = "회원 정보 (form-data 형식)", required = true, schema = @Schema(implementation = MemberDTO.class))
	    @ModelAttribute MemberDTO member,

	    @Parameter(description = "새 프로필 이미지 (선택)", required = false)
	    @RequestParam(required = false) MultipartFile thumbnail) {
	    
	    try {
	        MemberDTO origin = memberService.findByMemberId(member.getMemberId());

	        // 1. 클라이언트에서 삭제 의도 시
	        if ("null".equals(member.getMemberThumb())) {
	            // 기존 이미지가 있으면 삭제
	            if (origin.getMemberThumb() != null && !origin.getMemberThumb().isEmpty()) {
	                String savepath = root + "/member/profileimg/";
	                File file = new File(savepath + origin.getMemberThumb());
	                if (file.exists()) file.delete();
	            }
	            member.setMemberThumb(null); // DB에 null로 저장
	        }

	        // 2. 새 이미지 업로드 시
	        else if (thumbnail != null && !thumbnail.isEmpty()) {
	            // 기존 이미지가 있으면 삭제
	            if (origin.getMemberThumb() != null && !origin.getMemberThumb().isEmpty()) {
	                String savepath = root + "/member/profileimg/";
	                File file = new File(savepath + origin.getMemberThumb());
	                if (file.exists()) file.delete();
	            }

	            String savepath = root + "/member/profileimg/";
	            String filepath = fileUtils.upload(savepath, thumbnail);
	            member.setMemberThumb(filepath); // DB에 새 이미지 경로 저장
	        }

	        // 3. 아무것도 안 보내면 기존 이미지 유지 → 현재 DB의 memberThumb 그대로 사용
	        else {
	            member.setMemberThumb(origin.getMemberThumb());
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
	
	@Operation(
	    summary = "회원 탈퇴",
	    description = "회원 ID를 통해 해당 회원을 탈퇴 처리합니다."
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공"),
	    @ApiResponse(responseCode = "500", description = "회원 탈퇴 실패",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "회원 탈퇴에 실패했습니다.")
	        )
	    )
	})
	@DeleteMapping("/{memberId}")
	public ResponseEntity<String> deleteMember(
	    @PathVariable String memberId,
	    @RequestParam(required = false) String adminId,
	    HttpServletRequest request
	) {
	    String delIp = request.getRemoteAddr();

	    int result = memberService.deleteMember(memberId, delIp, adminId);
	    if (result > 0) {
	        return ResponseEntity.ok("회원 탈퇴 성공");
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("회원 탈퇴 실패");
	    }
	}
	
	@Operation(
	    summary = "비밀번호 확인",
	    description = "회원 ID와 비밀번호를 받아 현재 비밀번호가 일치하는지 확인합니다.",
	    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
	        description = "회원 ID와 입력한 비밀번호",
	        required = true,
	        content = @Content(schema = @Schema(implementation = MemberDTO.class))
	    )
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "비밀번호 일치 여부 확인 성공"),
	    @ApiResponse(responseCode = "400", description = "요청 데이터 오류")
	})
	@PostMapping(value="/check-pw")
	public ResponseEntity<Integer> checkPw(@RequestBody MemberDTO member){
		int result = memberService.checkPw(member);
		return ResponseEntity.ok(result);
	}
	
	@Operation(
	    summary = "비밀번호 변경",
	    description = "회원 ID와 새로운 비밀번호를 입력받아 비밀번호를 변경합니다.",
	    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
	        description = "비밀번호 변경 요청 바디 (회원 ID와 새 비밀번호)",
	        required = true,
	        content = @Content(schema = @Schema(implementation = MemberDTO.class))
	    )
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
	    @ApiResponse(responseCode = "400", description = "요청 데이터 오류"),
	    @ApiResponse(responseCode = "500", description = "서버 오류",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "서버 오류 발생")
	        )
	    )
	})
	@PatchMapping(value="/change-pw")
	public ResponseEntity<Integer> changePw(@RequestBody MemberDTO member){
		int result = memberService.changePw(member);
		return ResponseEntity.ok(result);
	}
	
	@Operation(
	    summary = "아이디 찾기",
	    description = "회원 이름과 이메일을 입력받아 해당 조건에 맞는 회원 아이디를 반환합니다.",
	    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
	        description = "회원 이름과 이메일 정보",
	        required = true,
	        content = @Content(schema = @Schema(implementation = MemberDTO.class))
	    )
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "아이디 찾기 성공"),
	    @ApiResponse(responseCode = "404", description = "일치하는 회원 없음",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "일치하는 회원이 없습니다.")
	        )
	    )
	})
	@PostMapping(value = "/find-id")
	public ResponseEntity<?> findId(@RequestBody MemberDTO member) {
	    String name = member.getMemberName();
	    String email = member.getMemberEmail();
	    List<MemberDTO> members = memberService.findIdsByNameAndEmail(name, email);

	    if (members.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 회원이 없습니다.");
	    }
	    List<String> memberIds = members.stream()
	                                    .map(MemberDTO::getMemberId)
	                                    .toList();
	    return ResponseEntity.ok(memberIds);
	}
	
	@Operation(
	    summary = "비밀번호 찾기",
	    description = "회원 ID와 이메일을 입력받아 임시 비밀번호를 전송합니다.",
	    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
	        description = "비밀번호 찾기 요청 바디 (회원 ID, 이메일)",
	        required = true,
	        content = @Content(schema = @Schema(implementation = MemberDTO.class))
	    )
	)
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "임시 비밀번호 전송 성공"),
	    @ApiResponse(responseCode = "404", description = "일치하는 회원 없음",
	        content = @Content(
	            mediaType = "text/plain",
	            examples = @ExampleObject(value = "일치하는 회원이 없습니다.")
	        )
	    )
	})
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
	
	//예외 핸들러
	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<String> handleIllegalState(IllegalStateException e) {
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	}
}
