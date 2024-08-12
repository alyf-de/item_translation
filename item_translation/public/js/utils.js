frappe.provide("item_translation"); //create namespace

item_translation.utils = {
	get_translated_description: async function (frm, cdt, cdn) {
		const row = locals[cdt][cdn];
		const lang = frm.doc.language;
		const settings = await frappe.db.get_doc("Item Translation Settings");

		if (settings.language != lang) {
			const res = await frappe.db.get_list("Item Translation", {
				fields: ["name", "language", "description"],
				filters: { language: lang, item: row.item_code },
				limit: 1,
			});
			setTimeout(() => {
				if (res.length > 0) {
					frappe.model.set_value(cdt, cdn, "description", res[0].description);
				} else if (settings.display_warnings === 1) {
					frappe.msgprint(
						__(
							"Translation missing for <b> {0} </b> in language <b> {1}</b> <br>. Please change print language in customer or add <b>Item Translation</b>",
							[row.item_name, lang]
						)
					);
				}
			}, 500);
		}
	},
	refetch_all_translations: async function (frm) {
		// check if there are any items in item table
		if (frm.doc.items.length == 0) {
			return;
		} else if (frm.doc.items.length == 1) {
			if (!frm.doc.items[0].item_code) {
				return;
			} else if (frm.doc.items[0].item_code == "") {
				return;
			}
		}
		const lang = frm.doc.language;
		const settings = await frappe.db.get_doc("Item Translation Settings");
		frappe.confirm(
			__(
				"Print Language has changed. Refetch Items for language <b> {0} </b>?",
				[lang]
			),
			async () => {
				// If yes loop through all items and refetch Item Description
				for (row of frm.doc.items) {
					// check if description needs to come from normal item or translation
					if (settings.language != lang) {
						let res = await frappe.db.get_list("Item Description Translation", {
							fields: ["name", "language", "description"],
							filters: { language: lang, item: row.item_code },
							limit: 1,
						});
						if (res.length > 0) {
							frappe.model.set_value(
								row.doctype,
								row.name,
								"description",
								res[0].description
							);
						} else if (settings.display_warnings == 1) {
							frappe.msgprint(
								__(
									"Translation missing for <b> {0} </b> in language <b> {1}</b> <br>",
									[row.item_name, lang]
								)
							);
						}
					} else {
						let res = await frappe.db.get_list("Item", {
							fields: ["name", "description"],
							filters: { item_code: row.item_code },
							limit: 1,
						});

						if (res.length > 0) {
							frappe.model.set_value(
								row.doctype,
								row.name,
								"description",
								res[0].description
							);
						}
					}
				}
			},
			() => {
				// action to perform if No is selected
			}
		);
	},
};
