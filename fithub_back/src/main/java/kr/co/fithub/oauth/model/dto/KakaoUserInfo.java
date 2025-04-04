package kr.co.fithub.oauth.model.dto;

public class KakaoUserInfo implements OauthUserInfo {
    private final String oauthId;
    private final String email;
    private final String name;
    private final String picture;

    public KakaoUserInfo(String oauthId, String email, String name, String picture) {
        this.oauthId = oauthId;
        this.email = email;
        this.name = name;
        this.picture = picture;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getOauthId() {
        return oauthId;
    }

    @Override
    public String getEmail() {
        return email;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getPicture() {
        return picture;
    }
}