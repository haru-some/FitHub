package kr.co.fithub.dm.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DmDto {
	private String type;
	private String memberId;
	private String message;
}
