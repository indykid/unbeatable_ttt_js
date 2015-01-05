Unbeatable TTT in JavaScript
=================

My first stab at unbeatable tictactoe, no fancy algorithms, just a set of rules based around the last move played.

##RESOURCES:

- This was the first article I looked at:
http://www.wikihow.com/Win-at-Tic-Tac-Toe
It was helpful but not comprehensive enough I felt.

- This was also handy at the beginning:
http://www.chessandpoker.com/tic_tac_toe_strategy.html

- THE defining resource for me was this book, that I stumbled upon while trying to learn how not to loose at Tic Tac Toe:
http://www.cs.jhu.edu/~jorgev/cs106/ttt.pdf


##PROCESS:

Before writing any code:

  I was determined, yet very intimidated. I was aware that there's some sort of common, yet quite complex algorithm that is used to solve TTT.
  On purpose I didn't do any research on that. I was hoping that towards the end of the process I might be able to see some patterns and may be able to isolate some sort of algorithm. I can report safely that I didn't arrive there just yet.

  I played gazilions of games, a third of my Moleskine is filled with grids of noughts and crosses.

  I wanted to define a set of strategies and I had a major FOMO, fear of missing out on some moves' variation from the opponent that would let the him/her win.

  Once I had narrowed down the possibilities, a weight was lifted off my shoulders. I finally felt I could start writing something.

  I have a hand drawn very messy looking diagram, once I get a chance I will create an image of it using some wireframing/mindmapping tool and will add it to the project.

During:
  
  Separation of Concerns, Separation of Concerns, Separation of Concerns...
  It took three iterations before I settled on the current model setup. It ain't perfect but it is much better than what I was starting out with.
  
After:
  
  Really curious about that elusive algorithm, really need to look into that without finding out the solution. Just want to know what the rationale behind it is.

  Turns out there 3 approaches to solving TTT:

  - Brute force: you precalcualte all of the posibilities
  - That algorithm: it's called MiniMax
  - Heuristic approach: this is what i understand my solution falls under

  I may just try to have a go at both, but first I should probably polish existing one.

##ACHIEVEMENT
  
  - I learnt a LOT 

##TODOS:

- add more tests for AI class
- refactor in AIPlayer
- review requirejs setup
- review my models... again

##EXCUSES:

- When I set out on this project I intended to build it in such a way that user could specify the size of the grid they wanted to play, however, I didn't get to that just yet. There are bits of funtionality that would have worked for any size grid, but strategies for AIPlayer (the core of the project, really) are not among those.

- First attempt at using RequireJS, still not quite figured it all out and if you are a pro at it then you may see something that may raise hairs on the back of your head.

- 90% of Board and Game model were written 'test first', however when I got to AIPlayer I wasn't quite as clear as to what I was doing logic wise. The few tests that are there for ai were written first. But majority of AIPlayer is not unit tested at all.


##WHAT YOU NEED TO RUN IT:

- Nothing other than browser and internet connection (for jQuery off the CDN), just open index.html with your browser and you are good to play my Unbeatable TTT... you are welcome :)


