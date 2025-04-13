package kr.co.fithub.dm.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Schema(description = "DM 알림 정보 DTO")
public class DmAlarm {

    @Schema(description = "읽지 않은 메시지 개수", example = "3")
    private int readYetCount;

    @Schema(description = "새로고침 요청 여부 (예: 'refresh'면 클라이언트에 새로고침 요청)", example = "refresh")
    private String refreshRequest;
}
