# TicTacToe WebSocket game 
one online WebSocket based game for JSP servlet, React.js exercising  
![alt text](https://raw.githubusercontent.com/bovetliu/TicTacToe/master/WebContent/resource/image/tictactoedemo.jpg "Logo Title Text 1")
#### Backend side:
game logic: TicTacToeGame.java, one Servlet class
  * One Map<`GameId`, `TicTacToeGame`> `activeGames` holds active games, one Map<`GameId`,`InitGamerNameString`> `pendingGames` holds pending games  
  * Check game status at every move made by player 

game server: TciTacToeServer.java  
  * One EndPoint of a WebSocket server
  * Using one Hashtable of Game to maintain one queue of games. Every instances of Game holds sessions of two players and one instance of `TicTacToeGame` 
  * Gaming Move data are transmitted as Json. Data are casted by Jackson databind `ObjectMapper` at server side and by JavaScript `JSON.parse()` at client side

game Servlet: TicTacToeServlet.java
  * Simple JSP rendering and navigation

#### Frontend side
list.jsp: showing games available for join  
game.jsp: imported /resource/javascript/game.jsx, where main front-end JavaScript logic is. It use React.js to control UI of game grid panel.
  * There is one number array `gridStatusArray` of length 9. Every entry stores state of one grid. `0` for unoccupied, `1` for "occupied by me" `2` for "occupied by opponent"
  * Every time `gridStatusArray` changes, the game UI will re-render.
  * WebSocket Object `server` has `onmessage`,`onopen`,`onclose`, `onerror` functions. `onmessage` is core of them.
