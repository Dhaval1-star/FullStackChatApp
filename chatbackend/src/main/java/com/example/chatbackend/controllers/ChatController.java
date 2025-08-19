package com.example.chatbackend.controllers;

import com.example.chatbackend.modal.entity.ChatMessage;
import com.example.chatbackend.modal.repo.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.List;

@CrossOrigin
@Controller
public class ChatController {

	@Autowired
	private ChatMessageRepository chatMessageRepository;

	@Autowired
	private SimpMessagingTemplate template;

	// Handles group chat messages
	@MessageMapping("/sendMessage")
	@SendTo("/topic/public")
	public ChatMessage sendGroupMessage(@Payload ChatMessage chatMessage) {
		// Assign default roomId "public" if not set
		if (chatMessage.getRoomId() == null) {
			chatMessage.setRoomId("public");
		}
		chatMessage.setTimestamp(System.currentTimeMillis());
		chatMessage.setRecipient(null); // recipient null for group chat messages

		// Persist message to MongoDB
		chatMessageRepository.save(chatMessage);

		// Broadcast to all subscribers of /topic/public
		return chatMessage;
	}

	// Handles private chat messages
	@MessageMapping("/privateMessage")
	public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
		chatMessage.setTimestamp(System.currentTimeMillis());
		if (chatMessage.getRoomId() == null) {
			chatMessage.setRoomId("private");  // optional, or you can set a private chat room ID
		}
		chatMessageRepository.save(chatMessage);
		// url to subscribe this message is "/user/{userName}/private"
		template.convertAndSendToUser(chatMessage.getRecipient(), "/private", chatMessage);
	}

	/**
	 * TODO
	 *
	 * @param sender sender
	 * @param recipient receiver
	 * @return TODO
	 */
	@GetMapping("/get/chat/{sender}/{recipient}")
	private ResponseEntity<?> getPrivateChat(@PathVariable String sender, @PathVariable String recipient)
	{
		List<ChatMessage> chats = chatMessageRepository.findBySenderAndRecipient(sender, recipient);
		return ResponseEntity.ok(chats);
	}
}
