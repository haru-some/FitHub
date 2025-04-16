package kr.co.fithub.shop.model.service;

import java.util.ArrayList;
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
	public int insertgoods(Goods goods, HashMap<String, String> map ,List<GoodsFile> goodsFileList) {
		String goodsInfo = null;
		if(map.keySet().size() > 0) {
			goodsInfo = "";
			for(Map.Entry<String,String> entry : map.entrySet()) {
				goodsInfo += "&"+entry.getKey() + "=" + entry.getValue();
			}
			
			goodsInfo = goodsInfo.substring(1, goodsInfo.length());
		}
		
		goods.setGoodsInfo(goodsInfo);
		int result = shopDao.insertGoods(goods);
		
		
		
		for(GoodsFile goodsFile : goodsFileList) {
			goodsFile.setGoodsNo(goods.getGoodsNo());
			result += shopDao.insertGoodsFile(goodsFile);
		}
		
		return result;
	}

	
	@Transactional
	public List<GoodsFile> deleteGoods(int goodsNo) {
		
		List<GoodsFile> delFileList = shopDao.selectGoodsFileList(goodsNo);
		int result = shopDao.deleteGoods(goodsNo);
		if(result >0) {
			return null;
		}
		return delFileList;							
	}
	
	@Transactional
	public int deleteCart(int cartNo) {		
		int result = shopDao.deleteCart(cartNo);		
		return result;
		
	}
	
	@Transactional
	public int insertCart(Cart cart) {
		int exist = shopDao.existCart(cart);
		int result = 0;
		if(exist > 0) {
			result += shopDao.updateCartAmount(cart);
		}else {
			result += shopDao.insertCart(cart);	
		}
		return result;
	}
	
	
	public List<Cart> selectCart(int memberNo) {
		List<Cart> reviews = shopDao.selectCart(memberNo);		 
		return reviews;
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
	
	
	    
	@Transactional
	public int SellAllInsert(List<Cart> carts) {
	    List<Sell> sells = new ArrayList<>(); 

	    for (Cart cart : carts) {
	        Sell sell = new Sell(); // Sell 객체 생성
	        sell.setMemberNo(cart.getMemberNo());
	        sell.setGoodsNo(cart.getGoodsNo());
	        sell.setGoodsName(cart.getGoodsName());
	        sell.setGoodsPrice(cart.getGoodsPrice());
	        sell.setGoodsEa(cart.getGoodsEa());
	        sell.setGoodsTotalPrice(cart.getGoodsPrice() * cart.getGoodsEa()); 

	        sells.add(sell); // Sell 객체 리스트에 추가
	    }

	    // Sell 객체를 DAO를 통해 데이터베이스에 저장
	    int insertCount = 0;
	    for (Sell sell : sells) {
	        insertCount += shopDao.insertSell(sell); 
	    }
	    
	    for (Cart cart : carts) {
	    	insertCount += shopDao.clearCart(cart.getCartNo());//
	    }
	    
	    return insertCount; // 실질적으로 저장된 Sell의 개수를 반환
	}
	@Transactional
	public int modifygoods(Goods goods,HashMap<String, String> map, List<GoodsFile> goodsFileList) {
		
		
		
		String goodsInfo = "";
		for(Map.Entry<String,String> entry : map.entrySet()) {
			goodsInfo += "&"+entry.getKey() + "=" + entry.getValue();
		}
		goodsInfo = goodsInfo.substring(1, goodsInfo.length());		
		goods.setGoodsInfo(goodsInfo);
		
		if(goods.getGoodsImage() ==null) {
			String existingImage = shopDao.getGoodsImage(goods.getGoodsNo());
			goods.setGoodsImage(existingImage);
		}
		if(goods.getGoodsDetailImg() ==null) {
			String existingDetailImg = shopDao.getGoodsDetailImg(goods.getGoodsNo());
			goods.setGoodsDetailImg(existingDetailImg);
		}
		
		
		int result = shopDao.modifyGoods(goods);
		
		
		
		for(GoodsFile goodsFile : goodsFileList) {
			goodsFile.setGoodsNo(goods.getGoodsNo());
			result += shopDao.insertGoodsFile(goodsFile);
		}
		
		return result;
	}

	public int deleteMyReview(int reNo) {
		int result = shopDao.deleteMyReview(reNo);		
		return result;
	}
	    
	    	    
	
	

	

	
		
	

}
