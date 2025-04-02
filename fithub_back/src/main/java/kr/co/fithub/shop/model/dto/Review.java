package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="review")
public class Review {
	private int reNo;
	private int memberNo;
	private int goodsNo;
	private String reDate;
	private String reContent;
	private int reStar;

}
