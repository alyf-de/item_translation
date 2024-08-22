## Item Translation

Create Translations for Item Descriptions and fetch them in Transactions.

### Added Doctypes:

- **Item Translation**, linked to item

<img src="docs/item_translation.png" alt="image" width="600" height="auto">

![Item with Translation](docs/item_with_translation.png)

- **Item Translation Settings**, for Default Language and Display of Notifications

![Item Translation Settings](docs/item_translation_settings.png)

### How it works:

Alternative Item Descriptions for different languages are stored in Item Translations.
If the print language in a supported transaction does not match the Default Language, Alternative Descriptions are fetched.
Frontend only.

### Supported transactions

- **Sales Invoice**
- **Quotation**
- **Sales Order**
- **Delivery Note**
- **Purchase Order**
- **Purchase Invoice**

### Dependencies

- Frappe
- ERPNext

Tested with ERPNext Version 14

#### License

gpl-3.0
