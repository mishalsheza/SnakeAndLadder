package com.example.snakeladder.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Random;

public class Dice {
    @JsonIgnore
    private final Random rand;
    private final int sides;

    public Dice(int sides) {
        this.sides = sides;
        this.rand = new Random();
    }

    public Dice(int sides, long seed) {
        this.sides = sides;
        this.rand = new Random(seed);
    }

    public int getSides() {
        return sides;
    }

    public int roll() {
        return rand.nextInt(sides) + 1;
    }
}
