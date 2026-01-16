package com.example.snakeladder.models;

import java.util.List;

public class Game {
    private final List<Player> players;
    private final Board board;
    private final Dice dice;
    
    private int currentIndex = 0;
    private boolean finished = false;
    private Player winner = null;

    public Game(List<Player> players, Board board, Dice dice) {
        this.players = players;
        this.board = board;
        this.dice = dice;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public Board getBoard() {
        return board;
    }

    public Dice getDice() {
        return dice;
    }

    public int getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(int currentIndex) {
        this.currentIndex = currentIndex;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public Player getWinner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
    }
    
    public Player getCurrentPlayer() {
        return players.get(currentIndex);
    }
    
    public void nextTurn() {
        currentIndex = (currentIndex + 1) % players.size();
    }
}
