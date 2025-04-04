package kr.co.fithub.shop.model.dto;

import java.util.List;

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
	private String goodsExplain;
	private int goodsPrice;
	private int goodsStock;
	private String goodsImage;
	private String goodsDate;
	private int goodsCategory;
	private String goodsInfo1;
	private String goodsDetail1;
	private String goodsInfo2;
	private String goodsDetail2;
	private String goodsInfo3;
	private String goodsDetail3;
	private String goodsInfo4;
	private String goodsDetail4;
	private String goodsInfo5;
	private String goodsDetail5;
	private String goodsInfo6;
	private String goodsDetail6;
	private String goodsDetailImg;
	
	private List<GoodsFile> fileList;
	private int[] delFileNo;
}



