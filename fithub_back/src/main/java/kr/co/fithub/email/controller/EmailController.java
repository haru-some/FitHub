package kr.co.fithub.email.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.fithub.email.service.AuthResult;
import kr.co.fithub.email.service.EmailAuthStorage;
import kr.co.fithub.util.EmailSender;

@CrossOrigin("*")
@RestController
@RequestMapping("/email")
public class EmailController {
    @Autowired
    private EmailSender emailSender;
    
    @Autowired
    private EmailAuthStorage authStorage;
    @GetMapping("/send")
    public ResponseEntity<?> sendAuthCode(@RequestParam String to) {
    	if (to == null || !to.contains("@")) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 주소입니다.");
        }
        String authCode = String.format("%06d", new Random().nextInt(1000000));

        String subject = "[FITHUB] 이메일 인증번호입니다.";
        String content =
        		  "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 480px;'>"
        		+ "<div style='text-align: center; margin-bottom: 20px;'>"
        		+   "<img src='cid:fithub-logo' alt='Fithub Logo' style='width: 80px; height: auto;' />"
        		+ "</div>"
        		+ "<h2 style='color: #2f3e2f;'>[FITHUB] 이메일 인증번호 안내</h2>"
        		+ "<p>아래 인증번호를 복사해 입력해 주세요.</p>"
        		+ "<div style='margin: 20px 0; padding: 14px; font-size: 24px; font-weight: bold; text-align: center; background-color: #f4f4f4; border-radius: 4px; color: #2f3e2f;'>"
        		+ authCode
        		+ "</div>"
        		+ "<p style='font-size: 14px; color: #666;'>본 인증번호는 발송 시점으로부터 3분간 유효합니다. 타인에게 공유하지 마세요.</p>"
        		+ "<hr style='margin: 24px 0;' />"
        		+ "<p style='font-size: 12px; color: #999;'>본 메일은 FITHUB 인증 시스템에서 자동 발송되었습니다. 문의: support@fithub.co.kr</p>"
        		+ "</div>";
        emailSender.sendMail(subject, to, content);
        authStorage.save(to, authCode);

        return ResponseEntity.ok().body("인증번호 전송 완료");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyAuthCode(@RequestBody Map<String, String> data) {
        String to = data.get("to");
        String inputCode = data.get("authCode");

        AuthResult result = authStorage.verify(to, inputCode);

        switch (result) {
            case SUCCESS:
                authStorage.remove(to);
                return ResponseEntity.ok("인증 성공");

            case EXPIRED:
                return ResponseEntity.status(410).body("인증번호가 만료되었습니다. 다시 요청해주세요.");

            case FAIL:
            default:
                return ResponseEntity.status(401).body("인증번호가 일치하지 않습니다.");
        }
    }
}