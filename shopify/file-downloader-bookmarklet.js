let header_el = document.querySelector('h1');
let table_rows = document.querySelectorAll('table tr');
let file_links = [];

async function storeResults() {
  return navigator.clipboard.readText();
}

function copyResults(links) {
  let output = ""
  for (let i=0;i<links.length;i++) {
    output += links[i]+",";
  }
  navigator.clipboard.writeText(output);
  console.log("Links saved in clipboard");
}


header_el.addEventListener('click', async function() {
  for (let i=1;i<table_rows.length;i++) {
    let link_button = table_rows[i].querySelectorAll('button')[1];
    link_button.click();
    let result = await storeResults();
    file_links.push(result);
  }
  copyResults(file_links);
});