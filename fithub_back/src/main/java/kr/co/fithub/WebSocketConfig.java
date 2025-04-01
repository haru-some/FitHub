package kr.co.fithub;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;


@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	
	@Override
	
	
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트에서 "/topic"으로 구독하면 메시지를 받을 수 있음
        config.enableSimpleBroker("/topic"); 
        
        // 메시지를 보낼 때 "/app" 경로 사용
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 주소 설정
        registry.addEndpoint("/chat")
        .setAllowedOriginPatterns("*")
        .withSockJS();
    }
}
