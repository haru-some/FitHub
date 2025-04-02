package kr.co.fithub.shop.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import kr.co.fithub.shop.model.dto.Goods;
import kr.co.fithub.shop.model.dto.GoodsFile;
import kr.co.fithub.shop.model.service.ShopService;
import kr.co.fithub.util.FileUtils;




@SpringBootApplication
@CrossOrigin("*")
@RestController
@RequestMapping(value="/goods")
public class ShopController {
	
	@Autowired
	private ShopService shopService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
    public static void main(String[] args) {
        SpringApplication.run(ShopController.class, args);
    }

    @GetMapping("/search/blog")
    public String searchBlog(@RequestParam String query) {
      
        return query; 
    }
    
    @GetMapping
	public ResponseEntity<Map> GoodsList(@RequestParam int reqPage){
		Map map = shopService.selectGoodsList(reqPage);
				
		return ResponseEntity.ok(map);	
    }
    @GetMapping(value="/{goodsNo}")
	public ResponseEntity<Goods> selectOneGoods(@PathVariable int goodsNo){
		Goods goods =shopService.selectOneGoods(goodsNo);
		return ResponseEntity.ok(goods);
	}
    
    @PostMapping
	public ResponseEntity<Integer>  inserGoods(@ModelAttribute Goods goods, @ModelAttribute MultipartFile goodsUrl, @ModelAttribute MultipartFile[] goodsFiles){
		//썸네일을 첨부한 경우에만 
		if(goodsUrl != null) {
			String savepath = root +"/goods/url/";
			String filepath = fileUtils.upload(savepath, goodsUrl);
			goods.setGoodsUrl(filepath);
		}
		List<GoodsFile> goodsFileList = new ArrayList<>();
		if(goodsFiles != null) {
			String savepath = root +"/goods/";
			for (MultipartFile file : goodsFiles) {
				GoodsFile fileDTO = new GoodsFile();
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				fileDTO.setFileName(filename);
				fileDTO.setFilePath(filepath);
				goodsFileList.add(fileDTO);
			}
		}
		int result = shopService.insertgoods(goods, goodsFileList);
		return ResponseEntity.ok(result);
	}
    
}