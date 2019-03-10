let priceTotal = 0;

$('document').ready(function(){
    $('#name').focus();
    appendAndHideOtherRoleField();
    configureShirtOptions();
    $('label input:checkbox').on('change', handleTimeOptions);
    $('fieldset.activities').append(`<h3>Price total: $<span class="price-total">${priceTotal}</span></h3>`);
    configureInitialPayment();
    $('#payment').on('change', configurePaymentVisibility);
    configureValidationWarnings();
    $('form').on('submit', validateForm);
});

const appendAndHideOtherRoleField = () => {
    // Append 'other role input' as an option, and then hide it until 'other' is selected from the dropwdown menu
    const otherInputLabel = '<label for ="other_role">Other Role:</label>';
    const otherRoleInput = '<input id="other_role" name="other_role"/>';
    const otherRoleDiv = $('<div></div>').addClass('other_role_div').append(otherInputLabel, otherRoleInput);
    $('fieldset:first-of-type').append(otherRoleDiv);
    $('.other_role_div').hide();

    $('#title').on('change', function(){
        if ($(this).val() === 'other') {
            $('.other_role_div').show();
        } else {
            $('.other_role_div').hide();
        }
    });
}

const configureShirtOptions = () => {
    // Create the two different shirt type arrays that we can use to display appropriate options later on
    $('#colors-js-puns').hide();
    const js_puns = [
        'cornflowerblue',
        'darkslategrey',
        'gold'
    ];
    const js_shirts = [
        'tomato',
        'steelblue',
        'dimgrey'
    ];

    const shirtOptions = $('#color option').toArray();

    // Every time our #design element changes, we check to see what the value of the selected theme is
    // We then display the appropriate shirts using the array values from above
    // Finally, if no theme is selected, we want to hide all options again
    $('#design').on('change', function(){
        if ($(this).val() === 'js puns') {
          shirtOptions.forEach(shirtOption => {
            if (js_puns.includes($(shirtOption).val())) {
                $(shirtOption).show();
            } else {
                $(shirtOption).hide();
            }
          });
          $('#color').val(js_puns[0]);
          $('#colors-js-puns').show();
        } else if ($(this).val() === 'heart js') {
            shirtOptions.forEach(shirtOption => {
                if (js_shirts.includes($(shirtOption).val())) {
                    $(shirtOption).show();
                } else {
                    $(shirtOption).hide();
                }
              });
              $('#color').val(js_shirts[0]);
              $('#colors-js-puns').show();
        } else {
            shirtOptions.forEach(shirtOption => {
                $(shirtOption).hide();
                $('#colors-js-puns').hide();
            });
        }
    });

}

const handleTimeOptions = elem => {
    // Create regex options for isolating the activity time and activity price from the selectedActivity's text
    const selectedTimeRegex = /((monday|tuesday|wednesday|thursday|friday|saturday|sunday) \d.m)/i;
    const selectedPriceRegex = /\$\d{3}/;
    const $checkbox = elem.target;
    const $parentLabel  = $($checkbox).parent()[0];
    const $parentLabelText = $($parentLabel).text();
    const selectedTimeRegexResult = $parentLabelText.match(selectedTimeRegex);
    let selectedTime = '';
    if (selectedTimeRegexResult !== null){    
        selectedTime = selectedTimeRegexResult[0];
    }
    const selectedPrice = $parentLabelText.match(selectedPriceRegex)[0].split('$')[1];
    // Check to make sure the selected activity has a designated activity time, and call the disableConflictingTimes option to handle checkbox enabling/disabling for confling times
    if (selectedTime != ''){
        disableConflictingTimes(selectedTime, $checkbox);
    }
    
    // If selectedActivity is checked, we want to add its price to the totalPrice; otherwise (if we're unchecking) we subtract
    let calculationType;
    if ($($checkbox)[0].checked) {
        calculationType = 'add'
    } else {
        calculationType = 'subtract'
    }
    calculateTotalPrice(selectedPrice, calculationType);
}

const disableConflictingTimes = (selectedActivityTime, selectedInput) => {
    // Find all child siblings of the selectedInput
    // Loop through them - if they contain the selectedActivityTime in their innerText,
    // disable them if the selectedInput is checked; otherwise, enable them
    const $selectedCheckbox = $(selectedInput);
    const checkboxSiblings = $($selectedCheckbox).parent().siblings();
    for (let sibling of checkboxSiblings){        
        if ($selectedCheckbox[0].checked) {
            if ($(sibling)[0].innerText.includes(selectedActivityTime)) {
                $($(sibling).children()[0]).attr('disabled', true);
           } 
        } else {
            if ($(sibling)[0].innerText.includes(selectedActivityTime)) {
                $($(sibling).children()[0]).attr('disabled', false);
           } 
        }
    }

}

