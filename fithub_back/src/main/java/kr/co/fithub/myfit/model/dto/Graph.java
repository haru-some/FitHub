package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "graph")
@Schema(description = "운동 그래프 데이터 DTO")
public class Graph {

    @Schema(description = "운동 기록 날짜 (yyyy-MM-dd)", example = "2025-04-10")
    private String recordDay;

    @Schema(description = "총 운동 시간 (분 단위)", example = "120")
    private int totalTime;
}
