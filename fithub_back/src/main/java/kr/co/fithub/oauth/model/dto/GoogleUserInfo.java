package kr.co.fithub.oauth.model.dto;

public class GoogleUserInfo implements OauthUserInfo {
    private final String oauthId;
    private final String email;
    private final String name;

    public GoogleUserInfo(String oauthId, String email, String name) {
        this.oauthId = oauthId;
        this.email = email;
        this.name = name;
    }

    @Override
    public String getProvider() {
        return "google";
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
}