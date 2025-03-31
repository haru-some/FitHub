package kr.co.fithub.community.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="comment")
public class CommentDTO {
	private int commentNo;
	private int communityNo;
	private int memberNo;
	private String commentContent;
	private String commentDate;
}
