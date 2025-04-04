package kr.co.fithub.oauth.model.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OauthProviderFactory {

    private final GoogleOauthProvider googleOauthProvider;
    private final KakaoOauthProvider kakaoOauthProvider;

    @Autowired
    public OauthProviderFactory(GoogleOauthProvider googleOauthProvider, KakaoOauthProvider kakaoOauthProvider) {
        this.googleOauthProvider = googleOauthProvider;
        this.kakaoOauthProvider = kakaoOauthProvider;
    }

    public OauthProvider getProvider(String providerName) {
        return switch (providerName.toLowerCase()) {
            case "google" -> googleOauthProvider;
            case "kakao" -> kakaoOauthProvider;
            default -> throw new IllegalArgumentException("지원하지 않는 소셜 로그인입니다: " + providerName);
        };
    }
}