package kr.co.fithub.dm.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Schema(description = "1:1 DM 메시지 DTO")
public class DmDto {

    @Schema(description = "메시지 타입 (예: enter, chat, exit)", example = "chat")
    private String type;

    @Schema(description = "보낸 사람 회원 번호", example = "101")
    private int senderNo;

    @Schema(description = "받는 사람 회원 번호", example = "102")
    private int receiverNo;

    @Schema(description = "메시지 내용", example = "안녕하세요! 오늘 운동 가시나요?")
    private String message;
}