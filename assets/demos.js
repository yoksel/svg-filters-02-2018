'use strict';

(function(){
  const filterElem = document.querySelector('filter');
  const filterTargets = document.querySelectorAll('.filter-target');

  const classes = {
    panel: 'controls-panel',
    panelVertical: 'controls-panel--vertical',
    panelGroup: 'controls-panel__group',
    panelGroupName: 'controls-panel__group-name',
    button: 'controls__button',
    buttonSelected: 'controls__button--selected',
    buttonLastSelected: 'controls__button--last-selected',
    buttonCurrentFilter: 'controls__button--current-filter',
  };

  const controls = [];
  let currentFilterButton = null;
  const controlsPanel = document.createElement('div');
  controlsPanel.classList.add(classes.panel);

  // ------------------------------

  function handleFiltersList() {
    const filtersGroups = document.querySelectorAll('.filters-group');
    filtersGroups.forEach(filtersGroup => {
      const filters = filtersGroup.querySelectorAll('filter');

      const group = document.createElement('div');
      group.classList.add(classes.panelGroup);

      const groupName = document.createElement('h2');
      groupName.classList.add(classes.panelGroupName);
      groupName.innerHTML = filtersGroup.id;

      group.appendChild(groupName);

      filters.forEach((filter) => handleFilter({
        filter,
        group
      }));

      controlsPanel.appendChild(group);
    });

    document.body.appendChild(controlsPanel);
    controlsPanel.classList.add(classes.panelVertical);
    document.body.insertBefore(controlsPanel,document.body.firstChild);
  }

  window.handleFiltersList = handleFiltersList;

  // ------------------------------

  function handleFilter({filter, group}) {
    const filterId = filter.id;

    const filterData = {
      id: filterId,
      name: filter.dataset.name,
      elemType: 'filter'
    };

    const button = createButton(filterData);
    group.appendChild(button);
  }

  // ------------------------------

  function handlePrimitivesList() {
    const primitives = document.querySelectorAll('filter > *');
    primitives.forEach((primitive, index) => handlePrimitive({primitive, index}));
  }

  window.handlePrimitivesList = handlePrimitivesList;

  // ------------------------------

  function handlePrimitive({primitive, index}) {
    const result = primitive.result.baseVal;

    const primitiveData = {
      index: index,
      id: result,
      elem: primitive,
      elemType: 'primitive'
    };

    const button = createButton(primitiveData);
    controls.push(button);
    controlsPanel.appendChild(button);
    document.body.appendChild(controlsPanel);

    primitive.remove();
  }

  // ------------------------------

  function createButton(itemData) {
    const index = itemData.index || 0;
    const elemType = itemData.elemType;
    const button = document.createElement('button');
    let isSelected = false;
    let added = null;

    button.type = 'button';
    button.classList.add(classes.button);
    button.innerHTML = itemData.name || itemData.id;

    if(elemType === 'filter') {
      button.addEventListener('click', toggleFilter);
    }
    else if(elemType === 'primitive') {

      if(index > 0) {
        button.disabled = true;
      }
      button.addEventListener('click', togglePrimitive);
    }

    function toggleFilter() {
      if(currentFilterButton) {
        currentFilterButton.classList.remove(classes.buttonCurrentFilter)
      }
      currentFilterButton = button;
      currentFilterButton.classList.add(classes.buttonCurrentFilter);

      filterTargets.forEach(target => {
        target.setAttribute('filter', `url(#${itemData.id})`);
      })
    }

    function togglePrimitive() {
      isSelected = !isSelected;

      if(added) {
        added.remove();
        added = null;
      }
      else {
        added = filterElem.appendChild(itemData.elem);
      }

      checkEnabledControls({index, isSelected});
    }

    return button;
  }

  // ------------------------------

  function checkEnabledControls(params) {
    const isSelected = params.isSelected;
    const currentIndex = params.index;
    const prev = controls[currentIndex - 1] || null;
    const next = controls[currentIndex + 1] || null;
    const currentButton = controls[currentIndex];
    const isCurrentButtonOn = currentButton.classList

    currentButton.classList.toggle(classes.buttonSelected);
    currentButton.classList.toggle(classes.buttonLastSelected);
    console.log(currentButton);


    if(next) {
      if(isSelected === true) {
        next.disabled = false;
      }
      else {
        next.disabled = true;
      }
    }

    if(prev) {
      if(isSelected === true) {
        prev.disabled = true;
        prev.classList.remove(classes.buttonLastSelected);
      }
      else {
        prev.disabled = false;
        prev.classList.add(classes.buttonLastSelected);
      }
    }
  }
}());
