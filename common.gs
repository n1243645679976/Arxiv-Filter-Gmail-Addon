
function onHomepage(e) {
  message='11'
  return createCatCard(message, true);
}

function createCatCard(text, isHomepage) {
  // Explicitly set the value of isHomepage as false if null or undefined.
  if (!isHomepage) {
    isHomepage = false;
  }

  // Create a button that changes the cat image when pressed.
  // Note: Action parameter keys and values must be strings.
  var action = CardService.newAction()
      .setFunctionName('myFunction')
      .setParameters({text: text, isHomepage: isHomepage.toString()});
  var button = CardService.newTextButton()
      .setText('Filter!')
      .setOnClickAction(action)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  var buttonSet = CardService.newButtonSet()
      .addButton(button);

  // Assemble the widgets and return the card.
  var section = CardService.newCardSection()
      .addWidget(buttonSet);
  var card = CardService.newCardBuilder()
      .addSection(section)

  if (!isHomepage) {
    // Create the header shown when the card is minimized,
    // but only when this card is a contextual card. Peek headers
    // are never used by non-contexual cards like homepages.
    var peekHeader = CardService.newCardHeader()
      .setTitle('Contextual Cat')
      .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png')
      .setSubtitle(text);
    card.setPeekCardHeader(peekHeader)
  }

  return card.build();
}