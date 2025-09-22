import java.util.*;

public class SnakeAndLadder {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Snake and Ladder - Java CLI");
        System.out.println("Choose mode: 1) Single-player (vs Bot)  2) Multi-player (humans)");
        int mode = readIntInRange(sc, "Enter 1 or 2: ", 1, 2);

        List<Player> players = new ArrayList<>();
        if (mode == 1) {
            System.out.print("Enter your name: ");
            String name = sc.nextLine().trim();
            if (name.isEmpty()) name = "Player1";
            players.add(new Player(name, false));
            players.add(new Player("Bot", true));
        } else {
            int n = readIntInRange(sc, "How many players (2-6)? ", 2, 6);
            for (int i = 1; i <= n; i++) {
                System.out.print("Enter name for player " + i + " (leave blank for Player" + i + "): ");
                String name = sc.nextLine().trim();
                if (name.isEmpty()) name = "Player" + i;
                players.add(new Player(name, false));
            }
        }

        Board board = Board.defaultBoard(); // standard snakes & ladders map
        Dice dice = new Dice(6);
        Game game = new Game(players, board, dice, sc);
        game.start();
        sc.close();
    }

    private static int readIntInRange(Scanner sc, String prompt, int min, int max) {
        int x = -1;
        while (true) {
            System.out.print(prompt);
            String line = sc.nextLine().trim();
            try {
                x = Integer.parseInt(line);
                if (x < min || x > max) {
                    System.out.println("Please enter a number between " + min + " and " + max + ".");
                    continue;
                }
                return x;
            } catch (NumberFormatException e) {
                System.out.println("Not a number. Try again.");
            }
        }
    }

    // -------------------------
    // Board class
    // -------------------------
    static class Board {
        private final int size;
        private final Map<Integer, Integer> jumps; // key->destination (snakes & ladders)

        public Board(int size, Map<Integer, Integer> jumps) {
            this.size = size;
            this.jumps = new HashMap<>(jumps);
        }

        public int getSize() {
            return size;
        }

        /**
         * Returns destination after applying snake or ladder.
         * If no snake/ladder here, returns the input square.
         */
        public int getDest(int square) {
            return jumps.getOrDefault(square, square);
        }

        public static Board defaultBoard() {
            // Standard-ish 100-board layout (a sample set of snakes & ladders)
            Map<Integer, Integer> jumps = new HashMap<>();
            // Ladders (up)
            jumps.put(2, 38);
            jumps.put(7, 14);
            jumps.put(8, 31);
            jumps.put(15, 26);
            jumps.put(21, 42);
            jumps.put(28, 84);
            jumps.put(36, 44);
            jumps.put(51, 67);
            jumps.put(71, 91);
            jumps.put(78, 98);
            jumps.put(87, 94);
            // Snakes (down)
            jumps.put(16, 6);
            jumps.put(46, 25);
            jumps.put(49, 11);
            jumps.put(62, 19);
            jumps.put(64, 60);
            jumps.put(74, 53);
            jumps.put(89, 68);
            jumps.put(92, 88);
            jumps.put(95, 75);
            jumps.put(99, 80);
            return new Board(100, jumps);
        }
    }

    // -------------------------
    // Dice
    // -------------------------
    static class Dice {
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

    // -------------------------
    // Player
    // -------------------------
    static class Player {
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

    // -------------------------
    // Game orchestration
    // -------------------------
    static class Game {
        private final List<Player> players;
        private final Board board;
        private final Dice dice;
        private final Scanner sc;
        private int currentIndex = 0;
        private boolean finished = false;
        private Player winner = null;

        public Game(List<Player> players, Board board, Dice dice, Scanner sc) {
            this.players = players;
            this.board = board;
            this.dice = dice;
            this.sc = sc;
        }

        public void start() {
            System.out.println("\nStarting game with players:");
            for (Player p : players) System.out.println("  - " + p.getName() + (p.isBot() ? " (Bot)" : ""));
            System.out.println("Rule: You must roll 1 or 6 to enter the board. Exact 100 required to win.");
            System.out.println("Press Enter to begin...");
            sc.nextLine();

            while (!finished) {
                Player curr = players.get(currentIndex);
                System.out.println("\n--- " + curr.getName() + "'s turn ---");
                boolean extraTurn = playerTurn(curr);
                if (!finished) {
                    if (!extraTurn) {
                        currentIndex = (currentIndex + 1) % players.size();
                    } else {
                        System.out.println(curr.getName() + " rolled a 6 and gets an extra turn!");
                    }
                }
            }

            System.out.println("\nGame Over! Winner: " + winner.getName());
        }

        /**
         * Returns true if the player earned an extra turn (rolled a 6).
         */
        private boolean playerTurn(Player p) {
            if (p.isBot()) {
                return botTurn(p);
            } else {
                return humanTurn(p);
            }
        }

        private boolean humanTurn(Player p) {
            System.out.println("Current: " + p);
            System.out.print("Press Enter to roll the dice...");
            sc.nextLine();
            int roll = dice.roll();
            System.out.println(p.getName() + " rolled: " + roll);

            return processRoll(p, roll);
        }

        private boolean botTurn(Player p) {
            System.out.println("Current: " + p);
            // small delay for readability
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            int roll = dice.roll();
            System.out.println(p.getName() + " (Bot) rolled: " + roll);
            // short delay
            try { Thread.sleep(300); } catch (InterruptedException ignored) {}
            return processRoll(p, roll);
        }

        /**
         * Processes the roll according to rules.
         * Returns true if extra turn (rolled a 6).
         */
        private boolean processRoll(Player p, int roll) {
            // If not entered yet, need 1 or 6 to enter.
            if (!p.hasEntered()) {
                if (roll == 1 || roll == 6) {
                    p.enterBoard();
                    System.out.println(p.getName() + " enters the board at square 1!");
                    // After entering at 1, apply any ladder at 1 (rare)
                    int dest = board.getDest(p.getPosition());
                    if (dest != p.getPosition()) {
                        p.setPosition(dest);
                        System.out.println("After jump: " + p.getName() + " moves to " + dest);
                    }
                } else {
                    System.out.println(p.getName() + " did not roll 1 or 6, remains off board.");
                }
                return roll == 6; // If 6, extra turn is granted even to enter
            }

            // If on board already
            int proposed = p.getPosition() + roll;
            if (proposed > board.getSize()) {
                System.out.println("Roll overshoots 100 (proposed " + proposed + "). Stay at " + p.getPosition());
                // overshoot: no move
            } else {
                p.move(roll);
                System.out.println(p.getName() + " moved to " + p.getPosition());
                // apply snake or ladder
                int dest = board.getDest(p.getPosition());
                if (dest != p.getPosition()) {
                    if (dest > p.getPosition()) {
                        System.out.println("Yay! Ladder up from " + p.getPosition() + " to " + dest);
                    } else {
                        System.out.println("Oh no! Snake from " + p.getPosition() + " down to " + dest);
                    }
                    p.setPosition(dest);
                }
            }

            // check win
            if (p.getPosition() == board.getSize()) {
                finished = true;
                winner = p;
                return false;
            }

            // extra turn on 6
            return roll == 6;
        }
    }
}
