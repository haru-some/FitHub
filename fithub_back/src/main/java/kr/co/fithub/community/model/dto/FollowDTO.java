package kr.co.fithub.community.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="follow")
public class FollowDTO {
	private int followMemberNo;
	private int memberNo;
}
