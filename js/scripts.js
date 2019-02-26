$('document').ready(function(){
    console.log('hello world');
    $('#name').focus();

    appendAndHideOtherRoleField();
    configureShirtOptions();
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

