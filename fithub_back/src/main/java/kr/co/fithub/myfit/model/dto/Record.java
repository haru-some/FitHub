package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "record")
@Schema(description = "운동 기록 DTO")
public class Record {

    @Schema(description = "운동 기록 번호", example = "1001")
    private int recordNo;

    @Schema(description = "회원 번호", example = "101")
    private int memberNo;

    @Schema(description = "운동 날짜 (yyyy-MM-dd)", example = "2025-04-10")
    private String recordDate;

    @Schema(description = "운동 시작 시간 (HH:mm)", example = "07:30")
    private String recordStartTime;

    @Schema(description = "운동 종료 시간 (HH:mm)", example = "08:45")
    private String recordEndTime;

    @Schema(description = "운동 소요 시간 (분 단위 혹은 HH:mm 형식)", example = "75")
    private String recordTime;

    @Schema(description = "운동 내용", example = "런닝머신 30분, 웨이트 45분")
    private String recordContent;
}
