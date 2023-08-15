import React from "react";

import I from "./html_images/I.png";
import J from "./html_images/J.png";
import L from "./html_images/L.png";
import O from "./html_images/O.png";
import S from "./html_images/S.png";
import Z from "./html_images/Z.png";
import T from "./html_images/T.png";

import rotation from "./html_images/rotation.png";
import pivot from "./html_images/I_center.png";

import board from "./html_images/board.png";
import wallkick from "./html_images/wallkicks.png";
import upcoming from "./html_images/upcoming.png";
import shadow from "./html_images/outline.png";
import held from "./html_images/held.png";

import transparent_i from "./html_images/transparent_l.png";
import transparent_s from "./html_images/transparent_s.png";
import transparent_t from "./html_images/transparent_t.png";

const dictionary =
  "public Dictionary&lt;int, Vector3[]&gt; jlstzWallKicks = new Dictionary&lt;int, Vector3[]&gt;() { \n\
    {1, new Vector3[]{new Vector3(0, 0, 0), new Vector3(-1, 0, 0), new Vector3(-1, 1, 0), new Vector3(0, -2, 0), new Vector3(-1, -2, 0)}}, \n\
    {2, new Vector3[]{new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(1, -1, 0), new Vector3(0, 2, 0), new Vector3(1, 2, 0)}},\n\
    {3, new Vector3[]{new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(1, -1, 0), new Vector3(0, 2, 0), new Vector3(1, 2, 0)}},\n\
    {0, new Vector3[]{new Vector3(0, 0, 0), new Vector3(-1, 0, 0), new Vector3(-1, 1, 0), new Vector3(0, -2, 0), new Vector3(-1, -2, 0)}} \n\
};";

const keyListener =
  "if (Input.GetKeyDown(KeyCode.RightArrow)) {\n\
    totalTimePassed = 0;\n\
    Debug.Log(Time.deltaTime);\n\
    moveTetromino(new Vector3(1, 0, 0));\n\
}";

