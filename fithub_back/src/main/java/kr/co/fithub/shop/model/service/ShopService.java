package kr.co.fithub.shop.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.fithub.shop.model.dao.ShopDao;
import kr.co.fithub.shop.model.dto.Goods;
import kr.co.fithub.shop.model.dto.GoodsFile;



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

	public List<GoodsFile> updateGoods(Goods goods, List<GoodsFile> goodsFileList) {
		// TODO Auto-generated method stub
		return null;
	}
	
		
		
	

}
