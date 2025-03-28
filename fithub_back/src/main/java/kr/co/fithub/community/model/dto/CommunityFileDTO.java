package kr.co.fithub.community.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="communityFile")
public class CommunityFileDTO {
	private int communityFileNo;
	private int communityNo;
	private String filename;
	private String filepath;
}
