$(function(){

  function buildHTML(message){
    if (message.image) {
      var html =
        `<div class="chat-main__message-list__message" data-message-id=${message.id}>
          <div class="chat-main__message-list__message__upper">
            <div class="chat-main__message-list__message__upper__user-name">
              ${message.user_name}
            </div>
            <div class="chat-main__message-list__message__upper__date">
              ${message.created_at}
            </div>
          </div>
          <div class="chat-main__message-list__text">
            <img class="lower-message__image" src=${message.image} >
          </div>
        </div>`
      return html;
    } else {
      var html =
        `<div class="chat-main__message-list__message" data-message-id=${message.id}>
          <div class="chat-main__message-list__message__upper">
            <div class="chat-main__message-list__message__upper__user-name">
              ${message.user_name}
            </div>
            <div class="chat-main__message-list__message__upper__date">
              ${message.created_at}
            </div>
          </div>
          <div class="chat-main__message-list__text">
            <p class="lower-message__content">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-main__message-list').append(html);
      $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      $('.new_message')[0].reset();
      $('.form__submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })
  var reloadMessages = function() {
    last_message_id = $('.chat-main__message-list__message:last').data("message-id");
    console.log(last_message_id);
    $.ajax({
      url: "api/messages",
      type: 'GET',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      console.log(messages);
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.chat-main__message-list').append(insertHTML);
        $('.chat-main__message-list').animate({ scrollTop: $('.chat-main__message-list')[0].scrollHeight});
      }
    })
    .fail(function() {
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});

