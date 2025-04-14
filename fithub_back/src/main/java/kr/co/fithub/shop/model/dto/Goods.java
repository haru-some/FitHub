package kr.co.fithub.shop.model.dto;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="goods")
@Schema(description = "상품 정보 DTO")
public class Goods {
	@Schema(description = "상품 번호", example = "1")
	private int goodsNo;
	@Schema(description = "상품명", example = "SABU 여성 하이웨스트 레깅스 요가복 필라테스복")
	private String goodsName;
	@Schema(description = "상품 설명", example = "<ul><li>색상계열: 블랙계열</li><li>사이즈: L</li></ul>")
	private String goodsExplain;
	@Schema(description = "상품 가격", example = "16400")
	private int goodsPrice;
	@Schema(description = "상품 제고", example = "20")
	private int goodsStock;
	@Schema(description = "상품 이미지", example = "트레이닝복여2.jpg")
	private String goodsImage;
	@Schema(description = "상품 등록날짜", example = "sysdate")
	private String goodsDate;
	@Schema(description = "상품 카테고리 (1:보충제, 2:비타민, 3:트레이닝복(남), 4:트레이닝복(여), 5:운동기구)", example = "4")
	private int goodsCategory;
	@Schema(description = "상품 정보1", example = "품명")
	private String goodsInfo;
	
	@Schema(description = "상품 상세 이미지", example = "트레이닝복여상세2.jpeg")
	private String goodsDetailImg;	
	
	@Schema(description = "상품 파일 리스트", example = "list")
	private List<GoodsFile> fileList;
	@Schema(description = "삭게 상품 번호", example = "1")
	private int[] delFileNo;
	
}



