public class Player {
    private final String name;
    private int position = 0;
    private boolean entered = false; // has the player entered the board (rolled 1 or 6 at least once)?
    private final boolean isBot;

    public Player(String name, boolean isBot) {
        this.name = name;
        this.isBot = isBot;
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
        this.position = 1; // typically entering places player at square 1
    }

    /**
     * Move player forward by steps (without applying snakes/ladders).
     */
    public void move(int steps) {
        this.position += steps;
    }

    public void setPosition(int pos) {
        this.position = pos;
    }

    @Override
    public String toString() {
        return name + "@" + position + (entered ? "" : " (not entered)");
    }
}