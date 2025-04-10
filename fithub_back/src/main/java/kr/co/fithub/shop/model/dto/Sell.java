package kr.co.fithub.shop.model.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="sell")
public class Sell {
	private int sellNo;
	private String goodsName;
	private int memberNo;	
	private int goodsNo;	
	private int goodsTotalPrice;
	private int goodsEa;	
	private Date sellDate;
}
