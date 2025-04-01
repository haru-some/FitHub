package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="goods")
public class Goods {
	private int goodsNo;
	private String goodsName;
	private String goodsExpl;
	private int goodsPrice;
	private int goodsStock;
	private String goodsUrl;
	private String goodsDate;
	private int goodsCategory;
}
