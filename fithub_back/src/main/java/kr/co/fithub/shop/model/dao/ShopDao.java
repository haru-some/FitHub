package kr.co.fithub.shop.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ShopDao {

	List selectGoodsList();

}
