package com.example.snakeladder.service;

import com.example.snakeladder.models.Board;
import com.example.snakeladder.models.Dice;
import com.example.snakeladder.models.Game;
import com.example.snakeladder.models.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {

    private Game game;

    public Game startGame(List<String> playerNames, boolean isCiMode) {
        List<Player> players = new ArrayList<>();
        // In this simple version, assume 2nd player is Bot if named "Bot" or if only 1 name provided?
        // Requirement says: Request: { players: ["Alice", "Bot"], ciMode: false }
        
        for (String name : playerNames) {
            boolean isBot = name.equalsIgnoreCase("Bot");
            players.add(new Player(name, isBot));
        }

        Board board = Board.defaultBoard();
        // If CI mode, maybe use a fixed seed? For now random.
        // Dice dice = isCiMode ? new Dice(6, 12345L) : new Dice(6);
        Dice dice = new Dice(6); 

        this.game = new Game(players, board, dice);
        return this.game;
    }

    public Game getGame() {
        return this.game;
    }

    public String rollDice() {
        if (game == null || game.isFinished()) {
            return "Game not started or finished.";
        }

        Player current = game.getCurrentPlayer();
        int roll = game.getDice().roll();
        
        // Game Logic adapted from previous CLI
        boolean extraTurn = processRoll(current, roll);
        
        if (current.getPosition() == game.getBoard().getSize()) {
            game.setFinished(true);
            game.setWinner(current);
            return current.getName() + " rolled " + roll + " and WINS!";
        }

        if (!extraTurn) {
            game.nextTurn();
        }
        
        return current.getName() + " rolled " + roll;
    }

    private boolean processRoll(Player p, int roll) {
        if (!p.hasEntered()) {
            if (roll == 1 || roll == 6) {
                p.enterBoard();
                applyBoardFeatures(p);
            }
            return roll == 6;
        }

        int proposed = p.getPosition() + roll;
        if (proposed > game.getBoard().getSize()) {
            // Overshoot, no move
        } else {
            p.move(roll);
            applyBoardFeatures(p);
        }

        return roll == 6;
    }

    private void applyBoardFeatures(Player p) {
        int dest = game.getBoard().getDest(p.getPosition());
        if (dest != p.getPosition()) {
            p.setPosition(dest);
        }
    }
}
