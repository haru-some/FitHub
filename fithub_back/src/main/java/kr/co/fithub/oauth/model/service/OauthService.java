package kr.co.fithub.oauth.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.member.model.dao.MemberDao;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.oauth.model.dto.OauthJoinDTO;
import kr.co.fithub.oauth.model.dto.OauthUserInfo;
import kr.co.fithub.oauth.model.provider.OauthProvider;
import kr.co.fithub.oauth.model.provider.OauthProviderFactory;
import kr.co.fithub.util.JwtUtils;

@Service
public class OauthService {

    @Autowired
    private MemberDao memberDao;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private OauthProviderFactory providerFactory;

    public Map<String, Object> loginOrGetMemberInfo(String provider, String accessToken) {
        OauthProvider oauthProvider = providerFactory.getProvider(provider);
        OauthUserInfo userInfo = oauthProvider.getUserInfo(accessToken);
        MemberDTO member = memberDao.findByOauthId(userInfo.getOauthId());
        Map<String, Object> response = new HashMap<>();
        if (member == null) {
            response.put("isNew", true);
            response.put("oauthId", userInfo.getOauthId());
            response.put("email", userInfo.getEmail());
            response.put("name", userInfo.getName());
            response.put("loginType", provider);
        } else {
            String accessJwt = jwtUtils.createAccessToken(member.getMemberId(), member.getMemberLevel());
            String refreshJwt = jwtUtils.createRefreshToken(member.getMemberId(), member.getMemberLevel());
            response.put("isNew", false);
            response.put("accessToken", accessJwt);
            response.put("refreshToken", refreshJwt);
            response.put("memberId", member.getMemberId());
            response.put("memberName", member.getMemberName());
            response.put("memberEmail", member.getMemberEmail());
            response.put("loginType", member.getLoginType());
            response.put("memberNo", member.getMemberNo());
        }
        return response;
    }
    @Transactional
    public Map<String, Object> insertOauthMember(OauthJoinDTO joinRequest) {
        if (memberDao.existsId(joinRequest.getMemberId()) > 0) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }
        MemberDTO member = new MemberDTO();
        member.setMemberId(joinRequest.getMemberId());
        member.setLoginType(joinRequest.getLoginType());
        member.setOauthId(joinRequest.getOauthId());
        member.setMemberPw("SOCIAL_LOGIN");
        member.setMemberEmail(joinRequest.getEmail());
        member.setMemberName(joinRequest.getName());
        member.setMemberPhone(joinRequest.getPhone());
        member.setMemberAddr(joinRequest.getAddress());
        member.setMemberLevel(2);
        int result = memberDao.insertOauthMember(member);
        if (result != 1) {
            throw new IllegalStateException("소셜 회원가입 처리 중 오류");
        }
        String accessJwt = jwtUtils.createAccessToken(member.getMemberId(), member.getMemberLevel());
        String refreshJwt = jwtUtils.createRefreshToken(member.getMemberId(), member.getMemberLevel());
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessJwt);
        response.put("refreshToken", refreshJwt);
        response.put("memberId", member.getMemberId());
        response.put("memberName", member.getMemberName());
        response.put("memberEmail", member.getMemberEmail());
        response.put("loginType", member.getLoginType());
        response.put("memberNo", member.getMemberNo());
        return response;
    }
}
