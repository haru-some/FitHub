package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="cart")
@Schema(description = "상품 카트 정보 DTO")
public class Cart {
	@Schema(description = "카트 번호", example = "1")
	private int cartNo;
	@Schema(description = "회원 번호", example = "1")
	private int memberNo;
	@Schema(description = "상품 번호", example = "1")
	private int goodsNo;
	@Schema(description = "상품명", example = "SABU 여성 하이웨스트 레깅스 요가복 필라테스복")
	private String goodsName;
	@Schema(description = "상품 이미지", example = "트레이닝복여2.jpg")
	private String goodsImage;
	@Schema(description = "상품 가격", example = "16400")
	private int goodsPrice;
	@Schema(description = "상품 수량", example = "1")
	private int goodsEa;
	
}
