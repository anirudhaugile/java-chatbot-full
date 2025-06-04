package com.chatbot.chatbot;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
public class BotController {

	@GetMapping("/greet")
	public String greet() {
		return "Hello! My name is Jazz.\nI was created in 2025.\nPlease, remind me your name.";
	}

	@PostMapping("/remind-name")
	public String remindName(@RequestBody Map<String, String> body) {
		String name = body.get("name");
		return "What a great name you have, " + name + "!";
	}

	@PostMapping("/guess-age")
	public String guessAge(@RequestBody Map<String, Integer> body) {
		int rem3 = body.get("rem3");
		int rem5 = body.get("rem5");
		int rem7 = body.get("rem7");
		int age = (rem3 * 70 + rem5 * 21 + rem7 * 15) % 105;
		return "Your age is " + age + "; that's a good time to start programming!";
	}

	@PostMapping("/count")
	public List<String> count(@RequestBody Map<String, Integer> body) {
		int num = body.get("num");
		List<String> output = new ArrayList<>();
		for (int i = 0; i <= num; i++) {
			output.add(i + "!");
		}
		return output;
	}

	@PostMapping("/test")
	public String test(@RequestBody Map<String, String> body) {
		String answer = body.get("answer");
		if ("2".equals(answer)) {
			return "Correct!";
		}
		return "Please, try again.";
	}

	@GetMapping("/end")
	public String end() {
		return "Congratulations, have a nice day!";
	}
}
