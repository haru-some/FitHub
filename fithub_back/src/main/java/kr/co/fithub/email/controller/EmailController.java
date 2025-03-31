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
import kr.co.fithub.email.service.EmailService;
import kr.co.fithub.util.EmailSender;

@CrossOrigin("*")
@RestController
@RequestMapping("/email")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailAuthStorage authStorage;

    @GetMapping("/send")
    public ResponseEntity<?> sendAuthCode(@RequestParam String to) {
        if (to == null || !to.contains("@")) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 주소입니다.");
        }
        String authCode = String.format("%06d", new Random().nextInt(1000000));
        emailService.sendAuthCodeEmail(to, authCode);
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