const calculateTotalPrice = (selectedActivityPrice, calcType) => {
    // Convert the selectedActivityPrice to a number or set it to 0 if it's undefined,
    // then either add it or subtract it from the global priceTotal variable
    const selectedPrice = Number(selectedActivityPrice) || 0;
    if (calcType === 'add') {
        priceTotal += selectedPrice;
    } else {
        priceTotal -= selectedPrice;
        // Ensure that priceTotal can never go below $0
        if (priceTotal < 0) {
            priceTotal = 0;
        }
    }
    updatePriceUI();
}

const updatePriceUI = () => {
    $('.price-total').html(priceTotal);
}

const configureInitialPayment = () => {
    $('#payment').val('credit card');
    $('#paypal').hide();
    $('#bitcoin').hide();
    $('#credit-card').show();
}

const configurePaymentVisibility = elem => {
    const paymentType = ($(elem.target).val());
    switch (paymentType) {
        case 'paypal':
            $('#credit-card').hide();
            $('#bitcoin').hide();
            $('#paypal').show();
            break;
        case 'bitcoin':
            $('#credit-card').hide();
            $('#paypal').hide();
            $('#bitcoin').show();
            break;
        default:
            configureInitialPayment();
            break;
    }
}

const validateForm = event => {
    let formInvalid = true;
    const nameExists = validateNameField();
    const validEmail = validateEmailField();
    const activitySelected = validateActivities();
    let validCreditCard = true;
    if ($('#payment').val() === "credit card") {
        validCreditCard = validateCreditCard();
    }
    if (nameExists && validEmail && activitySelected && validCreditCard) {
        formInvalid = false;
    }
    if (formInvalid) {
        event.preventDefault();
    }
}

const validateNameField = () => {
    if ($('#name').val()) {
        console.log('name is valid');
        $('#name-warning').html('');
        return true;
    } else {
        console.log('name is invalid');
        $('#name-warning').html('Please enter a name');
        return false;
    }
}

const validateEmailField = () => {
    const email = $('#mail').val();
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (emailRegex.test(email)) {
        $('#email-warning').html('');
        return true;
    } else {
        $('#email-warning').html('Please enter a valid email address');
        return false;
    }
}

const validateActivities = () => {
    const checkboxes = $('input[type="checkbox"]');
    for (let checkbox of checkboxes) {
        if (checkbox.checked){
            $('#activities-warning').html('');
            return true;
        }
    }
    $('#activities-warning').html('Please select at least one activity');
    return false;
}

const validateCreditCard = () => {
    const ccNum = $('#cc-num').val();
    const zipcode = $('#zip').val();
    const cvv = $('#cvv').val();
    if (!Number(ccNum)){
        $('#cc-num-warning').html('Please insert only numeric digits');
        return false;
    } else {
        $('#cc-num-warning').html('');
    }

    if (ccNum.length > 16 || ccNum.length < 13) {
        $('#cc-num-warning').html('Credit card number must be between 13 and 16 characters');
        return false;
    } else {
        $('#cc-num-warning').html('');
    }

    if (!Number(zipcode) || zipcode.length !== 5){
        $('#zip-warning').html('Please enter a valid zip code');
        return false
    } else {
        $('#zip-warning').html('');
    }

    if (!Number(cvv) || ccv.length !== 3){
        $('#cvv-warning').html('Please enter a valid cvv');
        return false;
    } else {
        $('#cvv-warning').html('');
    }

    return true;
}

const configureValidationWarnings = () => {
    console.log('from configurevalidation options');
    $('#name').after('<div class="validation-warning" id="name-warning"></div>');
    $('#mail').after('<div class="validation-warning" id="email-warning"></div>');
    $('fieldset.activities').prepend('<div class="validation-warning" id="activities-warning"></div>');
    $('#cc-num').after('<div class="validation-warning" id="cc-num-warning"></div>');
    $('#zip').after('<div class="validation-warning" id="zip-warning"></div>');
    $('#cvv').after('<div class="validation-warning" id="cvv-warning"></div>');
}