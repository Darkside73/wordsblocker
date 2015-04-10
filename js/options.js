$(function() {
  var manifest = chrome.runtime.getManifest();
  $("#version>strong").text(manifest.version);
  chrome.storage.sync.get("words", function (data) {
    $("textarea[name='words']").text(data.words);
    $("form#formOptions").submit(function() {
      chrome.storage.sync.set({words: $(this).find("textarea").val()})
      $(this).find("input:submit").attr('disabled','disabled');
      return false;
    });
    $('#formOptions textarea').focus(function(){$('#formOptions input:submit').removeAttr('disabled')});
  });
});
