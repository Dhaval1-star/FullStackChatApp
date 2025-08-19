package com.example.chatbackend.controllers;

import com.example.chatbackend.modal.dto.LoginRequest;
import com.example.chatbackend.modal.entity.User;
import com.example.chatbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin
@RequestMapping("/api/auth")
public class UserController
{
	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user)
	{
		try
		{
			User registeredUser = userService.registerUser(user);
//			registeredUser.setPassword(null); // hide password in response
			return ResponseEntity.ok(registeredUser);
		}
		catch(Exception e)
		{
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest)
	{
		try
		{
			User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
			// Optionally, create and return JWT token here for React integration
			return ResponseEntity.ok(user);
		}
		catch(Exception e)
		{
			return ResponseEntity.status(401).body(e.getMessage());
		}
	}

	/**
	 * TODO
	 *
	 * @return
	 */
	@GetMapping("/users")
	public ResponseEntity<?> getUsers()
	{
		List<User> users = userService.getUsers();
		return ResponseEntity.ok(users);
	}
}
