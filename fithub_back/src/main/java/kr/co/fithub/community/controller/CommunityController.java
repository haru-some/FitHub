package kr.co.fithub.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.community.model.service.CommunityService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/community")
public class CommunityController {
	@Autowired
	private CommunityService communityService;
}
