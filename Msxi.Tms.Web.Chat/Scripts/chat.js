var countUnreadMsg = 0;
var blinkChat;

$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.parents('.panel').find('.panel-footer').slideUp();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-minus').addClass('glyphicon-plus');
    } else {
        if ($('#hddUnreadMsg').val() != 0) unreadMessage();

        $this.parents('.panel').find('.panel-body').slideDown();
        $this.parents('.panel').find('.panel-footer').slideDown();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        blinkUnreadMsg();
    }
});

$(document).on('click', '.icon_close', function (e) {
    //When user clicks on the 'x' icon to close the popup chat, I must handle the stop on signalR
    $.connection.hub.stop();
});


$(document).on('focus', '.panel-footer input.chat_input', function (e) {
    if ($('#hddUnreadMsg').val() != 0) unreadMessage();

    var $this = $(this);
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $('#minim_chat_window').removeClass('panel-collapsed');
        $('#minim_chat_window').removeClass('glyphicon-plus').addClass('glyphicon-minus');
    }
});
$(document).on('click', '.icon_close', function (e) {
    $("#chat_window_1").remove();
});

function unreadMessage(countUnreadMsg) {
    if (countUnreadMsg == undefined) {
        $('#headerName').text(' Chat - ' + hddNomeUser.value);
        $('#hddUnreadMsg').val(0);
        clearInterval(blinkChat);
        return;
    }
    if ($('#minim_chat_window').hasClass('panel-collapsed')) {
        countUnreadMsg = parseInt($('#hddUnreadMsg').val());

        if (countUnreadMsg == 0)
            countUnreadMsg = 1;
        else
            countUnreadMsg++;

        //var count = countUnreadMsg == 0 ? 1 : countUnreadMsg++;
        $('#hddUnreadMsg').val(countUnreadMsg);
        $('#headerName').text(' Chat(' + countUnreadMsg + ') - ' + hddNomeUser.value);
    }
}

function blinkUnreadMsg() {
    blinkChat = setInterval(function () {
        if ($('#minim_chat_window').hasClass('panel-collapsed') && $('#hddUnreadMsg').val() > 0) {
            $('#chatTitle').fadeOut('slow');
            $('#chatTitle').fadeIn('slow');
        }
    }, 3000);
}

function addDefaultWlcMsg() {
    if (hddAtendente.value != "") {
        // Add the message to the page.
        $('#divContainerMsg').append('<div class="row msg_container base_receive">' +
                                       '<div class="col-md-2 col-xs-2 avatar">' +
                                          '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">' +
                                       '</div>' +
                                       '<div class="col-md-10 col-xs-10">' +
                                         '<div class="messages msg_receive">' +
                                            '<p> Olá, em que posso lhe ajudar? </p>' +
                                            '<time datetime="">' + hddNomeUser.value + ' • ' + + ' hs</time>' +
                                         '</div>' +
                                       '</div>' +
                                     '</div>');
    }
}

function onNewUserConnected(chat) {
    chat.client.onUserConnected = function (userName, message, isAdmin) {
        changeControlsState(false);
        if (isAdmin) {
            addDefaultWlcMsg();
        }
    }
}

function onUserDisconnected(chat) {
    chat.client.onDisconnectedUser = function () {
        changeControlsState(true);
    }
}

function changeControlsState(disabled) {
    $('#btn-input, #btn-chat').prop('disabled', disabled);
    if (disabled) {
        $('#btn-input').attr('placeholder', 'O outro usuário saiu do chat.');
        $('#btn-input').css('background', 'rgba(255, 165, 165, 0.44)');
    }
    else
    {
        $('#btn-input').attr('placeholder', 'Escreva sua mensagem Aqui...');
        $('#btn-input').css('background', 'white');
    }
}

//SignalR script to update the chat page and send messages
$(function () {
    // Reference the auto-generated proxy for the hub.
    var chat = $.connection.chatHub;

    onNewUserConnected(chat);
    onUserDisconnected(chat);
    blinkUnreadMsg();

    // Create a function that the hub can call back to display messages.
    chat.client.addNewMessageToPage = function (name, message) {

        unreadMessage(0);

        if (hddNomeUser.value == name) {
            // Add the message to the page.
            $('#divContainerMsg').append('<div class="row msg_container base_sent">' +
                                           '<div class="col-md-10 col-xs-10">' +
                                             '<div class="messages msg_sent">' +
                                                '<p>' + htmlEncode(message) + '</p>' +
                                                '<time datetime="">' + name + ' • ' + + ' hs</time>' +
                                             '</div>' +
                                           '</div>' +
                                           '<div class="col-md-2 col-xs-2 avatar">' +
                                                '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">' +
                                           '</div>' +
                                        '</div>');
        }
        else {
            $('#divContainerMsg').append('<div class="row msg_container base_receive">' +
                                           '<div class="col-md-2 col-xs-2 avatar">' +
                                              '<img src="http://www.bitrebels.com/wp-content/uploads/2011/02/Original-Facebook-Geek-Profile-Avatar-1.jpg" class=" img-responsive ">' +
                                           '</div>' +
                                           '<div class="col-md-10 col-xs-10">' +
                                             '<div class="messages msg_receive">' +
                                                '<p>' + htmlEncode(message) + '</p>' +
                                                '<time datetime="">' + name + ' • ' + + ' hs</time>' +
                                             '</div>' +
                                           '</div>' +
                                         '</div>');
        }
    };

    // Set initial focus to message input box.
    $('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        $('#btn-chat').click(function () {
            // Call the Send method on the hub.
            chat.server.send($('#hddNomeUser').val(), $('#btn-input').val());
            // Clear text box and reset focus for next comment.
            $('#btn-input').val('').focus();
        });
    });
});

// This optional function html-encodes messages for display in the page.
function htmlEncode(value) {
    var encodedValue = $('<div />').text(value).html();
    return encodedValue;
}