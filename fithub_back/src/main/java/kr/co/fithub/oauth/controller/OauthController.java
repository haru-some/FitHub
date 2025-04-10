package kr.co.fithub.oauth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import kr.co.fithub.oauth.model.dto.OauthJoinDTO;
import kr.co.fithub.oauth.model.service.OauthService;
import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
@Tag(name = "02. 소셜 로그인 API", description = "Google/Kakao 소셜 로그인 및 소셜 회원가입 기능")
public class OauthController {

    private final OauthService oauthService;

    @Operation(
        summary = "소셜 로그인",
        description = "provider(Google, Kakao 등)와 access_token을 전달받아 로그인 또는 회원 정보 조회를 수행합니다.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "소셜 access_token 전달",
            required = true,
            content = @Content(
                schema = @Schema(example = "{\"access_token\": \"ya29.A0ARrdaM...\"}")
            )
        )
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "로그인 성공 또는 회원 정보 반환"),
        @ApiResponse(responseCode = "400", description = "유효하지 않은 요청",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "유효하지 않은 요청입니다.")
            )
        )
    })
    @PostMapping("/{provider}")
    public ResponseEntity<Map<String, Object>> oauthLogin(
        @Parameter(description = "소셜 로그인 제공자 (google, kakao 등)", example = "google")
        @PathVariable("provider") String provider,
        @RequestBody Map<String, String> body) {

        String accessToken = body.get("access_token");
        Map<String, Object> result = oauthService.loginOrGetMemberInfo(provider, accessToken);
        return ResponseEntity.ok(result);
    }

    @Operation(
        summary = "소셜 회원가입",
        description = "소셜 로그인 정보를 기반으로 회원가입을 진행합니다.",
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "소셜 회원가입 요청 정보",
            required = true,
            content = @Content(schema = @Schema(implementation = OauthJoinDTO.class))
        )
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "회원가입 성공"),
        @ApiResponse(responseCode = "400", description = "요청 데이터 오류",
            content = @Content(
                mediaType = "text/plain",
                examples = @ExampleObject(value = "회원가입 요청이 잘못되었습니다.")
            )
        )
    })
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> oauthJoin(@RequestBody OauthJoinDTO joinRequest) {
        Map<String, Object> result = oauthService.insertOauthMember(joinRequest);
        return ResponseEntity.ok(result);
    }
}