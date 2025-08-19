package com.example.chatbackend.modal.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chat_messages")
@Data
public class ChatMessage {
	@Id
	private String id;
	private String type;       // e.g. "CHAT", "JOIN", "LEAVE"
	private String content;
	private String sender;
	private String recipient;  // for private messages; null for group messages
	private String roomId;     // for group chat (could be "public" for general group chat)
	private long timestamp;

	// getters and setters
}
