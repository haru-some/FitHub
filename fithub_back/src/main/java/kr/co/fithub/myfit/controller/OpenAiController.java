package kr.co.fithub.myfit.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/openai")
public class OpenAiController {

    @Value("${openai.api.key}")
    private String openAiApiKey;
    
    public String stripAllHtmlTags(String input) {
        if (input == null) return "";
        return input.replaceAll("<[^>]*>", ""); // 모든 HTML 태그 제거
    }

    @PostMapping("/calories")
    public ResponseEntity<String> getCalories(@RequestBody Map<String, String> body) throws Exception {
        String content = body.get("content");
        String time = body.get("time");

        String prompt = "나는 운동 기록에 대한 피드백을 제공하는 사이트를 만들고있는데, 다음 운동 기록을 보고 운동에 대한 평가와 대략적인 칼로리 소모량을 숫자로 알려줘(kcal). 운동기록(운동시간은 " + time+ "분) : " + stripAllHtmlTags(content);

        String requestBody = """
            {
              "model": "gpt-4o",
              "messages": [
                {"role": "user", "content": "%s"}
              ]
            }
            """.formatted(prompt);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.openai.com/v1/chat/completions"))
            .header("Authorization", "Bearer " + openAiApiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        return ResponseEntity.ok(response.body());
    }
}
