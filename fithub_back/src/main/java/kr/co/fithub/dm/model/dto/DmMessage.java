package kr.co.fithub.dm.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "dmMessage")
@Schema(description = "DM 메시지 DTO")
public class DmMessage {

    @Schema(description = "DM 메시지 번호", example = "5001")
    private int dmMessageNo;

    @Schema(description = "DM 방 번호", example = "3001")
    private int dmRoomNo;

    @Schema(description = "보낸 사람 회원 번호", example = "101")
    private int senderNo;

    @Schema(description = "메시지 내용", example = "오늘 몇 시에 운동해?")
    private String dmContent;

    @Schema(description = "보낸 시간 (yyyy-MM-dd HH:mm:ss)", example = "2025-04-11 14:30:00")
    private String sentAt;

    @Schema(description = "읽음 여부 (0: 안읽음, 1: 읽음)", example = "0")
    private String isRead;
}
