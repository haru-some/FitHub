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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
	
	@GetMapping(value="/list/{memberId}")
	public ResponseEntity<List> communityList(@PathVariable String memberId){
		List list = communityService.selectCommunityList(memberId);
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<CommunityDTO> selectOneCommunity(@PathVariable int communityNo){
		CommunityDTO c = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(c);
	}
	
	@DeleteMapping(value="/{memberId}")
	public ResponseEntity<Integer> deleteLike(@PathVariable String memberId, @RequestParam int communityNo){
		int result = communityService.deleteLike(memberId, communityNo);
		return ResponseEntity.ok(result);
	}
	
	@PostMapping(value="/{memberId}")
	public ResponseEntity<Integer> insertLike(@PathVariable String memberId, @RequestParam int communityNo){
		int result = communityService.insertLike(memberId, communityNo);
		return ResponseEntity.ok(result);
	}
}
