import java.util.List;
import java.util.Scanner;

public class Game {
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

