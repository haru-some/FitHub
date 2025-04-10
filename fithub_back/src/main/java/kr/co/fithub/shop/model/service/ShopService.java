package kr.co.fithub.shop.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.shop.model.dao.ShopDao;
import kr.co.fithub.shop.model.dto.Cart;
import kr.co.fithub.shop.model.dto.Goods;
import kr.co.fithub.shop.model.dto.GoodsFile;
import kr.co.fithub.shop.model.dto.Review;
import kr.co.fithub.shop.model.dto.Sell;






@Service
public class ShopService {
	
	@Autowired
	private ShopDao shopDao;
	

	public Map selectGoodsList(int reqPage) {
		
		List list = shopDao.selectGoodsList();
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		
		return map;		
	}

	public Goods selectOneGoods(int goodsNo) {
		Goods goods =shopDao.selectOneGoods(goodsNo);
		return goods;
	}
	@Transactional
	public int insertgoods(Goods goods, List<GoodsFile> goodsFileList) {
		System.out.println(goods);
		int result = shopDao.insertGoods(goods);
		System.out.println(goods);
		
		
		for(GoodsFile goodsFile : goodsFileList) {
			goodsFile.setGoodsNo(goods.getGoodsNo());
			result += shopDao.insertGoodsFile(goodsFile);
		}
		
		return result;
	}

	
	@Transactional
	public List<GoodsFile> deleteGoods(int goodsNo) {
		
		List<GoodsFile> delFileList = shopDao.selectGoodsFileList(goodsNo);
		int result = shopDao.deleteBoard(goodsNo);
		if(result >0) {
			return null;
		}
		return delFileList;
							
	}
	@Transactional
	public int insertCart(Cart cart) {
		System.out.println(cart);
		int result = shopDao.insertCart(cart);
		System.out.println(cart);
//		for(GoodsFile goodsFile : goodsFileList) {
//			goodsFile.setGoodsNo(goods.getGoodsNo());
//			result += shopDao.insertGoodsFile(goodsFile);
//		}
		return result;
	}
	@Transactional
	public int insertSell(Sell sell) {
		int result = shopDao.insertSell(sell);
		return result;
	}

	
	
	public List<Sell> selectReviews(int memberNo) {	    
	    List<Sell> reviews = shopDao.selectReviews(memberNo);
	    
	    return reviews;
	}
	
	public List<Review> selectMyReviews(String memberId) {
		 
		
		 List<Review> reviews = shopDao.selectMyReviews(memberId);
		
		 
		return reviews;
	}
	
	
	public List<Review> goodsReviews(int goodsNo) {
		 List<Review> reviews = shopDao.goodsReviews(goodsNo);
		return reviews;
	}	
	
	
	
	@Transactional
	public int insertReview(Review review) {
		int result = shopDao.insertReview(review);
		return result;
	}

	

	
		
	

}
