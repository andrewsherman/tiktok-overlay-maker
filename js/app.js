  $( window ).on( "load", function() {
  $add_button = $('#add-caption-button');

  function populateEmojis(captionElement, keyword, clickX, clickY) {
    const editor = $(_.template($('[data-id="editor"]').html())());

    // setup emoji entry panel
    keyword = keyword.toString();
    keyword = keyword.replaceAll("\n", " ");

    existingEditor = $('#editor');
    if (existingEditor.length) {
      existingEditor.remove();
    }

    let result = fuse.search(keyword);
    let emojiList = '';
    for (var i = 0; i < 6; i++) {
      emojiList += result[i].emoji;
    }
    $('#emoji-keyword', editor).text(`\"${keyword}\"`);
    $('#emoji-suggestions', editor).text(emojiList);
    $('#add-new-emojis > [data-id="emojipedia-link"]', editor).attr("href", "https://emojipedia.org/search/?q="+keyword.toLowerCase().split(" ").join('+') );

    // close button
    $('#close-editor', editor).click(function() {
      editor.remove();
    });

    // CSS styling to position
    oneEM = parseFloat($('.caption > p', captionElement).css("font-size").split('px')[0]);
    editor.css("position", "absolute");

    editor.css("top", String(clickY/oneEM + 1) + "em");

    // load emojis
    twemoji.parse($('#emoji-suggestions', editor)[0], {folder: 'svg', ext: '.svg'});

    $(captionElement).append(editor);

    // setup css-formatter
    $cssFormatter = $('#css-formatter', editor);
    $cssFormatter.height($('#emoji-suggestion-box', editor).height());
    var offset = editor.offset(), maxOffset = $(window).width() - editor.width();
    console.log(offset);
    if (editor.offset().left < 0){
      console.log("off screen left");
      editor.css("left", String(0-captionElement.offset().left) + 'px');
    }else if (editor.offset().left > maxOffset) {
      editor.css("left", String(maxOffset-captionElement.offset().left) + 'px');
    }
  }

  addCaptionFunc = function(newCaption, original){
    existingEditor = $('#editor');
    if (existingEditor.length) {
      console.log("deleting editor");
      existingEditor.remove();
    }

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

    newCaption.mouseup(
      function(evt){
        $pElement = $('.caption > p', $(this));

        if (evt.target === $pElement[0] || $(evt.target).parent()[0] === $pElement[0]) {
          console.log($(evt.target).html());
          const selectedText = window.getSelection();
          if (selectedText.toString()) {
            const x = evt.offsetX;
            const y = evt.offsetY + $pElement[0].offsetTop; // take account of centering of paragraph element
            populateEmojis($(this), selectedText, x, y);
          }
        }
      }
    );

    $('.caption > p', newCaption).on("input", function (){
      twemoji.parse(this, {folder: 'svg', ext: '.svg'});
      if ($("#emoji-suggestion-box", newCaption).length){
        $("#emoji-suggestion-box", newCaption).remove();
      }
    });

    if (original) {
      $(original).after(newCaption);
    }else {
      $('#add-caption-button').before(newCaption);
    }

  }

  $add_button.click(function() {
    const newCaption = $(_.template($('[data-id="caption"]').html())());
    addCaptionFunc(newCaption, null);
  });

  twemoji.parse(document.body, {folder: 'svg', ext: '.svg'});

});
