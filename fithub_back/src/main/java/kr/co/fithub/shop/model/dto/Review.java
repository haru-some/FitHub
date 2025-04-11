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
@Alias(value="review")
@Schema(description = "상품 구매 리뷰 정보 DTO")
public class Review {
	@Schema(description = "리뷰 번호", example = "1")
	private int reNo;
	@Schema(description = "상품 번호", example = "1")
	private int goodsNo;	
	@Schema(description = "회원 아이디", example = "user10")
	private String memberId;
	@Schema(description = "리뷰 내용", example = "재구매 하고 싶어요")
	private String reContent;
	@Schema(description = "리뷰 날짜", example = "sysdate")
	private String reDate;
	@Schema(description = "리뷰 평점 (1: 1점, 2: 2점, 3: 3점, 4: 4점, 5: 5점)", example = "5")
	private int reStar;
	@Schema(description = "상품명", example = "SABU 여성 하이웨스트 레깅스 요가복 필라테스복")
	private String goodsName;

}
