let priceTotal = 0;

$('document').ready(function(){
    $('#name').focus();
    appendAndHideOtherRoleField();
    configureShirtOptions();
    $('label input:checkbox').on('change', handleTimeOptions);
    $('fieldset.activities').append(`<h3>Price total: $<span class="price-total">${priceTotal}</span></h3>`);
    configureInitialPayment();
    $('#payment').on('change', configurePaymentVisibility);
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

const handleTimeOptions = (elem) => {
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

const configurePaymentVisibility = (elem) => {
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