package com.example.chatbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		// Endpoint for WebSocket handshake with SockJS fallback
		registry.addEndpoint("/chat")
				.setAllowedOriginPatterns("*") // adjust for production
				.withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		// Prefix for destinations handled by methods annotated with @MessageMapping
		config.setApplicationDestinationPrefixes("/app");

		// Enables a simple memory-based broker for topic(queue/group chat) destinations
		config.enableSimpleBroker("/topic", "/user");
		config.setUserDestinationPrefix("/user");
	}
}
