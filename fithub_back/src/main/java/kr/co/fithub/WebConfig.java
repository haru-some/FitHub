package kr.co.fithub;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import kr.co.fithub.chat.model.service.ChatService;
import kr.co.fithub.dm.model.service.OneToOneDmHandler;

@Configuration
@EnableWebSocket
public class WebConfig implements WebMvcConfigurer, WebSocketConfigurer{
	@Value("${file.root}")
	private String root;
	@Autowired
	private ChatService chatService;
	@Autowired
	private OneToOneDmHandler dmHandler;
	
	@Bean
	public BCryptPasswordEncoder bCrypt() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry
		.addResourceHandler("/member/profileimg/**")
		.addResourceLocations("file:///"+root+"/member/profileimg/");
		registry
		.addResourceHandler("/editor/**")
		.addResourceLocations("file:///"+root+"/editor/");
		registry
		.addResourceHandler("/shop/thumb/**")
		.addResourceLocations("file:///"+root+"/goods/url/");
		registry
		.addResourceHandler("/shop/detail/**")
		.addResourceLocations("file:///"+root+"/goods/detail/");
	}
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry
			.addHandler(chatService, "/allChat")
			.setAllowedOrigins("*");
		registry
		.addHandler(dmHandler, "/dm")
		.setAllowedOrigins("*");
	}

}
