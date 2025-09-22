```mermaid
classDiagram
    class Game {
        - List~Player~ players
        - Board board
        - Dice dice
        - Scanner sc
        - int currentIndex
        - boolean finished
        - Player winner
        + start() void
        - playerTurn(p: Player) boolean
        - humanTurn(p: Player) boolean
        - botTurn(p: Player) boolean
        - processRoll(p: Player, roll: int) boolean
    }

    class Player {
        - String name
        - int position
        - boolean entered
        - boolean isBot
        + getName() String
        + getPosition() int
        + isBot() boolean
        + hasEntered() boolean
        + enterBoard() void
        + move(steps: int) void
        + setPosition(pos: int) void
        + toString() String
    }

    class Board {
        - int size
        - Map~Integer, Integer~ jumps
        + getSize() int
        + getDest(square: int) int
        + defaultBoard() Board
    }

    class Dice {
        - int sides
        - Random rand
        + roll() int
    }

    %% Relationships
    Game "1" --> "many" Player : has
    Game "1" --> "1" Board : uses
    Game "1" --> "1" Dice : uses
