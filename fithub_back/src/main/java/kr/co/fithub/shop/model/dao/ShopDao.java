package kr.co.fithub.shop.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.shop.model.dto.Goods;

@Mapper
public interface ShopDao {

	List selectGoodsList();

	Goods selectOneGoods(int goodsNo);

}
