package kr.co.fithub.oauth.model.provider;

import kr.co.fithub.oauth.model.dto.OauthUserInfo;

public interface OauthProvider {
    OauthUserInfo getUserInfo(String accessToken);
    String getProvider();
}