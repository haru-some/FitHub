package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import kr.co.fithub.member.model.dto.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="graph")
public class Graph {
	private String recordDay;
	private int totalTime;

}
