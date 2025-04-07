package kr.co.fithub.auth.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.member.model.dto.LoginMemberDTO;
import kr.co.fithub.util.JwtUtils;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        try {
            LoginMemberDTO member = jwtUtils.checkToken(refreshToken);
            String newAccessToken = jwtUtils.createAccessToken(member.getMemberId(), member.getMemberLevel());

            Map<String, String> res = new HashMap<>();
            res.put("accessToken", newAccessToken);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "리프레시 토큰이 만료되었거나 유효하지 않습니다."));
        }
    }
}