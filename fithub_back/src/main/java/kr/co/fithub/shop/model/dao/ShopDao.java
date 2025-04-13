package kr.co.fithub.shop.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.fithub.shop.model.dto.Cart;
import kr.co.fithub.shop.model.dto.Goods;
import kr.co.fithub.shop.model.dto.GoodsFile;
import kr.co.fithub.shop.model.dto.Review;
import kr.co.fithub.shop.model.dto.Sell;

@Mapper
public interface ShopDao {

	List selectGoodsList();

	Goods selectOneGoods(int goodsNo);

	int insertGoods(Goods goods);

	int insertGoodsFile(GoodsFile goodsFile);

	List<GoodsFile> selectGoodsFileList(int goodsNo);

	int deleteGoods(int goodsNo);

	int insertCart(Cart cart);

	int insertSell(Sell sell);	

	List<Sell> selectReviews(int memberNo);

	int insertReview(Review review);

	List<Review> goodsReviews(int goodsNo);

	List<Review> selectMyReviews(String memberId);

	List<Cart> selectCart(int memberNo);

	int deleteCart(int cartNo);

	int insertAllSell(List<Sell> sells);

	int modifyGoods(Goods goods);

}
