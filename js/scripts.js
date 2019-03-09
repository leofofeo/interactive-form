let priceTotal = 0;

$('document').ready(function(){
    console.log('hello world');
    $('#name').focus();

    appendAndHideOtherRoleField();
    configureShirtOptions();
    $('label input:checkbox').on('change', handleTimeOptions);
    $('fieldset.activities').append(`<h3>Price total: $<span class="price-total">${priceTotal}</span></h3>`);
    
});

const appendAndHideOtherRoleField = () => {
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
const handleActivityRegistration = () => {
    // With strings, you can use string.includes to check whether it contains the start date of some other string, which will allow you to sort accordingly
    $('input:checkbox').on('change', console.log('test'));
    console.log('hello from har');
}

const handleTimeOptions = (elem) => {
    console.log('test');
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
    if (selectedTime != ''){
        disableConflictingTimes(selectedTime, elem.target);
    }
    
    let calculationType;
    if ($(elem.target)[0].checked) {
        calculationType = 'add'
    } else {
        calculationType = 'subtract'
    }

    calculateTotalPrice(selectedPrice, calculationType);
}

const disableConflictingTimes = (selectedActivityTime, selectedInput) => {
    console.log(selectedActivityTime);
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
    const selectedPrice = Number(selectedActivityPrice) || 0;
    if (calcType === 'add') {
        priceTotal += selectedPrice;
    } else {
        priceTotal -= selectedPrice;
        if (priceTotal < 0) {
            priceTotal = 0;
        }
    }
    updatePriceUI();
}

const updatePriceUI = () => {
    $('.price-total').html(priceTotal);
}