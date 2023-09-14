chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'executeFunction') {
    update_tt(request.parameter);
  }
});

function update_tt(show_all) {
  // Scrape table "Poznámky"
  nds = document.querySelectorAll("#str1 table td:not([colspan]).odsazena")
  // Split numbers and content
  const numbers = [];
  let content = [];
  nds.forEach((node) => {
    if (node.getAttribute("valign") === "top") {
      numbers.push(node.innerHTML);
    } else {
      content.push(node.innerHTML);
    }
  });
  // Transform to objects
  const regex = /\d{1,2}\. \d{1,2}\. \d{4}/gm
  const regex_capture = /(\d{1,2})\. (\d{1,2})\. (\d{4})/
  const today = new Date()
  const scheduleVisible = {}
  for (i = 0; i < numbers.length; i++) {
    const key = numbers[i]
    let value = content[i].match(regex)
    if (value === null || show_all) {
      scheduleVisible[key] = true
    } else {
      // transform all dates to YYYY-MM-DD
      value.forEach((date, index, arr) => {
        arr[index] = date.replace(regex_capture, "$3-$2-$1")
      })
      scheduleVisible[key] = value.every((date) => {
        return new Date(date) >= today.setHours(0, 0, 0, 0)
      })
    }
  }
  // find block for each number in the timetable
  const sups = []
  document.querySelectorAll("sup").forEach((element) => {
    if (/\(\d{1,2}\)/.test(element.textContent)) {
      sups.push(element)
    }
  });

  sups.forEach(sup => {
    const visible = scheduleVisible[sup.innerHTML]
    // Remove sup tag if is in the past and from the bottom list
    if (visible) {
      sup.style.display = "inline"
      nds.forEach(node => {
        if (node.textContent.includes(sup.innerHTML)) {
          node.closest("tr").style.textDecoration = "none"
        }
      });
    } else {
      sup.style.display = "none"
      nds.forEach(node => {
        if (node.textContent.includes(sup.innerHTML)) {
          node.closest("tr").style.textDecoration = "line-through"
        }
      });
    }
    // Remove "bloková akce" 
    const blokAction = sup.closest("div").innerHTML.includes("Bloková akce")
    if (!visible & blokAction) {
      sup.closest("tr").style.display = "none"
    } else {
      sup.closest("tr").style.display = "table-row"
    }
  })
}
