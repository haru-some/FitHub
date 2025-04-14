package kr.co.fithub.community.controller;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;
import kr.co.fithub.community.model.service.CommunityService;
import kr.co.fithub.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/community")
@Tag(name = "커뮤니티 API 🧑‍🤝‍🧑", description = "커뮤니티 관련 기능")
public class CommunityController {
	@Autowired
	private CommunityService communityService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;

	@Operation(summary = "커뮤니티 전체 조회", description = "커뮤니티 정보 전체를 반환합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
	@GetMapping(value="/list/{loginMemberNo}")
	public ResponseEntity<List> communityList(@RequestParam(required = false) Integer memberNo, @RequestParam int page, @RequestParam int size, @RequestParam String searchText, @PathVariable int loginMemberNo){
		int memberNum = memberNo == null ? 0 : memberNo;		
		List list = communityService.selectCommunityList(memberNum, page, size, searchText, loginMemberNo);
		return ResponseEntity.ok(list);
	}

	@Operation(summary = "커뮤니티 단일 조회", description = "특정 커뮤니티 글의 상세 정보를 반환합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "조회 성공") })
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<CommunityDTO> selectOneCommunity(@PathVariable int communityNo, @RequestParam int memberNo){		
		CommunityDTO c = communityService.selectOneCommunity(communityNo, memberNo);
		return ResponseEntity.ok(c);
	}

	@Operation(summary = "좋아요 삭제", description = "회원이 커뮤니티 글의 좋아요를 취소합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "취소 성공") })
	@DeleteMapping(value="/{memberNo}")
	public ResponseEntity<Integer> deleteLike(@PathVariable int memberNo, @RequestParam int communityNo){
		int result = communityService.deleteLike(memberNo, communityNo);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "좋아요 등록", description = "회원이 커뮤니티 글에 좋아요를 누릅니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "등록 성공") })
	@PostMapping(value="/{memberNo}")
	public ResponseEntity<Integer> insertLike(@PathVariable int memberNo, @RequestParam int communityNo){
		int result = communityService.insertLike(memberNo, communityNo);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "커뮤니티 글 등록", description = "새로운 커뮤니티 글을 등록합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "등록 성공") })
	@PostMapping
	public ResponseEntity<Integer> insertCommunity(@ModelAttribute CommunityDTO community){
		int result = communityService.insertCommunity(community);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "에디터 이미지 업로드", description = "커뮤니티 에디터에 이미지를 업로드합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "업로드 성공") })
	@PostMapping(value="/image")
	public ResponseEntity<String> image(@ModelAttribute MultipartFile image){
		String savepath = root + "/editor/";
		String filepath = fileUtils.upload(savepath, image);
		return ResponseEntity.ok(filepath);
	}

	@Operation(summary = "팔로우 삭제", description = "회원이 다른 회원에 대한 팔로우를 취소합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "삭제 성공") })
	@DeleteMapping(value="/follow/{memberNo}")
	public ResponseEntity<Integer> deleteFollow(@PathVariable int memberNo, @RequestParam int followMemberNo){
		int result = communityService.deleteFollow(memberNo, followMemberNo);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "팔로우 등록", description = "회원이 다른 회원을 팔로우합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "등록 성공") })
	@PostMapping(value="/follow/{memberNo}")
	public ResponseEntity<Integer> insertFollow(@PathVariable int memberNo, @RequestParam int followMemberNo){
		int result = communityService.insertFollow(memberNo, followMemberNo);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "커뮤니티 글 삭제", description = "특정 커뮤니티 글을 삭제합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "삭제 성공") })
	@DeleteMapping(value="/list/{communityNo}")
	public ResponseEntity<CommunityDTO> deleteCommunity(@PathVariable int communityNo, @RequestParam(required = false,defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "0") int memberNo){
		CommunityDTO community = communityService.deleteCommunity(communityNo, page, memberNo);
		return ResponseEntity.ok(community);
	}

	@Operation(summary = "커뮤니티 글 수정", description = "커뮤니티 글의 내용을 수정합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공") })
	@PatchMapping
	public ResponseEntity<Integer> updateCommunity(@RequestBody CommunityDTO community){
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "댓글 등록", description = "커뮤니티 글에 댓글을 등록합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "등록 성공") })
	@PostMapping(value="/comment/{communityNo}")
	public ResponseEntity<CommentDTO> insertComment(@PathVariable int communityNo, @RequestBody CommentDTO comment){
		comment.setCommunityNo(communityNo);
		CommentDTO c = communityService.insertComment(comment);	    
		return ResponseEntity.ok(c);
	}

	@Operation(summary = "댓글 삭제", description = "커뮤니티 댓글을 삭제합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "삭제 성공") })
	@DeleteMapping(value="/comment/{commentNo}")
	public ResponseEntity<Integer> deleteComment(@PathVariable int commentNo){
		int result = communityService.deleteComment(commentNo);
		return ResponseEntity.ok(result);
	}

	@Operation(summary = "댓글 수정", description = "커뮤니티 댓글을 수정합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공") })
	@PatchMapping(value="/comment/{commentNo}")
	public ResponseEntity<Integer> updateComment(@PathVariable int commentNo, @RequestBody CommentDTO comment){
		comment.setCommentNo(commentNo);		
		int result = communityService.updateComment(comment);
		return ResponseEntity.ok(result);
	}
	
	@Operation(summary = "커뮤니티 공개/비공개", description = "커뮤니티의 공개 여부(공개/비공개)를 변경합니다.")
	@ApiResponses({ @ApiResponse(responseCode = "200", description = "수정 성공") })
	@PatchMapping(value="/list")
	public ResponseEntity<CommunityDTO> changeStatus(@RequestBody CommunityDTO community){		
		CommunityDTO c = communityService.changeStatus(community);
		return ResponseEntity.ok(c);
	}
}
