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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;

import kr.co.fithub.email.service.AuthResult;
import kr.co.fithub.email.service.EmailAuthStorage;
import kr.co.fithub.email.service.EmailService;
import kr.co.fithub.util.EmailSender;

@CrossOrigin("*")
@RestController
@RequestMapping("/email")
@Tag(name = "이메일 인증 API 📧", description = "이메일 인증번호 전송 및 확인 기능")
public class EmailController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailAuthStorage authStorage;

    @Operation(
        summary = "이메일 인증번호 전송",
        description = "입력한 이메일 주소로 6자리 인증번호를 전송합니다."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "인증번호 전송 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 이메일 형식",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "유효하지 않은 이메일 주소입니다.")
            )
        )
    })
    @GetMapping("/send")
    public ResponseEntity<?> sendAuthCode(
        @Parameter(description = "인증번호를 보낼 이메일 주소", example = "user@example.com")
        @RequestParam String to) {

        if (to == null || !to.contains("@")) {
            return ResponseEntity.badRequest().body("유효하지 않은 이메일 주소입니다.");
        }
        String authCode = String.format("%06d", new Random().nextInt(1000000));
        emailService.sendAuthCodeEmail(to, authCode);
        authStorage.save(to, authCode);

        return ResponseEntity.ok().body("인증번호 전송 완료");
    }

    @Operation(
        summary = "이메일 인증번호 확인",
        description = "입력한 이메일과 인증번호가 일치하는지 확인합니다.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "이메일 주소와 인증번호 (to, authCode)",
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"to\": \"user@example.com\", \"authCode\": \"123456\"}")
            )
        )
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "인증 성공"),
        @ApiResponse(responseCode = "401", description = "인증번호 불일치",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "인증번호가 일치하지 않습니다.")
            )
        ),
        @ApiResponse(responseCode = "410", description = "인증번호 만료",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "인증번호가 만료되었습니다. 다시 요청해주세요.")
            )
        )
    })
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