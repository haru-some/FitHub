package kr.co.fithub.shop.model.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="cart")
public class Cart {
	private int cartNo;
	private int memberNo;
	private int goodsNo;
	private int goodsEa;
	
}
