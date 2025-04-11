package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="goodsFile")
@Schema(description = "상품 이미지파일 정보 DTO")
public class GoodsFile {
	@Schema(description = "상품 이미지파일 번호", example = "1")
	private int goodsFileNo;
	@Schema(description = "상품 번호", example = "1")
	private int goodsNo;
	@Schema(description = "저장되는 상품 파일이름", example = "트레이닝복여2(2).jpg")
	private String fileName;
	@Schema(description = "보여주는 상품 파일이름", example = "트레이닝복여2.jpg")
	private	String filePath;
	
}