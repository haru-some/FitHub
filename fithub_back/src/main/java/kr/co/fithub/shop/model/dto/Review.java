package kr.co.fithub.shop.model.dto;

import java.util.Date;

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
	private int goodsNo;	
	private String memberId;
	private String reContent;
	private String reDate;
	private int reStar;
	private String goodsName;

}
