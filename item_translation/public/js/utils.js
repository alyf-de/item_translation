frappe.provide("item_translation"); //create namespace

item_translation.utils = {
	_fetch_translation: function (item_code, lang) {
		return frappe.db.get_list("Item Translation", {
			fields: ["name", "language", "item_name", "description"],
			filters: { language: lang, item: item_code },
			limit: 1,
		});
	},

	_apply_translation: function (cdt, cdn, translation) {
		if (translation.item_name) {
			frappe.model.set_value(cdt, cdn, "item_name", translation.item_name);
		}
		if (translation.description) {
			frappe.model.set_value(cdt, cdn, "description", translation.description);
		}
	},

	get_translated_description: async function (frm, cdt, cdn) {
		const row = locals[cdt][cdn];
		const lang = frm.doc.language;
		const settings = await frappe.db.get_doc("Item Translation Settings");

		if (settings.language != lang) {
			const res = await this._fetch_translation(row.item_code, lang);
			setTimeout(() => {
				if (res.length > 0) {
					this._apply_translation(cdt, cdn, res[0]);
				} else if (settings.display_warnings == 1) {
					frappe.msgprint(
						__(
							"Translation missing for <b> {0} </b> in language <b> {1}</b>. Please change print language in customer or add <b>Item Translation</b>",
							[row.item_name, lang]
						)
					);
				}
			}, 500);
		}
	},

	refetch_all_translations: async function (frm) {
		if (frm.doc.items.length == 0) return;
		if (frm.doc.items.length == 1 && !frm.doc.items[0].item_code) return;

		const lang = frm.doc.language;
		const settings = await frappe.db.get_doc("Item Translation Settings");
		frappe.confirm(
			__("Print Language has changed. Refetch Items for language <b> {0} </b>?", [lang]),
			async () => {
				for (const row of frm.doc.items) {
					if (settings.language != lang) {
						const res = await this._fetch_translation(row.item_code, lang);
						if (res.length > 0) {
							this._apply_translation(row.doctype, row.name, res[0]);
						} else if (settings.display_warnings == 1) {
							frappe.msgprint(
								__("Translation missing for <b> {0} </b> in language <b> {1}</b>", [
									row.item_name,
									lang,
								])
							);
						}
					} else {
						const res = await frappe.db.get_list("Item", {
							fields: ["name", "item_name", "description"],
							filters: { item_code: row.item_code },
							limit: 1,
						});
						if (res.length > 0) {
							frappe.model.set_value(row.doctype, row.name, "item_name", res[0].item_name);
							frappe.model.set_value(row.doctype, row.name, "description", res[0].description);
						}
					}
				}
			},
			() => {}
		);
	},
};
