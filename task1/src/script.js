const formResult = document.getElementById('form-result');
const selectAllButton = document.getElementById('select-all-btn');
const resetButton = document.getElementById('reset-form');

// maps each related document element by id and places them in arrays
const blurFields = ['street-name', 'suburb', 'postcode', 'dob'].map(id => document.getElementById(id));
const changeFields = ['building-type', 'features-heating', 'features-airconditioning', 'features-pool', 'features-sandpit'].map(id => document.getElementById(id));
const featureCheckboxes = ['features-heating', 'features-airconditioning', 'features-pool', 'features-sandpit'].map(id => document.getElementById(id));

const validDate = (date) => {
    // define the regex expression
    const regex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
    // compare the pattern of the given date with the pattern of the regex expression, return false if it doesnt match
    if (!regex.test(date)) return false;

    // split the date into its day/month/year integer parts
    const dateSplit = date.split("/");
    const day = parseInt(dateSplit[0]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[2]);

    // parse the date as a date object
    const dateObject = new Date(year, month, day);
    // if the date object returns NaN, return false
    if (isNaN(dateObject)) return false;

    // return false for obvious invalid dates
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 0) return false;

    // return false for days which do not exist in the certain month
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > monthLength[month - 1]) return false;

    // get the current date and split it into its day/month/year integer parts
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    // month starts from 0 in a date object, so add 1
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // return false for dates which are greater than the current date
    if (year > currentYear) return false;
    if (year === currentYear) {
        if (month > currentMonth) {
            return false;
        } else if (month === currentMonth && day > currentDay) {
            return false;
        }
    }

    // if all conditions pass (are valid), returns true
    return true;
};

const calcAge = (dob) => {
    // split the date of birth into its day/month/year integer parts
    const dateSplit = dob.split("/");
    const day = parseInt(dateSplit[0]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[2]);

    // parse the dob as a date object
    const dobDate = new Date(year, month, day);
    const currentDate = new Date();

    // initally set age to be the current year minus the dob year
    let age = currentDate.getFullYear() - dobDate.getFullYear();
    // check the difference between the months (+1 to account for the indexing of date.getMonth() starting from 0)
    let monthDiff = currentDate.getMonth() + 1 - dobDate.getMonth();
    // if it is negative, or equal with the dob day being higher than the current day, decrement age by 1
    if (monthDiff < 0 || (monthDiff === 0 &&  dobDate.getDate() > currentDate.getDate())) {
        age--;
    }

    return age;
};

const renderFormResult = () => {
    const streetName = document.getElementById('street-name').value;
    const suburb = document.getElementById('suburb').value;
    const postcode = document.getElementById('postcode').value;
    const dob = document.getElementById('dob').value;

    if (!streetName || streetName.length < 3 || streetName.length > 50) {
        formResult.value = 'Please input a valid street name';
        return;
    }
    if (!suburb || suburb.length < 3 || suburb.length > 50) {
        formResult.value = 'Please input a valid suburb';
        return;
    }
    if (!postcode || postcode.length !== 4 || isNaN(postcode)) {
        formResult.value = 'Please input a valid postcode';
        return;
    }
    if (!validDate(dob)) {
        formResult.value = 'Please enter a valid date of birth';
        return;
    }

    let text = 'You are ';
    text += calcAge(dob) + ' years old, ';
    text += 'and your address is ' + document.getElementById('street-name').value + ', ';
    text += document.getElementById('suburb').value + ', ';
    text += document.getElementById('postcode').value + ', Australia. ';
    text += 'Your building is a'
    // adds 'n' to make 'an' if the value is 'apartment' (starts with a vowel)
    if (document.getElementById('building-type').value === 'apartment') text += 'n';
    // replaces the first letter of the building type with its capital letter (ie. house -> House, apartment -> Apartment)
    text += ' ' + document.getElementById('building-type').value.charAt(0).toUpperCase() + document.getElementById('building-type').value.slice(1);
    text += ', and it has ';
    // map the features in the featureCheckboxes array that are checked with their value (name)
    let features = featureCheckboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    // if no features are checked, display 'no features'
    if (features.length === 0) {
        text += 'no features';
    // if only one feature is checked, display just that feature
    } else if (features.length === 1) {
        text += features[0];
    // if more than one feature is checked, display each feature separated by (, ), and add (, and ) before the last feature
    } else {
        text += features.slice(0, -1).join(', ') + ', and ' + features.slice(-1);
    }
    formResult.value = text;
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