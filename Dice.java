import java.util.*;

class Dice {
    private final Random rand;
    private final int sides;

    public Dice(int sides) {
        this.sides = sides;
        this.rand = new Random();
    }

    public int roll() {
        return rand.nextInt(sides) + 1;
    }
}
