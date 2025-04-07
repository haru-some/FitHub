package kr.co.fithub.oauth.model.provider;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import kr.co.fithub.oauth.model.dto.KakaoUserInfo;
import kr.co.fithub.oauth.model.dto.OauthUserInfo;

@Component
public class KakaoOauthProvider implements OauthProvider {

    @Value("${kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OauthUserInfo getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<?> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                kakaoUserInfoUri,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();

        Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String id = String.valueOf(body.get("id"));
        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String picture = (String) profile.get("profile_image_url");

        return new KakaoUserInfo(id, email, nickname, picture);
    }

    @Override
    public String getProvider() {
        return "kakao";
    }
}