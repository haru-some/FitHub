package kr.co.fithub.util;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import kr.co.fithub.member.model.dto.LoginMemberDTO;

@Component
public class JwtUtils {
	@Value("${jwt.secret-key}")
	private String secretKey;
	@Value("${jwt.expire-hour}")
	private int expireHour;
	@Value("${jwt.expire-hour-refresh}")
	private int expireHourRefresh;
	
	public String createAccessToken(String memberId, int memberType) {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHour);
		Date expireTime = c.getTime();	
		String token = Jwts.builder()
				.issuedAt(startTime) 
				.expiration(expireTime)	
				.signWith(key)
				.claim("memberId", memberId)
				.claim("memberType", memberType)
				.compact();						
		return token;
	}
	public String createRefreshToken(String memberId, int memberType) {
		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.HOUR, expireHourRefresh);
		Date expireTime = c.getTime();	
		String token = Jwts.builder()
				.issuedAt(startTime) 			
				.expiration(expireTime)		
				.signWith(key)					
				.claim("memberId", memberId)	
				.claim("memberType", memberType)
				.compact();						
		return token;
	}
	public LoginMemberDTO checkToken(String accessToken) {
	    try {
	        if (accessToken.startsWith("Bearer ")) {
	            accessToken = accessToken.substring(7);
	        }

	        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
	        Claims claims = (Claims) Jwts.parser()
	                                     .verifyWith(key)
	                                     .build()
	                                     .parse(accessToken)
	                                     .getPayload();

	        String memberId = claims.get("memberId", String.class);
	        Integer memberType = claims.get("memberType", Integer.class);

	        if (memberId == null || memberType == null) {
	            throw new RuntimeException("토큰에 유효한 사용자 정보가 포함되어 있지 않습니다.");
	        }

	        LoginMemberDTO loginMember = new LoginMemberDTO();
	        loginMember.setMemberId(memberId);
	        loginMember.setMemberLevel(memberType);
	        return loginMember;
	    } catch (Exception e) {
	        throw new RuntimeException("리프레시 토큰 검증 중 오류가 발생했습니다: " + e.getMessage());
	    }
	}
}
