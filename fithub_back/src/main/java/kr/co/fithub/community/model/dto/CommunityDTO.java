package kr.co.fithub.community.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="/community")
public class CommunityDTO {
	private int communityNo;
	private String communityContent;
	private String communityWriter;
	private String communityDate;
	private int communityStatus;
}
