<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<!DOCTYPE html>
<html>
<head>
<title>Game Site :: Tic Tac Toe</title>
<link rel="stylesheet"
    href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
<link rel="stylesheet"
    href="<c:url value="/resource/stylesheet/ticTacToe.css" />" />
    <meta name="webSocketPath" content="<c:url value="/ticTacToe/${gameId}/${username}">
        <c:param name="action" value="${action}" />
    </c:url>">
    <meta name="gameId" content="${gameId}"/>
    <meta name="username" content="${username}"/>
    <meta name="action" content="${action}"/>
</head>
<body>
    <div id="mountNode" class="container"></div>
    <div id="modalWaiting" class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="waitingModalLabel">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 class="modal-title" id="waitingModalLabel">Modal title</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-12" id="modalWaitingBody">hehe</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->

    <div id="modalError" class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="errorModalLabel">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4>Error</h4>
                </div>
                <div class="modal-body" id="modalErrorBody">A blah error
                    occurred.</div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <div id="modalGameOver" class="modal fade" tabindex="-1" role="dialog"
        aria-labelledby="gameOverModalLabel">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;
                    </button>
                    <h3>Game Over</h3>
                </div>
                <div class="modal-body" id="modalGameOverBody">&nbsp;</div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>
    <script src="http://code.jquery.com/jquery-1.12.1.min.js"></script>
    <script
        src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="https://fb.me/react-0.14.2.js"></script>
    <script src="https://fb.me/react-dom-0.14.2.js"></script>
    <script
        src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
    <script type="text/babel"
        src="<c:url value="/resource/javascript/game.jsx" />"></script>
</body>
</html>