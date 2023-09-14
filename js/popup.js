document.addEventListener('DOMContentLoaded', function () {
  let cb_start = document.querySelector('#automatic-start');
  let btn_hide = document.querySelector("#hide");
  let btn_show = document.querySelector("#show");

  function call_func(param) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'executeFunction', parameter: param});
    });
  }

  // Load the initial state from chrome.storage and set the checkbox accordingly
  chrome.storage.local.get(['start_with'], function (result) {
    const loaded = result.start_with || false;
    cb_start.checked = loaded;
    call_func(!loaded)
  });

  // Add an event listener for the checkbox change event
  cb_start.addEventListener('change', function () {
    // Save the checkbox state to chrome.storage
    chrome.storage.local.set({
      'start_with': cb_start.checked
    });
    call_func(!cb_start.checked)
  });

  // Add an event listener for the button click event
  btn_hide.addEventListener('click', () => {
    call_func(false)
  });

  // Add an event listener for the button click event
  btn_show.addEventListener('click', () => {
    call_func(true)
  });
});
