package kr.co.fithub.admin.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="admin")
public class AdminDTO {
	private int contectNo;
	private int memberNo;
	private String contectContent;
	private int contectState;
	private int contectAlarm;
}
