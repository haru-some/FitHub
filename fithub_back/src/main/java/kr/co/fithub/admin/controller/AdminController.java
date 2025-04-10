package kr.co.fithub.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.fithub.admin.model.dto.AdsDTO;
import kr.co.fithub.admin.model.service.AdminService;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/admin")
@Tag(name = "04. 관리자 페이지 API", description = "관리자 관련 기능")
public class AdminController {
	@Autowired
	private AdminService adminService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
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
	
	@Operation(summary = "광고 추가", description = "광고를 추가합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 등록 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 등록 실패")
	})
	@PostMapping("/writeAds")
	public ResponseEntity<Integer> writeAds(@RequestParam("adsName") String adsName, @RequestParam("adsLink") String adsLink, @RequestParam("adsType") String adsType, @RequestParam(value = "adsImg", required = false) MultipartFile adsImg) {	    
        AdsDTO ads = new AdsDTO();
        ads.setAdsName(adsName);
        ads.setAdsLink(adsLink);

        if (adsImg != null && !adsImg.isEmpty()) {
            String savePath = root + "/ads/img/";
            String filePath = fileUtils.upload(savePath, adsImg);
            ads.setAdsImg(filePath); // DB에 저장할 이미지 경로
        }

        int result = adminService.writeAds(ads);
        return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "광고 조회", description = "광고를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/getAds")
	public ResponseEntity<List> getAds() {
		List list = adminService.getAds();
		return ResponseEntity.ok(list);
	}
	
	
}
