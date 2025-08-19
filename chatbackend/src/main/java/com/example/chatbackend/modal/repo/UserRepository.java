package com.example.chatbackend.modal.repo;

import com.example.chatbackend.modal.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String>
{
    Optional<User> findByEmail(String email);
}
