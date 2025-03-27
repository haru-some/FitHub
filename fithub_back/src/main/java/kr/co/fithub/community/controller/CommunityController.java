package kr.co.fithub.community.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.community.model.dto.CommunityDTO;
import kr.co.fithub.community.model.service.CommunityService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/community")
public class CommunityController {
	@Autowired
	private CommunityService communityService;
	
	@GetMapping
	public ResponseEntity<List> communityList(){
		List list = communityService.selectCommunityList();
		return ResponseEntity.ok(list);
	}
	
	@GetMapping(value="/{communityNo}")
	public ResponseEntity<CommunityDTO> selectOneCommunity(@PathVariable int communityNo){
		CommunityDTO c = communityService.selectOneCommunity(communityNo);
		return ResponseEntity.ok(c);
	}
}
