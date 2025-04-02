package kr.co.fithub.shop.controller;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import kr.co.fithub.shop.model.service.ShopService;

@SpringBootApplication
@CrossOrigin("*")
@RestController
@RequestMapping(value="/goods")
public class ShopController {
	
	@Autowired
	private ShopService shopService;

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
    
}