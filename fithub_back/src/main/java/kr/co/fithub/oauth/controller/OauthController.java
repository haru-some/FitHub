package kr.co.fithub.oauth.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import kr.co.fithub.oauth.model.service.OauthService;

@CrossOrigin("*")
@RestController
@RequestMapping("/oauth")
public class OauthController {

    @Autowired
    private OauthService oauthService;

    @PostMapping("/{provider}")
    public Map<String, Object> oauthLogin(@PathVariable String provider,
                                          @RequestBody Map<String, String> body) {

        String accessToken = null;

        if ("google".equalsIgnoreCase(provider) || "kakao".equalsIgnoreCase(provider)) {
            accessToken = body.get("access_token");
        }

        if (accessToken == null) {
            throw new IllegalArgumentException("토큰 값이 제공되지 않았습니다.");
        }

        return oauthService.login(provider, accessToken);
    }
}