package com.example.snakeladder.dto;

import java.util.List;

public class StartGameRequest {
    private List<String> players;
    private boolean ciMode;

    public List<String> getPlayers() {
        return players;
    }

    public void setPlayers(List<String> players) {
        this.players = players;
    }

    public boolean isCiMode() {
        return ciMode;
    }

    public void setCiMode(boolean ciMode) {
        this.ciMode = ciMode;
    }
}
