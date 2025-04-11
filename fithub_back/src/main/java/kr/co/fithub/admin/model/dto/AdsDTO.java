package kr.co.fithub.admin.model.dto;

import org.apache.ibatis.type.Alias;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="ads")
@Schema(description = "채팅방 DTO")
public class AdsDTO {
	@Schema(description = "광고 번호", example = "1")
	private int adsNo;
	@Schema(description = "광고 이름", example = "프로틴")
	private String adsName;
	@Schema(description = "광고 이미지", example = "protein.jpg")
	private String adsImg;
	@Schema(description = "광고 링크", example = "https://www.myprotein.co.kr/")
	private String adsLink;
	@Schema(description = "광고 타입", example = "w")
	private String adsType;
	@Schema(description = "광고 날짜", example = "2025-04-11 12:12:12")
	private String adsDate;
}
