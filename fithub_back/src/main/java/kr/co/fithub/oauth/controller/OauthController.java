package kr.co.fithub.oauth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.oauth.model.dto.OauthJoinDTO;
import kr.co.fithub.oauth.model.service.OauthService;
import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class OauthController {

    private final OauthService oauthService;

    @PostMapping("/{provider}")
    public ResponseEntity<Map<String, Object>> oauthLogin(
            @PathVariable("provider") String provider,
            @RequestBody Map<String, String> body) {
        String accessToken = body.get("access_token");
        Map<String, Object> result = oauthService.loginOrGetMemberInfo(provider, accessToken);
        return ResponseEntity.ok(result);
    }
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> oauthJoin(
            @RequestBody OauthJoinDTO joinRequest) {
        Map<String, Object> result = oauthService.insertOauthMember(joinRequest);
        return ResponseEntity.ok(result);
    }
}