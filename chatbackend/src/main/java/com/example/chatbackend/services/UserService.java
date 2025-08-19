package com.example.chatbackend.services;

import com.example.chatbackend.modal.entity.User;
import com.example.chatbackend.modal.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.data.mongodb.core.query.Query;

@Service
public class UserService
{
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MongoTemplate mongoTemplate;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public User registerUser(User user) throws Exception
	{
		if(userRepository.findByEmail(user.getEmail()).isPresent()) {
			throw new Exception("User already exists with this email");
		}
		String encodedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(encodedPassword);
		return userRepository.save(user);
	}

	public User loginUser(String email, String password) throws Exception
	{
		Optional<User> userOpt = userRepository.findByEmail(email);
		if(userOpt.isEmpty()) {
			throw new Exception("Invalid login credentials");
		}
		User user = userOpt.get();
		if(!passwordEncoder.matches(password, user.getPassword())) {
			throw new Exception("Invalid login credentials");
		}
		return user;
	}

	public List<User> getUsers()
	{
		Query query = new Query();
		query.fields().include("_id").include("name").include("email");
		return mongoTemplate.find(query, User.class, "users");
	}
}
