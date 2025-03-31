package kr.co.fithub.myfit.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="record")
public class Record {
	private int recordNo;
	private int memberNo;
	private String recordDate;
	private String recordStartTime;
	private String recordEndTime;
	private String recordTime;
	private String recordContent;
}
