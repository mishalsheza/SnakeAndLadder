package com.example.snakeladder.service;

import com.example.snakeladder.models.Game;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    private GameService gameService;

    @BeforeEach
    void setup() {
        gameService = new GameService();
    }

    @Test
    void testStartGame_withTwoPlayers_gameInitialized() {
        Game game = gameService.startGame(Arrays.asList("Alice", "Bot"), false);
        assertNotNull(game);
        assertEquals(2, game.getPlayers().size());
    }

    @Test
    void testRollDice_beforeGameStarted_returnsMessage() {
        String result = gameService.rollDice();
        assertEquals("Game not started or finished.", result);
    }

    @Test
    void testRollDice_afterGameStarted_returnsRollMessage() {
        gameService.startGame(Arrays.asList("Alice", "Bot"), false);
        String result = gameService.rollDice();
        assertTrue(result.contains("rolled")); 
    }
}
