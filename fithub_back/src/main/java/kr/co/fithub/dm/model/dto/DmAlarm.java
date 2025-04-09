package kr.co.fithub.dm.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DmAlarm {
	private int readYetCount;
	private String refreshRequest;
}
