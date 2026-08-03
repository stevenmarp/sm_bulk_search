{
    "name": "Bulk Search",
    "version": "1.0.0",
    "category": "Extra Tools",
    "summary": "Type several values separated by commas and search for all of them at once",
    "description": """
Bulk Search
===========

Looking for six orders means searching six times, reading six lists and remembering what
was on the last one.

Type them separated by commas instead. One search, one list, every record that matches
any of the values.

It works in the search bar of every list, kanban and screen in Odoo, on whatever field
the search bar offers: a name, a reference, a customer, a vendor, a tag.

A query without a comma searches exactly as it always did, so nothing anybody already
does changes.
    """,
    "author": "Steven Marp",
    "website": "https://apps.odoo.com/apps/modules/browse?author=Steven Marp",
    "license": "OPL-1",
    "depends": ["web"],
    "assets": {
        "web.assets_backend": [
            "sm_bulk_search/static/src/bulk_search.js",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
    "images": [
        "static/description/banner.gif",
        "static/description/icon.png",
        "static/description/Screenshot from 2026-08-03 18-36-41.png",
        "static/description/Screenshot from 2026-08-03 18-37-57.png",
        "static/description/Screenshot from 2026-08-03 18-38-59.png",
        "static/description/Screenshot from 2026-08-03 18-39-41.png",
        "static/description/Screenshot from 2026-08-03 18-40-56.png",
        "static/description/Screenshot from 2026-08-03 18-42-02.png"
    ],
    "price": 19.99,
    "currency": "USD",
}
