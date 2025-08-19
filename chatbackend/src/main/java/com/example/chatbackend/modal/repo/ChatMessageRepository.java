package com.example.chatbackend.modal.repo;

import com.example.chatbackend.modal.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String>
{
	List<ChatMessage> findByRoomId(String roomId); // For group chat rooms

	@Query("{ '$or': [ " +
			"{ 'sender': ?0, 'recipient': ?1 }, " +
			"{ 'sender': ?1, 'recipient': ?0 } ] }")
	List<ChatMessage> findBySenderAndRecipient(String sender, String recipient); // For private chats
}
