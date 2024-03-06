const formResult = document.getElementById('form-result');
const selectAllButton = document.getElementById('select-all-btn');
const resetButton = document.getElementById('reset-form');

// maps each related document element by id and places them in arrays
const blurFields = ['street-name', 'suburb', 'postcode', 'dob'].map(id => document.getElementById(id));
const changeFields = ['building-type', 'features-heating', 'features-airconditioning', 'features-pool', 'features-sandpit'].map(id => document.getElementById(id));
const featureCheckboxes = ['features-heating', 'features-airconditioning', 'features-pool', 'features-sandpit'].map(id => document.getElementById(id));

const renderFormResult = () => {
    let age = 0;
    let result = 'You are ';
    result += age + ' years old, ';
    result += 'and your address is ' + document.getElementById('street-name').value + ', ';
    result += document.getElementById('suburb').value + ', ';
    result += document.getElementById('postcode').value + ', Australia. ';
    result += 'Your building is a'
    // adds 'n' to make 'an' if the value is 'apartment' (starts with a vowel)
    if (document.getElementById('building-type').value === 'apartment') result += 'n';
    // replaces the first letter of the building type with its capital letter (ie. house -> House, apartment -> Apartment)
    result += ' ' + document.getElementById('building-type').value.charAt(0).toUpperCase() + document.getElementById('building-type').value.slice(1);
    result += ', and it has ';
    if (document.getElementById('features-heating').checked) result += 'Heating, ';
    if (document.getElementById('features-airconditioning').checked) result += 'Air Conditioning, ';
    if (document.getElementById('features-pool').checked) result += 'Pool, ';
    if (document.getElementById('features-sandpit').checked) result += 'Sandpit, ';
    formResult.value = result;
};

blurFields.forEach(field => {
    field.addEventListener('blur', renderFormResult);
});

changeFields.forEach(field => {
    field.addEventListener('change', renderFormResult);
});

const updateSelectAllButton = () => {
    if (featureCheckboxes.every(checkbox => checkbox.checked)) {
        selectAllButton.value = 'Deselect All';
    } else {
        selectAllButton.value = 'Select All';
    }
};

featureCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', updateSelectAllButton);
});

selectAllButton.addEventListener('click', () => {
    const allChecked = featureCheckboxes.every(checkbox => checkbox.checked);
    featureCheckboxes.forEach(checkbox => checkbox.checked = !allChecked);
    updateSelectAllButton();
    renderFormResult();
});

resetButton.addEventListener('click', () => {
    document.querySelector('form').reset();
    updateSelectAllButton();
    formResult.value = '';
});