package kr.co.fithub.shop.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.fithub.shop.model.dao.ShopDao;
import kr.co.fithub.shop.model.dto.Goods;


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

}
