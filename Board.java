import java.util.HashMap;
import java.util.Map;

public class Board {
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

