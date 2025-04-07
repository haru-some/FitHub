package kr.co.fithub.member.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.multipart.MultipartFile;

import kr.co.fithub.email.service.EmailService;
import kr.co.fithub.member.model.dao.MemberDao;
import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.member.model.dto.MemberDTO;
import kr.co.fithub.util.FileUtils;
import kr.co.fithub.util.JwtUtils;
import kr.co.fithub.util.PageInfoUtil;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private JwtUtils jwtUtil;
	@Autowired
	private PageInfoUtil pageInfoUtil;
	@Autowired
	private EmailService emailService;
	@Autowired
    private FileUtils fileUtils;
    @Value("${file.root}")
    private String root;
	
	@Transactional
	public int joinMember(MemberDTO member) {
		String memberPw = member.getMemberPw();
		String encPw = encoder.encode(memberPw);
		member.setMemberPw(encPw);
		int result = memberDao.joinMember(member);
		return result;
	}
	public int exists(String memberId) {
		int result = memberDao.exists(memberId);
		return result;
	}
	public int existsEmail(String memberEmail) {
		int result = memberDao.existsEmail(memberEmail);
	    return result;
	}
	public MemberDTO login(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			String accessToken = jwtUtil.createAccessToken(m.getMemberId(),m.getMemberLevel());
			String refreshToken = jwtUtil.createRefreshToken(m.getMemberId(),m.getMemberLevel());
			m.setAccessToken(accessToken);
			m.setRefreshToken(refreshToken);
			m.setMemberPw(null);
			return m;
		}
		return null;
	}
	public MemberDTO selectOneMember(String memberId, String accessToken) {
		MemberDTO m = memberDao.selectOneMember(memberId);
		m.setMemberPw(null);
		return m;
	}
	public MemberDTO findByMemberId(String memberId) {
		MemberDTO m = memberDao.selectOneMember(memberId);
        return m;
    }
	public MemberDTO refresh(String refreshToken) {
		LoginMemberDTO loginMember = jwtUtil.checkToken(refreshToken);
		MemberDTO m = memberDao.selectOneMember(loginMember.getMemberId());
		if (m == null) {
	        throw new RuntimeException("해당 리프레시 토큰에 해당하는 유저 정보가 존재하지 않습니다.");
	    }
		String accessToken = jwtUtil.createAccessToken(loginMember.getMemberId(),loginMember.getMemberLevel());
		String newRefreshToken = jwtUtil.createRefreshToken(loginMember.getMemberId(),loginMember.getMemberLevel());
		m.setAccessToken(accessToken);
		m.setRefreshToken(newRefreshToken);
		m.setMemberPw(null);
		return m;
	}
	@Transactional
	public int updateMember(MemberDTO member) {
		int result = memberDao.updateMember(member);
		return result;
	}
	@Transactional
	public int deleteMember(String memberId) {
		int result = memberDao.deleteMember(memberId);
		return result;
	}
	public int checkPw(MemberDTO member) {
		MemberDTO m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && encoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		}
		return 0;
	}
	@Transactional
	public int changePw(MemberDTO member) {
		String encPw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encPw);
		int result = memberDao.changePw(member);
		return result;
	}
	public List<MemberDTO> findIdsByNameAndEmail(String name, String email) {
	    HashMap<String, String> nameEmail = new HashMap<>();
	    nameEmail.put("memberName", name);
	    nameEmail.put("memberEmail", email);
	    return memberDao.findIdsByNameAndEmail(nameEmail);
	}
	@Transactional
	public boolean sendTempPasswordByIdAndEmail(String memberId, String memberEmail) {
	    Map<String, String> idEmail = new HashMap<>();
	    idEmail.put("memberId", memberId);
	    idEmail.put("memberEmail", memberEmail);
	    MemberDTO member = memberDao.findPwByIdAndEmail(idEmail);
	    if (member != null) {
	        String tempPw = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
	        String encPw = encoder.encode(tempPw);
	        member.setMemberPw(encPw);
	        memberDao.changePw(member);
	        emailService.sendTempPasswordEmail(memberEmail, tempPw);
	        return true;
	    }
	    return false;
	}
}
