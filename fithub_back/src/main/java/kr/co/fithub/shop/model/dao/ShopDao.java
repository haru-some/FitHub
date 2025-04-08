package kr.co.fithub.shop.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.shop.model.dto.Cart;
import kr.co.fithub.shop.model.dto.Goods;
import kr.co.fithub.shop.model.dto.GoodsFile;
import kr.co.fithub.shop.model.dto.Sell;

@Mapper
public interface ShopDao {

	List selectGoodsList();

	Goods selectOneGoods(int goodsNo);

	int insertGoods(Goods goods);

	int insertGoodsFile(GoodsFile goodsFile);

	List<GoodsFile> selectGoodsFileList(int goodsNo);

	int deleteBoard(int goodsNo);

	int insertCart(Cart cart);

	int insertSell(Sell sell);

}
