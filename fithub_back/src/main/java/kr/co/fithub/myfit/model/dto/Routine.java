package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "routine")
@Schema(description = "요일별 운동 루틴 DTO")
public class Routine {

    @Schema(description = "루틴 번호", example = "2001")
    private int routineNo;

    @Schema(description = "회원 번호", example = "101")
    private int memberNo;

    @Schema(description = "루틴 내용", example = "가슴운동 + 유산소")
    private String routineContent;

    @Schema(description = "루틴 요일 (월~일)", example = "월")
    private String routineDay;
}
