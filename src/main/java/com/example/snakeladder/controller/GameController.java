package com.example.snakeladder.controller;

import com.example.snakeladder.dto.StartGameRequest;
import com.example.snakeladder.models.Game;
import com.example.snakeladder.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/game")
@CrossOrigin(origins = "*") // Allow frontend to access
public class GameController {

    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public Game startGame(@RequestBody StartGameRequest request) {
        return gameService.startGame(request.getPlayers(), request.isCiMode());
    }

    @PostMapping("/roll")
    public Map<String, Object> rollDice() {
        String message = gameService.rollDice();
        Game game = gameService.getGame();
        return Map.of(
            "message", message,
            "game", game
        );
    }

    @GetMapping("/state")
    public Game getGameState() {
        return gameService.getGame();
    }
}
