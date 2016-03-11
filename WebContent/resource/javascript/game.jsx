(function(){
var modalError = $("#modalError");
var modalErrorBody = $("#modalErrorBody");
var modalWaiting = $("#modalWaiting");
var modalWaitingBody = $("#modalWaitingBody");
var modalGameOver = $("#modalGameOver");
var modalGameOverBody = $("#modalGameOverBody");
var opponentUsername;
var gameId = $("meta[name=gameId]").attr("content");;
var username = $("meta[name=username]").attr("content");;
var webSocketPath = $("meta[name=webSocketPath]").attr("content");

if(!("WebSocket" in window))
{
    modalErrorBody.text('WebSockets are not supported in this ' +
            'browser. Try Internet Explorer 10 or the latest ' +
            'versions of Mozilla Firefox or Google Chrome.');
    modalError.modal('show');
    return;
}
modalWaitingBody.text('Connecting to the server.');
modalWaiting.modal({ keyboard: false, show: true });

 
function initArray(length, value) {
    var arr = [], i = 0;
    arr.length = length;
    while (i < length) { arr[i++] = value; }
    return arr;
}

var PlayerOneRow = React.createClass({
  render: function(){
    return (
    <div id="playerOneRow">
      <span><strong>You: </strong></span> <span>{this.props.playerName}</span>
    </div>); 
  }
});

var PlayerTwoRow = React.createClass({
  render: function(){
    return (
    <div id="playerTwoRow">
      <span><strong>Opponent: </strong></span> <span>{this.props.playerName}</span>
    </div> );
  }
});

var GameStatusRow = React.createClass({
  render: function (){
    return (
    <div id="gameStatusRow">
      <span><strong>Status:</strong></span> <span>{this.props.gameStatus}</span>
    </div>);
  }
});
var GameCell = React.createClass({

  handleCellClick:function(e){
    if (!this.props.gameContainer.state.isMyTurn){
        alert("it is not your turn");
        // just for testing Opponent Move
        //this.props.gameContainer.props.handleOpponentMove(this.props.rowNum, this.props.colNum, this.props.gameContainer);
        return;
    }
    this.props.gameContainer.props.move(this.props.rowNum, this.props.colNum, this.props.gameContainer);
    
  },

  render:function(){
    var gridStatusArray = this.props.gameContainer.state.gridStatusArray;
    var index = this.props.rowNum * 3 + this.props.colNum;
    var curGridStatus =  gridStatusArray[index];
    var tempClassNameString = "game-cell " + (curGridStatus ===0 ?  "game-cell-selectable " : "");
    if (curGridStatus  !== 0){
        if (curGridStatus  === 1){
            tempClassNameString = tempClassNameString + "game-cell-player ";
        } else {
            tempClassNameString = tempClassNameString + "game-cell-opponent ";
        }
    }
    return (
      <div id={this.props.id} className={tempClassNameString} 
       onClick={ curGridStatus  !==0 ? null: this.handleCellClick}></div>
    );
  }
});
var GridRow= React.createClass({
  render:function(){
    return (
      <div>
        <GameCell gameContainer={this.props.gameContainer} rowNum={this.props.rowNum} colNum={0} key={'r'+this.props.rowNum+'c0'}/>
        <GameCell gameContainer={this.props.gameContainer} rowNum={this.props.rowNum} colNum={1} key={'r'+this.props.rowNum+'c1'}/>
        <GameCell gameContainer={this.props.gameContainer} rowNum={this.props.rowNum} colNum={2} key={'r'+this.props.rowNum+'c2'}/>
      </div>
    );
  }
});

var GridsPanel = React.createClass({
  render: function(){
    var rows = [];
    for(var i =0; i < 3; i++){
      rows.push(<GridRow  gameContainer={this.props.gameContainer} key={"gridRow"+i} rowNum={i}/>);
    }
    return (<div>{rows}</div>);
  }
});

var GameContainer = React.createClass({
  getInitialState: function(){
    // 0 represent unoccupied, 1 represent occupied by me, 2 represent occupied by opponent
    var gridStatusArray = initArray(9,0); 
    return {
        opponentUsername : "[unknown]",
        isMyTurn:true,
        status:null,
        gridStatusArray:gridStatusArray
    };
  },
  
  setValueRowCol: function(row , col, val){
    this.state.gridStatusArray[row*3 + col] = val;
    return this.state.gridStatusArray;
  },
  componentWillMount: function(){
    var server = this.props.server;
    var gameContainerRef = this;
    var opponentUsername;
    var isMyTurn;
    server.onmessage = function(event) {
        var message = JSON.parse(event.data);
        if(message.action == 'gameStarted') {  // this will be send to both side
            if(message.game.player1 == username)
                opponentUsername = message.game.player2;
            else
                opponentUsername = message.game.player1;
            isMyTurn = message.game.nextMoveBy == username;
            modalWaiting.modal('hide');
            gameContainerRef.setState({
              opponentUsername: opponentUsername, 
              isMyTurn:isMyTurn,
              status: isMyTurn?"It is your play":"Waiting for opponent"              
              });
        } else if(message.action == 'opponentMadeMove') {
            var row = Number.parseInt(message.move.row);
            var column = Number.parseInt(message.move.column);
            gameContainerRef.props.handleOpponentMove(row, column, gameContainerRef);
        } else if(message.action == 'gameOver') {
            //toggleTurn(false, 'Game Over!');
            if(message.winner) {
                modalGameOverBody.text('Congratulations, you won!');
            } else {
                modalGameOverBody.text('User "' + opponentUsername + '" won the game.');
            }
            modalGameOver.modal('show');
        } else if(message.action == 'gameIsDraw') {
            //toggleTurn(false, 'The game is a draw. ' +'There is no winner.');
            modalGameOverBody.text('The game ended in a draw. ' + 'Nobody wins!');
            modalGameOver.modal('show');
        } else if(message.action == 'gameForfeited') {
            //toggleTurn(false, 'Your opponent forfeited!');
            modalGameOverBody.text('User "' + opponentUsername + '" forfeited the game. You win!');
            modalGameOver.modal('show');
        }
    };
 
  },
  
  getDefaultProps: function(){
     // build connection with server at this place
    var gameContainerRef = this;
    var server;
    try {
        server = new WebSocket('ws://' + window.location.host + webSocketPath );
    } catch(error) {
        modalWaiting.modal('hide');
        modalErrorBody.text(error);
        modalError.modal('show');
        return;
    }
    
    server.onopen = function(event) {
        modalWaitingBody.text('Waiting on your opponent to join the game.');
        modalWaiting.modal({ keyboard: false, show: true });
    };
    window.onbeforeunload = function() { server.close();};
    server.onclose = function(event) {
        if(!event.wasClean || event.code != 1000) {
            modalWaiting.modal('hide');
            modalErrorBody.text('Code ' + event.code + ': ' + event.reason);
            modalError.modal('show');
        }
    };
    server.onerror = function(event) {
        modalWaiting.modal('hide');
        modalErrorBody.text(event.data);
        modalError.modal('show');
    };
     
     return { 
      server: server,
      username : $("meta[name=username]").attr("content"),
      move:function(row, column, gameContainerRef){
        var tempGridStatuses = gameContainerRef.setValueRowCol(row, column, 1);
        var server = gameContainerRef.props.server;
        if (server != null){
            server.send(JSON.stringify({
                row : row,
                column : column
            }));
            gameContainerRef.setState({isMyTurn:false, status:"waiting for opponent...", gridStatusArray: tempGridStatuses});
        } else {
          alert("connection error, server is falsy value");
        }
      },
      handleOpponentMove: function(row, col,gameContainerRef ){
        var tempGridStatuses = gameContainerRef.setValueRowCol(row,col, 2);
        // update view
        gameContainerRef.setState({isMyTurn:true, status:"It is your turn", gridStatusArray: tempGridStatuses});
      }
    };
  },

  render:function(){
    return (
      <div className="gameContainer">
        <h3 id="gameTitle">"Tic Tac Toe": JavaEE WebSocket and React.js</h3>
        <PlayerOneRow playerName={this.props.username} />
        <PlayerTwoRow playerName={this.state.opponentUsername} />
        <GameStatusRow gameStatus={this.state.status} />
        <GridsPanel gameContainer ={this} />
      </div>
    );
  }
});


ReactDOM.render(
  <GameContainer/>,
  document.getElementById("mountNode")
);




})();