const dasarr =
  "timePassed += Time.deltaTime;\n\
totalTimePassed += Time.deltaTime;\n\
if (Input.GetKey(KeyCode.LeftArrow) &&\n\
    timePassed >= arr && \n\
    totalTimePassed >= das) {\n\
    moveTetromino(new Vector3(-1, 0, 0));\n\
    timePassed = 0f;\n\
}";
const CS175 = () => {
  return (
    <div className="container">
      <div className="container-inner">
        <h1>CS 175 Project: Tetris</h1>
        <p className="italics">By Steve Li and Elizabeth Ling</p>
        <h2>Background</h2>
        <p>
          Tetris, a puzzle game created by Soviet Engineer Alexey Pajitnov, has
          captivated audiences since the 1980s. First starting out on early
          computers such as the Electronika 60, the game quickly grew in
          popularity, and practically any device with a screen mostly likely has
          the capability to run Tetris. Within this project, we aim to bring the
          game to the modern medium, a 3D stylized version built using Unity
          with the concepts learned in class.
        </p>
        <h2>Tetris Basics</h2>
        <h3>Rules</h3>
        <p>
          The game is rather simple. On a 10x20 grid of squares, players attempt
          to stack individual pieces, named{" "}
          <span className="italics bold">tetrominoes</span>, on top of each
          other. Filling an entire row of blocks{" "}
          <span className="italics bold">clears</span> the row of blocks,
          bringing every other block above it down a row. If the stack of blocks
          reach the very top, the game ends. Furthermore, as more lines are
          cleared, the pieces fall at an increasingly faster rate. The goal,
          therefore, is to clear as many rows before the stack reaches the top
          of the board.
        </p>
        <h3>Tetrominoes</h3>
        <p>
          A tetromino is a geometric shape composed of 4 squares. In a standard
          game of tetris, the player is presented with 7 tetrominoes, indicated
          by the letter the shape draws out: I, L, J, T, O, S, and Z.
        </p>
        <div className="image-grid">
          <img className="image" src={I} />
          <img className="image" src={L} />
          <img className="image" src={J} />
          <img className="image" src={T} />
          <img className="image" src={O} />
          <img className="image" src={S} />
          <img className="image" src={Z} />
        </div>
        <p>
          Within our implementation of Tetris, we created the 3D models of each
          piece ourselves, and then we applied a color material that matched
          that of the standard Tetris color sceheme.
        </p>
        <p>
          Modern versions of Tetris follow the Super Rotation System, or SRS,
          which defines the behavior of tetrominoes when rotated. The following
          rules are taken from the Tetris wiki:
        </p>
        <ul>
          <li>
            When unobstructed, the tetrominoes all appear to rotate purely about
            a single point. These apparent rotation centers are shown as circles
            in the diagram.
          </li>
          <li>
            It is a pure rotation in a mathematical sense, as opposed to the
            combination of rotation and translation found in other systems such
            as Sega Rotation and Atari Rotation.
          </li>
          <li>
            For the I and O tetrominoes, the apparent rotation center is at the
            intersection of gridlines, whereas for the J, L, S, T and Z
            tetrominoes, the rotation center coincides with the center of one of
            the four constituent blocks.
          </li>
        </ul>
        <div className="captioned-image">
          <img className="image" style={{ width: "40%" }} src={rotation} />
          <p className="italics">
            The rotation states of all 7 tetrominioes according to SRS
          </p>
        </div>
        <p>
          Our rotation system attempted to emulate SRS as best as possible,
          placing the rotation point towards the center of the piece. With the I
          and O tetrominoes, we simply disabled rotation of the O piece, and the
          I piece we chose a block close to the center as the rotation point.
          More details will be explained in a later section.
        </p>
        <div className="captioned-image">
          <img className="image" style={{ width: "50%" }} src={pivot} />
          <p className="italics">The pivot point of the I piece.</p>
        </div>
        <h3>DAS and ARR</h3>
        <p>
          Another component of tetrominioes lies in their movement, also known
          as <span className="italics bold">finesse</span> in the Tetris
          community. Two settings are commonly used in most Tetris ports, known
          as DAS and ARR. DAS stands for
          <span className="bold">Delayed Auto Shift</span>, and represents the
          delay before a piece will start to repeatedly move when the player
          continues to hold a key. ARR stands for
          <span className="bold">Auto Repeat Rate</span>, which means the rate
          at which pieces move in their intended direction. Both of these were
          implemented and are tuneable with individual parameters in our C#
          scripts, allowing for players to adjust their piece handling
          capabilities. More details will be outlined below.
        </p>
        <h1>Unity Implementation (the fun stuff)</h1>
        <div className="captioned-image">
          <img className="image" style={{ width: "90%" }} src={board} />
          <p className="italics">Our beautiful board.</p>
        </div>
        <h2>Board Design</h2>
        <p>
          Our board design is fairly simple. In the center we drew a 10x20 grid
          outlined by 3D cubes. On the top left, we outlined a square meant to
          display the "held" piece (will outline in a later section). During
          actual game play, the right part of the screen is filled with the next
          5 upcoming pieces, allowing players to plan ahead their stacks.
        </p>
        <h2>Board Representation</h2>
        <p>
          On top of the 3D board drawn in Unity, we also represented our board
          as a 20x10 array of <code>Transform</code> objects, notably so that we
          can perform transofmrations on individual blocks rather easily.
        </p>
        <pre>
          <code className="language-csharp">
            public Transform[,] grid = new Transform[h, w];
          </code>
        </pre>
        <p>
          Using this array representation is helpful, as it simplifies our
          workflow considerably. Therefore, for each frame, we perform the
          following:
        </p>
        <ol>
          <li>
            For each piece movement, we first check if the piece is inside the
            grid or colliding with another piece. This requires looping through
            each individual cube of the active tetromino, converting its
            piece-world coordinates to array positions using rounding, and then
            checking the grid if the spot at the specified row and column is
            null or not. This is implemented in the function
            <code>checkBoardPosition()</code> under <code>Piece.cs</code>.
            <ul>
              <li>
                Checking if a board position is occupied is as simple as
                checking if an individual square's{" "}
                <span className="italics bold">parent</span> is not equal to the
                current tetromino. This is because in the scene graph, each
                individual cube is a child of a tetromino, and we set each item
                in the array to be the children of the tetrominioes.
              </li>
            </ul>
          </li>
          <li>
            If the array position is free, that is, all cubes of the active
            piece are not occupying any space, then we move the piece to its
            specified location.
          </li>
          <li>
            Upon moving the piece, we set the piece's new location in the array
            by looping through the piece's children, converting its coordinates
            to array positions, and setting the array to be the child object. We
            also set its old locations to null.
          </li>
        </ol>
        <p>
          When a piece is placed, we need to check whether any rows are filled
          to then be removed from the board. This is accomplished by first
          getting all filled rows, destroying all the
          <code>Transform</code> objects in the array, and then moving all rows
          above the filled row down by one position, shifting each cube down by
          1 on the y-axis.
        </p>
        <h2>Piece Movement</h2>
        <p>
          Within the <code>Update()</code> function of <code>Piece.cs</code>, we
          have listeners for each of the arrow keys for left, right, down
          movement, as well as piece rotation.
        </p>
        <div className="captioned-image">
          <pre>
            <code className="language-csharp">{keyListener}</code>
          </pre>
          <p className="italics">
            An example key listener, which calls another helper function to move
            the piece.
          </p>
        </div>
        <h3>DAS and ARR</h3>
        <p>
          DAS and ARR are implemented by keeping track of the time in which a
          key is pressed. For DAS, we record the total time passed since a key
          is pressed in a helper variable, setting the counter to 0 upon initial
          press. When that time passes a set value, another condition is
          triggered that calls <code>Input.GetKey()</code>. ARR is then set by
          keeping track of the total time passed when the key is held down. When
          the time passes a set ARR value, we continue moving the piece,
          resetting the time value to 0. Altogether, our DAS and ARR
          implementation results in the following:
        </p>
        <div className="captioned-image">
          <pre>
            <code className="language-csharp">
              public float arr; public float das;{" "}
            </code>
          </pre>
          <p className="italics">
            The lower the ARR the faster the repeat rate. The higher the DAS the
            higher the delay before repeating.
          </p>
        </div>
        <div className="captioned-image">
          <pre>
            <code className="language-csharp">{dasarr} </code>
          </pre>
          <p className="italics">
            ARR is required to limit the rate that GetKey() is triggered.
          </p>
        </div>
        <h2>Piece Rotation</h2>
        <p>
          Piece rotation is performed by doing a simple 90 degree rotation on
          the z-axis around the first child of the tetrominio.
        </p>
        <pre>
          <code className="language-csharp">
            transform.RotateAround(transform.GetChild(0).position, new
            Vector3(0, 0, 1), angle);
          </code>
        </pre>
        <p>
          Sometimes, if the player attempts to rotate a piece, the position the
          piece would normally occupy after rotation is obstructed, either by a
          another piece, the floor, or a wall. According to the SRS, the game
          will attempt to "kick" the pice into another position nearby.
        </p>
        <p>
          For each piece, there exists 5 possible positions to be tested when a
          rotation is performed. Since the piece exists in 4 different states
          for each rotation, we have a total of 20 possible locations for a
          piece. In the table below, each row indicates either a right (R) or
          left (L) rotation, and the coordinates indicate the shift on the x and
          y axis to be tested after the rotation. Convention states that a
          positive x value means right, and a positive y value represents
          upwards.
        </p>
        <div className="captioned-image">
          <img className="image" style={{ width: "60%" }} src={wallkick} />
          <p className="italics">
            Wall kick data for each tetrominio. Note that since we only perform
            clockwise rotations, we only focus on the first 4 rows of each
            table.
          </p>
        </div>
        <p>
          In our implementation, we store these states in a dictionary and count
          the number of rotations modulo 4 to grab the correspoding list of 5
          states to test.
        </p>
        <pre>
          <code className="language-csharp">{dictionary}</code>
        </pre>
        <h2>Upcoming Pieces</h2>
        <p>
          Upcoming pieces are stored in an array of GameObjects and are updated
          each time a new piece is spawned. Each piece within the array is then
          drawn on the right side of the board. When a new piece is spawned, we
          take the first piece in the array and instantiate that piece to the
          board. We then translate the rest of the upcoming pieces up the y-axis
          and then generate a random piece to replace the last slot.
        </p>
        <div className="captioned-image">
          <img className="image" src={upcoming} />
          <p className="italics">The board with upcoming pieces on the right</p>
        </div>
        <h2>Piece Shadows</h2>
        <p>
          Each piece displays a shadow previewing where it would land once
          placed. Shadow pieces are implemented using the same class as normal
          pieces, and a pointer to the shadow is recorded in the corresponding
          normal piece. Then, the piece class moves its shadow whenever it moves
          left or right or rotates. Shadow pieces aren't recorded in the board
          grid, so they don't occupy any space. To determine the shadow's
          position, we calculate the falling piece's lowest possible position on
          the board given the current pieces, and we update as it moves.
        </p>
        <div className="captioned-image">
          <img className="image" src={shadow} />
          <p className="italics">A piece with its corresponding shadow</p>
        </div>
        <p>
          To render the shadow piece, we created copies of the tetromino prefabs
          with a white color.
        </p>
        <div className="captioned-image">
          <div className="image-grid">
            <img className="image" src={transparent_i} />
            <img className="image" src={transparent_s} />
            <img className="image" src={transparent_t} />
          </div>
          <p className="italics">Copies of the tetromino prefabs</p>
        </div>
        <h2>Holding Pieces</h2>
        <p>
          Holding pieces is a commonly used tactic in Tetris, allowing players
          hold the currently active piece and move on to the next, or swap the
          currently active piece with a more beneficial one. To implement this
          feature, we kept a reference to both the current active piece as well
          as the held piece. When the player presses "C", we simply swap the two
          locations and make the held piece active.
        </p>
        <div className="captioned-image">
          <img className="image" src={held} />
          <p className="italics">A held piece in the top left location</p>
        </div>
        <h2>Other Features</h2>
        <p>
          The camera is moveable! Use the mouse and arrow keys to move around
          the scene.
        </p>
        <h1>Reflections and Next Steps</h1>
        <p>
          Altogether, this project was a great foray into game development using
          Unity. We learned several things, including but not limited to:
        </p>
        <ul>
          <li>
            Creating 3D objects and managing their relative coordinates in world
            space
          </li>
          <li>Creating materials and applying them to objects</li>
          <li>Coding in C# and scripting within Unity's game loop</li>
          <li>
            Efficiency within games; we tried to reduce the total number of
            computations and the number of pieces store in the scene
          </li>
          <li>
            Planning and Design: even with a simple game like Tetris, we had to
            make several design choices and abstraction decisions wihtin our
            codebase to reduce complexity.
          </li>
          <li>How to incorporate scripts with Unity's game objects</li>
        </ul>
        <p>
          Other additional feaetures that we could pursue with this project
          include the following:
        </p>
        <ul>
          <li>Having a scoring system</li>
          <li>
            Having a 2 player mode that allows players to "send lines" over to
            the other person
          </li>
          <li>Make DAS and ARR adjustable within the game's UI</li>
          <li>
            Make the game TRULY 3D: add an extra dimension to the game board on
            the z-axis
          </li>
        </ul>
        <h1>External Resources</h1>
        The following resources were used for the creation of this project:
        <ul>
          <li>
            Unity Tutorials: A lot of the learning process came from the Unity
            beginner tutorials, which helped us navigate the editor, how to draw
            items on the scene, and how to organize scripts and objects.
          </li>
          <li>
            Tetris Tutorials:
            <ul>
              <li>
                <a href="https://ghost-together.medium.com/tetris-turns-35-cfcf04c4f2bb">
                  https://ghost-together.medium.com/tetris-turns-35-cfcf04c4f2bb
                </a>
                : Depicts a way to make Tetris in javascript. This tutorial gave
                us the inspiration of how to implement movement in a game
                enviornment.
              </li>
              <li>
                <a href="https://noobtuts.com/unity/2d-tetris-game">
                  https://noobtuts.com/unity/2d-tetris-game
                </a>
                : A tutorial on how to make 2D tetris in Unity. We used this
                mostly to help us with the object representation (grid of
                Transforms) and how to integrate scripts with the pieces and
                board. Here are the ideas that we took from this tutorial:
                <ul>
                  <li>
                    Adding the tetrominio prefabs manually to the TetrisBoard
                    scene graph object
                  </li>
                  <li>
                    Representing the grid as a 2D array of Transform objects
                  </li>
                  <li>
                    Checking if the piece is in a valid grid position by
                    checking the parent of the block
                  </li>
                </ul>
              </li>
              <li>
                <a href="https://tetris.wiki/Tetris.wiki">
                  https://tetris.wiki/Tetris.wiki
                </a>
                : The Tetris wiki. Mainly to help with piece design, rotation,
                and movement.
              </li>
            </ul>
          </li>
          <li>
            Other code examples:
            <ul>
              <li>
                Mouse camera movement:
                <a href="https://gist.github.com/KarlRamstedt/407d50725c7b6abeaf43aee802fdd88e">
                  Github link
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CS175;
