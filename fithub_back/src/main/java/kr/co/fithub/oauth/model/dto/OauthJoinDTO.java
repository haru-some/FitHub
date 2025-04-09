package kr.co.fithub.oauth.model.dto;

import lombok.Data;

@Data
public class OauthJoinDTO {
    private String oauthId;
    private String loginType;
    private String memberId;
    private String name;
    private String phone;
    private String address;
    private String email;
}