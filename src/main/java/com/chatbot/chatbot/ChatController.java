package com.chatbot.chatbot;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class ChatController {

	@PostMapping("/chat")
	public String chat(@RequestBody String message) {
		message = message.toLowerCase();
		if (message.contains("hello")) {
			return "Hi! How can I help you?";
		} else if (message.contains("bye")) {
			return "Goodbye!";
		}
		return "I'm still learning.";
	}
}
