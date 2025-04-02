package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="goodsFile")
public class GoodsFile {
	private int boardFileNo;
	private int boardNo;
	private String fileName;
	private	String filePath;
}