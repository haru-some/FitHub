package kr.co.fithub.shop.controller;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import kr.co.fithub.shop.model.dto.Cart;
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
    
    
    //첨부파일이 포함된 post맵핑은 데이터는  @ModelAttribute로 처리한다. 
  	@PostMapping(value="/image")
  	public ResponseEntity<String> image(@ModelAttribute MultipartFile image){
  		String savepath = root + "/editor/";
  		String filepath = fileUtils.upload(savepath, image);
  		return ResponseEntity.ok(filepath);
  	}
  	
  	
    @PostMapping
	public ResponseEntity<Integer> insertGoods(@ModelAttribute Goods goods, @ModelAttribute MultipartFile goodsImg, @ModelAttribute MultipartFile detailImg, @ModelAttribute MultipartFile[] goodsFile) {
    	
    	
    	System.out.println("보여줘!!!");
    	System.out.println(detailImg);
    	System.out.println(goodsImg);
		if(goodsImg != null) {
			String savepath = root +"/goods/url/";
			String filepath = fileUtils.upload(savepath, goodsImg);
			goods.setGoodsImage(filepath);			
		}
		if(detailImg != null) {
			String savepath = root +"/goods/detail/";
			String filepath = fileUtils.upload(savepath, detailImg);
			goods.setGoodsDetailImg(filepath);			
		}
		
		
		
		List<GoodsFile> goodsFileList = new ArrayList<>();
		if(goodsFile != null) {
			String savepath = root +"/goods/";
			for (MultipartFile file : goodsFile) {
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
    
    @GetMapping(value="/file/{filePath}")
	public ResponseEntity<Resource> filedown(@PathVariable String filePath) throws FileNotFoundException{
		String savepath = root + "/goods/url/";
		File file = new File(savepath +filePath);
		
		Resource resource = new InputStreamResource(new FileInputStream(file));
		HttpHeaders header = new HttpHeaders()	; 
		header.add("Cache-Control","no-cache, no-store, must-revalidate");
		
		return ResponseEntity.status(HttpStatus.OK)
				.headers(header)
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
		
		
	}
    
   
    @DeleteMapping(value= "/{goodsNo}")
	public ResponseEntity<Integer> deleteGoods(@PathVariable int goodsNo){
		List<GoodsFile> delFileList =  shopService.deleteGoods(goodsNo);
		if(delFileList == null) {
			return ResponseEntity.ok(0);
			
		}else {
			String savepath = root +"/goods/";
			for(GoodsFile deleteFile : delFileList ) {
				File delFile = new File(savepath+deleteFile.getFilePath());
				delFile.delete();
			}
			return ResponseEntity.ok(1);
		}
    
    }
        
    @PostMapping(value="/cart/add/")
   	public ResponseEntity<Integer> CartInsert(@ModelAttribute Cart cart){
    	System.out.println("들어올래???");
    	System.out.println(cart);
    	int result = shopService.insertCart(cart);
   				
    	return ResponseEntity.ok(result);	
       }
     
    
    
}