let board_data = [];
let config = {
  "tableContainer": document.getElementById('board-table'),
  "numRows": 5,
  "numCols": 5,
  "cellData": {
    "value": "Hello",
    "status": "0"
  }
}

const buildTableCell = (cell_data) => {
  return `
    <td class="board-cell ${cell_data.status === "1" ? 'marked' : '' }">
      <input class="cell-input" value="${cell_data.value}" disabled />
    </td>
  `;
}

const buildTableRow = (row_data) => {
  let row_html = "";
  for (let i=0;i<row_data.length;i++) {
    row_html += buildTableCell(row_data[i]);
  }
  return row_html;
}

const displayBoardData = () => {
  let table_html = "";
  for (let i=0;i<board_data.length;i++) {
    table_html += `<tr>${buildTableRow(board_data[i])}</tr>`;
  }
  config.tableContainer.innerHTML = table_html;
}

const generateNewData = () => {
  let new_board_data = [];
  let cell_data = config.cellData;
  let numRows = config.numRows;
  let numCols = config.numCols;

  for (let i=0;i<numRows;i++) {
    let row_data = [];
    for (let k=0;k<numCols;k++) {
      row_data.push(cell_data);
    }
    new_board_data.push(row_data);
  }


  return new_board_data;
}

const saveBoardData = () => {
  
  let table_rows = document.querySelectorAll('.board-table tr');

  table_rows.forEach((row, rindex) => {
    let row_cells = row.querySelectorAll('.board-cell');
    row_cells.forEach((cell, cindex) => {
      board_data[rindex][cindex].value = cell.querySelector('input').value;

      cell.classList.contains('marked') ? board_data[rindex][cindex].status = "1" : board_data[rindex][cindex].status = "0";
    });
  });

  localStorage.setItem('bingo-board', JSON.stringify(board_data));
}

const loadBoardData = () => {
  return JSON.parse(localStorage.getItem('bingo-board')) || generateNewData();
}

const toggleEditMode = () => {
  let table_cells = document.querySelectorAll('.board-cell');
  table_cells.forEach(cell => {
    cell.classList.toggle('editing');
    let cell_inputs = cell.querySelectorAll('input');
    cell_inputs.forEach(input => {
      input.toggleAttribute('disabled');
    });
  });

  saveBoardData();
}

const init = () => {

  board_data = loadBoardData();

  displayBoardData(board_data);

  // Event Listeners
  let board_cells = document.querySelectorAll('.board-cell');
  board_cells.forEach(el => {
    el.addEventListener('click', (event) => {
      if (event.target.classList.contains('editing') || event.target.classList.contains('cell-input')) {
        return;
      }
      event.target.classList.toggle('marked');
      saveBoardData();
    })
  });

  let edit_button = document.querySelector('.edit-board');
  edit_button.addEventListener('click', toggleEditMode);

  let save_button = document.querySelector('.save-board');
  save_button.addEventListener('click', saveBoardData);
}

init();