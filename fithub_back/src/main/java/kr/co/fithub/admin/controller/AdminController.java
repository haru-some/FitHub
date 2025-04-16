package kr.co.fithub.admin.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import kr.co.fithub.admin.model.dto.AdminDTO;
import kr.co.fithub.admin.model.dto.AdsDTO;
import kr.co.fithub.admin.model.service.AdminService;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/admin")
@Tag(name = "관리자 API 🛠️", description = "관리자 관련 기능")
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
	@GetMapping("/member")
	public ResponseEntity<Map> memberList(@RequestParam int memberPage) {
		Map map = adminService.memberList(memberPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 탈퇴한 회원 조회", description = "모든 탈퇴한 회원 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/delMember")
	public ResponseEntity<Map> delMemberList(@RequestParam int delMemberPage) {
		Map map = adminService.delMemberList(delMemberPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 게시글 조회", description = "모든 게시글 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/community")
	public ResponseEntity<Map> communityList(@RequestParam int communityPage) {
		Map map = adminService.communityList(communityPage);
		return ResponseEntity.ok(map);
	}
	
	@Operation(summary = "전체 댓글 조회", description = "모든 댓글 정보를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "조회 성공")
	})
	@GetMapping("/comment")
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
		int result = adminService.adminMemberChange(memberId, memberData);
		return ResponseEntity.ok(result);
	}
	@Operation(summary = "회원 정보 삭제", description = "회원을 삭제합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "삭제 성공")
	})
	@DeleteMapping("/member/{adminId}")
	public ResponseEntity<Integer> adminMemberDelete(@PathVariable String adminId, @RequestParam int memberNo) {
		int result = adminService.adminMemberDelete(memberNo, adminId);
		return ResponseEntity.ok(result);
	}
	@Operation(summary = "회원 정보 복귀", description = "삭제된 회원을 되돌립니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "수정 성공")
	})
	@PatchMapping("/member/{memberNo}/rollBack")
	public ResponseEntity<Integer> memberRollBack(@PathVariable int memberNo) {
		int result = adminService.memberRollBack(memberNo);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "광고 추가", description = "광고를 추가합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 등록 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 등록 실패")
	})
	@PostMapping("/ads")
	public ResponseEntity<Integer> writeAds(@RequestParam("adsName") String adsName, @RequestParam("adsLink") String adsLink, @RequestParam("adsType") String adsType, @RequestParam(value = "adsImg", required = false) MultipartFile adsImg) {	    
        AdsDTO ads = new AdsDTO();
        ads.setAdsName(adsName);
        ads.setAdsLink(adsLink);
        ads.setAdsType(adsType);

        if (adsImg != null && !adsImg.isEmpty()) {
            String savePath = root + "/ads/img/";
            String filePath = fileUtils.upload(savePath, adsImg);
            ads.setAdsImg(filePath); // DB에 저장할 이미지 경로
        }

        int result = adminService.writeAds(ads);
        return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "광고 전체 조회", description = "모든 광고를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@DeleteMapping("/ads")
	public ResponseEntity<Integer> deleteAds(@RequestParam int adsNo) {
		int result = adminService.deleteAds(adsNo);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "광고 전체 조회", description = "모든 광고를 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/ads")
	public ResponseEntity<List> getAdsList() {
		List list = adminService.getAdsList();
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "광고 타입 조회", description = "광고를 타입별로 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/ads/type")
	public ResponseEntity<List> getAdsType(@RequestParam String adsType) {
		List list = adminService.getAdsType(adsType);
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "회원 등급 조회", description = "회원을 등급별로 몇명인지 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/stats/member")
	public ResponseEntity<AdminDTO> getMember() {
		AdminDTO admin = adminService.getMember();
		return ResponseEntity.ok(admin);
	}
	
	@Operation(summary = "총 매출 조회", description = "총 매출을 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/stats/price")
	public ResponseEntity<List> categoryTotalPrice() {
		List list = adminService.categoryTotalPrice();
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "판매 개수 조회", description = "얼마나 팔았는지 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/stats/sell")
	public ResponseEntity<List> totalSell() {
		List list = adminService.totalSell();
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "주 매출 조회", description = "한 주동안 얼마를 벌었는지 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/stats/weekSales")
	public ResponseEntity<List> weekSales() {
		List list = adminService.weekSales();
		return ResponseEntity.ok(list);
	}
	
	@Operation(summary = "월 매출 조회", description = "이번 달 얼마를 벌었는지 조회합니다.")
	@ApiResponses({
	    @ApiResponse(responseCode = "200", description = "광고 조회 성공"),
	    @ApiResponse(responseCode = "500", description = "광고 조회 실패")
	})
	@GetMapping("/stats/monthSales")
	public ResponseEntity<List> monthSales() {
		List list = adminService.monthSales();
		return ResponseEntity.ok(list);
	}
	
	
}
