// fetch item description for one row in child table
frappe.ui.form.on("Sales Order Item", {
	item_code: function (frm, cdt, cdn) {
		item_translation.utils.get_translated_description(frm, cdt, cdn);
	},
});
// overwrite all translations if language has changed & user agress
frappe.ui.form.on("Sales Order", {
	language: function (frm) {
		item_translation.utils.refetch_all_translations(frm);
	},
});
