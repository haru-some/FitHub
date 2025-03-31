package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="routine")
public class Routine {
	private int routineNo;
	private int memberNo;
	private String routineContent;
	private String routineDay;

}
