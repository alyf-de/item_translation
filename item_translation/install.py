import frappe
# from frappe.custom.doctype.custom_field.custom_field import create_custom_fields
# from frappe.custom.doctype.property_setter.property_setter import make_property_setter


def after_install():
	# make_custom_fields()
	# make_property_setters()
	insert_custom_records()


# def make_custom_fields():
# 	for key, value in frappe.get_hooks("custom_fields", {}).items():
# 		if isinstance(key, tuple):
# 			for doctype in key:
# 				create_custom_fields({doctype: value}, ignore_validate=True)
# 		else:
# 			create_custom_fields({key: value}, ignore_validate=True)

# 	frappe.db.commit()


# def make_property_setters():
# 	for property_setter in frappe.get_hooks("property_setters", []):
# 		for_doctype = not property_setter[1]

# 		fieldtype = ""
# 		if len(property_setter) == 5:
# 			fieldtype = property_setter[4]

# 		make_property_setter(*property_setter[:4], fieldtype, for_doctype=for_doctype)

# 		frappe.db.commit()


def insert_custom_records():
	for record in frappe.get_hooks("custom_records", []):
		doctype = record.pop("doctype")
		filters = record.copy()

		# Clean up filters. They need to be a plain dict without nested dicts or lists.
		for key, value in record.items():
			if isinstance(value, list | dict):
				del filters[key]

		if frappe.db.exists(doctype, filters):
			continue

		try:
			doc = frappe.new_doc(doctype)
			doc.update(record)
			doc.insert()
		except frappe.DuplicateEntryError:
			continue