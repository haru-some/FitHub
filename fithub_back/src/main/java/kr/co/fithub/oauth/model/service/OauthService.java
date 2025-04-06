package kr.co.fithub.oauth.model.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.member.model.dao.MemberDao;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.member.model.service.MemberService;
import kr.co.fithub.oauth.model.dto.OauthJoinDTO;
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

            int result = memberDao.insertOauthMember(member);
            if (result != 1) {
                throw new IllegalStateException("소셜 회원 등록에 실패했습니다.");
            }

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
    @Transactional
    public Map<String, Object> updateSocialMember(OauthJoinDTO joinRequest) {
        if (memberDao.exists(joinRequest.getMemberId()) > 0) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        MemberDTO member = memberDao.findByOauthId(joinRequest.getOauthId());
        if (member == null) {
            throw new IllegalArgumentException("해당 소셜 계정으로 가입된 사용자가 없습니다.");
        }

        member.setMemberId(joinRequest.getMemberId());
        member.setMemberName(joinRequest.getName());
        member.setMemberPhone(joinRequest.getPhone());
        member.setMemberAddr(joinRequest.getAddress());

        int result = memberDao.updateOauthMemberInfo(member);

        if (result != 1) {
            throw new IllegalStateException("소셜 회원정보 업데이트 실패");
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

        return response;
    }
}
