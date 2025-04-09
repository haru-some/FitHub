package kr.co.fithub.oauth.model.provider;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import kr.co.fithub.oauth.model.dto.GoogleUserInfo;
import kr.co.fithub.oauth.model.dto.OauthUserInfo;

@Component
public class GoogleOauthProvider implements OauthProvider {

    @Value("${google.user-info-uri}")
    private String googleUserInfoUri;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public OauthUserInfo getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                googleUserInfoUri,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> body = response.getBody();

        String id = (String) body.get("sub");
        String email = (String) body.get("email");
        String name = (String) body.get("name");

        return new GoogleUserInfo(id, email, name);
    }

    @Override
    public String getProvider() {
        return "google";
    }
}
