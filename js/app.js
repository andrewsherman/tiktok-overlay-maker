  $( window ).on( "load", function() {
  $add_button = $('#add-caption-button');

  function populateEmojis(captionElement, keyword, clickX, clickY) {
    keyword = keyword.toString();
    keyword = keyword.replaceAll("\n", " ");
    console.log("populateEmojis(keyword: "+ keyword +")");

    existingEmojiSugBox = $('#emoji-suggestion-box');
    if (existingEmojiSugBox) {
      existingEmojiSugBox.remove();
    }

    let result = fuse.search(keyword);
    let emojiList = '';
    for (var i = 0; i < 6; i++) {
      emojiList += result[i].emoji;
    }
    const emojiSelection = $(_.template($('[data-id="emoji-suggestions"]').html())());
    $('#emoji-keyword', emojiSelection).text(keyword);
    $('#emoji-suggestions', emojiSelection).text(emojiList);
    $('#add-new-emojis > [data-id="emojipedia-link"]', emojiSelection).attr("href", "https://emojipedia.org/search/?q="+keyword.toLowerCase().split(" ").join('+') );

    // CSS styling to position
    oneEM = parseFloat(captionElement.css("font-size").split('px')[0]);
    emojiSelection.css("position", "absolute");
    console.log("top: " + String(clickY/oneEM + 1) + "em");
    emojiSelection.css("top", String(clickY/oneEM + 1) + "em");

    $(captionElement).append(emojiSelection);

    twemoji.parse($('#emoji-suggestions', emojiSelection)[0], {folder: 'svg', ext: '.svg'});
  }

  addCaptionFunc = function(newCaption, original){
    const deleteButton = $('button[data-id="delete"]', newCaption);
    const duplicateButton = $('button[data-id="duplicate"]', newCaption);
    const captureButton = $('button[data-id="capture"]', newCaption);

    duplicateButton.click(function(e) {
      const duplicateCaption = $(this).parent().clone();
      addCaptionFunc(duplicateCaption, $(this).parent());
    });

    deleteButton.click(function(e) {
      $(this).parent().remove();
    });

    captureButton.click(function() {
      html2canvas($('.caption', $(this).parent())[0])
        .then(canvas => {
          document.body.appendChild(canvas)
      });
    });
    console.log($('.caption > p', newCaption).html());
    console.log($('.caption > p', newCaption));
    $('.caption > p', newCaption).mouseup(
      function(evt){
        const selectedText = window.getSelection();
        if (selectedText.toString()) {
          const x = evt.offsetX;
          const y = evt.offsetY;
          populateEmojis($(this), selectedText, x, y);
        }
      }
    );
    if (original) {
      $(original).after(newCaption);
    }else {
      $('#add-caption-container').before(newCaption);
    }

  }

  $add_button.click(function() {
    const newCaption = $(_.template($('[data-id="caption"]').html())());
    addCaptionFunc(newCaption, null);
  });

  twemoji.parse(document.body, {folder: 'svg', ext: '.svg'});

});
