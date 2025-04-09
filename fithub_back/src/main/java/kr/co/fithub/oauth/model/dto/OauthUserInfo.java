package kr.co.fithub.oauth.model.dto;

public interface OauthUserInfo {
    String getProvider();    
    String getOauthId();     
    String getEmail();
    String getName();
}