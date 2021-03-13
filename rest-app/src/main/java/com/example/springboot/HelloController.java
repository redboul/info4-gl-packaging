package com.example.springboot;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController("HelloController")
public class HelloController {

	@RequestMapping("/hello")
	public String hello() {
		return "Greetings from Spring Boot!";
	}

}
