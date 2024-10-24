document.addEventListener('DOMContentLoaded', function() {
  let container = document.getElementById('price_matrix');
  let toggleButton = document.getElementById('price_matrix_orientation_switch');
  let isSwapped = false;  // Kezdetben a normál elrendezés van

  // Ha nincs már definiálva az `items`, akkor töltsük be a JSON fájlból
  if (typeof items === 'undefined') {
    fetch('items.json')
      .then(response => response.json())
      .then(data => {
        items = data;
        initializeGrid(items);
      })
      .catch(error => {
          console.error('Error loading JSON file:', error);
      });
  } else {
    // Ha van `items`, akkor azonnal használjuk
    initializeGrid(items);
  }

  function initializeGrid(items) {
    // A termék adatok sorba rendezése width, majd height alapján
    items.sort((a, b) => {
      if (a.width === b.width) {
        return a.height - b.height;
      }
      return a.width - b.width;
    });

    let heights = [...new Set(items.map(item => item.height))].sort((a, b) => a - b);
    let widths = [...new Set(items.map(item => item.width))].sort((a, b) => a - b);

    // A grid megjelenítése a felhasználói elrendezés alapján
    function renderGrid(isSwapped) {
      container.innerHTML = '';  // Töröljük a korábbi tartalmat
      let gridAreas = [];

      if (isSwapped) {
        let firstRow = ['empty'];
        widths.forEach(width => {
          firstRow.push(`label-width-${width}`);
        });
        gridAreas.push(firstRow.join(' '));

        heights.forEach(height => {
          let row = [`label-height-${height}`];
          widths.forEach(width => {
            row.push(`area-${width}${height}`);
          });
          gridAreas.push(row.join(' '));
        });
      } else {
        let firstRow = ['empty'];
        heights.forEach(height => {
          firstRow.push(`label-height-${height}`);
        });
        gridAreas.push(firstRow.join(' '));

        widths.forEach(width => {
          let row = [`label-width-${width}`];
          heights.forEach(height => {
            row.push(`area-${width}${height}`);
          });
          gridAreas.push(row.join(' '));
        });
      }

      container.style.display = 'grid';
      container.style.gridTemplateAreas = gridAreas.map(row => `"${row}"`).join(' ');
      container.style.gridTemplateColumns = `repeat(${isSwapped ? widths.length + 1 : heights.length + 1}, 1fr)`;
      container.style.gridTemplateRows = `repeat(${isSwapped ? heights.length + 1 : widths.length + 1}, auto)`;

      let emptyCorner = document.createElement('div');
      emptyCorner.className = 'label';
      emptyCorner.style.gridArea = 'empty';
      container.appendChild(emptyCorner);

      if (isSwapped) {
        widths.forEach(width => {
          let widthLabel = document.createElement('div');
          widthLabel.className = 'label';
          widthLabel.style.gridArea = `label-width-${width}`;
          widthLabel.innerHTML = `${width} cm`;
          container.appendChild(widthLabel);
        });

        heights.forEach(height => {
          let heightLabel = document.createElement('div');
          heightLabel.className = 'label';
          heightLabel.style.gridArea = `label-height-${height}`;
          heightLabel.innerHTML = `${height} cm`;
          container.appendChild(heightLabel);
        });
      } else {
        heights.forEach(height => {
          let heightLabel = document.createElement('div');
          heightLabel.className = 'label';
          heightLabel.style.gridArea = `label-height-${height}`;
          heightLabel.innerHTML = `${height} cm`;
          container.appendChild(heightLabel);
        });

        widths.forEach(width => {
          let widthLabel = document.createElement('div');
          widthLabel.className = 'label';
          widthLabel.style.gridArea = `label-width-${width}`;
          widthLabel.innerHTML = `${width} cm`;
          container.appendChild(widthLabel);
        });
      }

      // Termékek elhelyezése a gridben
      items.forEach(item => {
        let productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.dataset.width = item.width;
        productDiv.dataset.height = item.height;
        productDiv.dataset.size = item.size;
        productDiv.style.gridArea = `area-${item.width}${item.height}`;
        productDiv.innerHTML = `${item.price} Ft`;
        container.appendChild(productDiv);
      });
    }

    // Kezdeti grid megalkotása
    renderGrid(isSwapped);

    // Gomb eseményfigyelő a tengelyek átrendezéséhez
    toggleButton.addEventListener('click', function() {
      isSwapped = !isSwapped;  // Átváltjuk a tengelyeket
      renderGrid(isSwapped);
    });
  }
});
