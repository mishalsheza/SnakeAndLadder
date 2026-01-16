package com.example.snakeladder.models;

public class Player {
    private final String name;
    private int position = 0;
    private boolean entered = false;
    private final boolean isBot;

    public Player(String name, boolean isBot) {
        this.name = name;
        this.isBot = isBot;
    }
    
    // Default constructor for serialization
    public Player() {
        this.name = "Unknown";
        this.isBot = false;
    }

    public String getName() {
        return name;
    }

    public int getPosition() {
        return position;
    }

    public boolean isBot() {
        return isBot;
    }

    public boolean hasEntered() {
        return entered;
    }

    public void enterBoard() {
        this.entered = true;
        this.position = 1; 
    }

    public void move(int steps) {
        this.position += steps;
    }

    public void setPosition(int pos) {
        this.position = pos;
    }

    @Override
    public String toString() {
        return name + "@" + position;
    }
}