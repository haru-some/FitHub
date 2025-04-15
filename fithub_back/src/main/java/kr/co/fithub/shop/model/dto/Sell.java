package kr.co.fithub.shop.model.dto;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="sell")
@Schema(description = "구매 정보 DTO")
public class Sell {
	@Schema(description = "구매 번호", example = "1")
	private int sellNo;
	@Schema(description = "상품명", example = "SABU 여성 하이웨스트 레깅스 요가복 필라테스복")
	private String goodsName;
	@Schema(description = "회원 번호", example = "1")
	private int memberNo;	
	@Schema(description = "상품 번호", example = "1")
	private int goodsNo;	
	@Schema(description = "총 구매 가격", example = "16400")
	private int goodsTotalPrice;
	@Schema(description = " 구매 가격", example = "17400")
	private int goodsPrice;
	@Schema(description = "상품 수량", example = "2")
	private int goodsEa;	
	@Schema(description = "구매 날짜", example = "sysdate")
	private Date sellDate;
	@Schema(description = "카테고리별 매출", example = "10000")
	private int categoryTotalPrice;
	@Schema(description = "카테고리명", example = "보충제")
	private int goodsCategory;
	@Schema(description = "판매 개수", example = "25")
	private int totalSell;
	@Schema(description = "당일 매출", example = "10000")
	private int totalDayPrice;
	@Schema(description = "주간 매출", example = "100000")
	private int totalWeekPrice;
	@Schema(description = "판매 날짜", example = "2025-04-11")
	private String saleDate;
	@Schema(description = "주간 날짜", example = "1주차")
	private int weekNo;
}
