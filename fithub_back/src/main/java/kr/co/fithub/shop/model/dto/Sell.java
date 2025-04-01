package kr.co.fithub.shop.model.dto;

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
	private int memberNo;
	private int goodsNo;
	private int sellEa;
	private String sellAddr;
	private String sellDate;
}
