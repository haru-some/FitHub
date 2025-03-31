package kr.co.fithub.email.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class EmailAuthStorage {
    private final Map<String, AuthInfo> authCodeMap = new ConcurrentHashMap<>();
    public void save(String email, String code) {
        authCodeMap.put(email, new AuthInfo(code, System.currentTimeMillis()));
    }
    public AuthResult verify(String email, String inputCode) {
        AuthInfo info = authCodeMap.get(email);
        if (info == null) return AuthResult.FAIL;

        long now = System.currentTimeMillis();
        if (now - info.createdAt > 180_000) {
            return AuthResult.EXPIRED;
        }

        if (inputCode.equals(info.code)) {
            return AuthResult.SUCCESS;
        } else {
            return AuthResult.FAIL;
        }
    }
    public void remove(String email) {
        authCodeMap.remove(email);
    }
    private static class AuthInfo {
        String code;
        long createdAt;
        AuthInfo(String code, long createdAt) {
            this.code = code;
            this.createdAt = createdAt;
        }
    }
}