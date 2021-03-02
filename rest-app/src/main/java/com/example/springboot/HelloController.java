package com.example.springboot;

import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class HelloController {

	@RequestMapping("/")
	public String index(@RequestParam String greet) throws IOException {
		Path fileName = Path.of("data.txt");
		String actual = Files.readString(fileName);
		String updatedGreets = actual + "<br>\n" + greet;
		Files.writeString(fileName, updatedGreets);
        return "Greetings to <br>" + updatedGreets;
	}
}
