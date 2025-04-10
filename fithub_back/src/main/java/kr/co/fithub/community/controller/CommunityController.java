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

import kr.co.fithub.community.model.dto.CommentDTO;
import kr.co.fithub.community.model.dto.CommunityDTO;
import kr.co.fithub.community.model.service.CommunityService;
import kr.co.fithub.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/community")
public class CommunityController {
	@Autowired
	private CommunityService communityService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@GetMapping(value="/list/{loginMemberNo}")
	public ResponseEntity<List> communityList(@RequestParam(required = false) Integer memberNo, @RequestParam int page, @RequestParam int size, @RequestParam String searchText, @PathVariable int loginMemberNo){
		int memberNum = memberNo == null ? 0 : memberNo;		
		List list = communityService.selectCommunityList(memberNum, page, size, searchText, loginMemberNo);
		
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<CommunityDTO> selectOneCommunity(@PathVariable int communityNo, @RequestParam int memberNo){		
		CommunityDTO c = communityService.selectOneCommunity(communityNo, memberNo);
		return ResponseEntity.ok(c);
	}
	
	@DeleteMapping(value="/{memberNo}")
	public ResponseEntity<Integer> deleteLike(@PathVariable int memberNo, @RequestParam int communityNo){
		int result = communityService.deleteLike(memberNo, communityNo);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/{memberNo}")
	public ResponseEntity<Integer> insertLike(@PathVariable int memberNo, @RequestParam int communityNo){
		int result = communityService.insertLike(memberNo, communityNo);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping
	public ResponseEntity<Integer> insertCommunity(@ModelAttribute CommunityDTO community){
		int result = communityService.insertCommunity(community);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/image")
	public ResponseEntity<String> image(@ModelAttribute MultipartFile image){
		String savepath = root + "/editor/";
		String filepath = fileUtils.upload(savepath, image);
		return ResponseEntity.ok(filepath);
	}
	
	@DeleteMapping(value="/follow/{memberNo}")
	public ResponseEntity<Integer> deleteFollow(@PathVariable int memberNo, @RequestParam int followMemberNo){
		int result = communityService.deleteFollow(memberNo, followMemberNo);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/follow/{memberNo}")
	public ResponseEntity<Integer> insertFollow(@PathVariable int memberNo, @RequestParam int followMemberNo){
		int result = communityService.insertFollow(memberNo, followMemberNo);
		return ResponseEntity.ok(result);
		
	}	
	
	@DeleteMapping(value="/list/{communityNo}")
	public ResponseEntity<CommunityDTO> deleteCommunity(@PathVariable int communityNo, @RequestParam(required = false,defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "0") int memberNo){
		CommunityDTO community = communityService.deleteCommunity(communityNo, page, memberNo);
		return ResponseEntity.ok(community);
	}
	
	@PatchMapping
	public ResponseEntity<Integer> updateCommunity(@RequestBody CommunityDTO community){
		int result = communityService.updateCommunity(community);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/comment/{communityNo}")
	public ResponseEntity<Integer> insertComment(@PathVariable int communityNo, @RequestBody CommentDTO comment){
		comment.setCommunityNo(communityNo);
		int result = communityService.insertComment(comment);
		return ResponseEntity.ok(result);
	}
	
	@DeleteMapping(value="/comment/{commentNo}")
	public ResponseEntity<Integer> deleteComment(@PathVariable int commentNo){
		int result = communityService.deleteComment(commentNo);
		return ResponseEntity.ok(result);
	}
	
	@PatchMapping(value="/comment/{commentNo}")
	public ResponseEntity<Integer> updateComment(@PathVariable int commentNo, @RequestBody CommentDTO comment){
		comment.setCommentNo(commentNo);		
		int result = communityService.updateComment(comment);
		return ResponseEntity.ok(result);
	}
}
