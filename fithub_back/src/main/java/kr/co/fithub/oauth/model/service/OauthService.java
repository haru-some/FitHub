package kr.co.fithub.oauth.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.member.model.dao.MemberDao;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.member.model.service.MemberService;
import kr.co.fithub.oauth.model.dto.OauthUserInfo;
import kr.co.fithub.oauth.model.provider.GoogleOauthProvider;
import kr.co.fithub.oauth.model.provider.OauthProvider;
import kr.co.fithub.oauth.model.provider.OauthProviderFactory;
import kr.co.fithub.util.JwtUtils;
import lombok.RequiredArgsConstructor;

@Service
public class OauthService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private OauthProviderFactory providerFactory;

    public Map<String, Object> login(String provider, String accessToken) {
        OauthProvider oauthProvider = providerFactory.getProvider(provider);
        OauthUserInfo userInfo = oauthProvider.getUserInfo(accessToken);

        MemberDTO member = memberDao.findByOauthId(userInfo.getOauthId());
        boolean isNew = false;

        if (member == null) {
            member = new MemberDTO();
            member.setMemberId(provider + "_" + userInfo.getOauthId());
            member.setLoginType(provider);
            member.setOauthId(userInfo.getOauthId());            
            member.setMemberPw("SOCIAL_LOGIN");
            member.setMemberEmail(userInfo.getEmail());
            member.setMemberName(userInfo.getName());
            member.setMemberAddr("주소를 입력해주세요");
            member.setMemberPhone("010-0000-0000");
            member.setMemberLevel(2);
            memberDao.insertOauthMember(member);
            isNew = true;
        }

        String accessJwt = jwtUtils.createAccessToken(member.getMemberId(),member.getMemberLevel());
        String refreshJwt = jwtUtils.createRefreshToken(member.getMemberId(),member.getMemberLevel());

        Map<String, Object> result = new HashMap<>();
        result.put("accessToken", accessJwt);
        result.put("refreshToken", refreshJwt);
        result.put("memberId", member.getMemberId());
        result.put("memberEmail", member.getMemberEmail());
        result.put("memberName", member.getMemberName());
        result.put("loginType", member.getLoginType());
        result.put("isNew", isNew);

        return result;
    }
}
