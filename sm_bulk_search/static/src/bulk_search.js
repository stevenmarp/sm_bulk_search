/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { SearchBar } from "@web/search/search_bar/search_bar";

const SPLITTABLE_TYPES = ["char", "text", "html", "many2one", "many2many", "one2many"];

const patchValue = {
    /**
     * Read a query as several values when it holds commas.
     *
     * Returns null when the query is one value, so the search bar behaves normally.
     */
    smBulkValues(item) {
        if (item.unselectable || item.isChild || item.isAddCustomFilterButton) {
            return null;
        }
        const searchItem = this.getSearchItem ? this.getSearchItem(item.searchItemId) : this.searchItems.find((i) => i.id === item.searchItemId);
        if (!searchItem) {
            return null;
        }
        let fieldType;
        if (this.getFieldType) {
            fieldType = this.getFieldType(searchItem);
        } else {
            const field = this.fields[searchItem.fieldName];
            fieldType = field ? (field.type === "reference" ? "char" : field.type) : null;
        }
        if (!SPLITTABLE_TYPES.includes(fieldType)) {
            return null;
        }
        const query = this.state.query;
        if (!query.includes(",")) {
            return null;
        }
        const values = [...new Set(query.split(",").map((part) => part.trim()).filter(Boolean))];
        return values.length > 1 ? values : null;
    },

    selectItem(item) {
        const values = this.smBulkValues(item);
        if (!values) {
            if (this._super) {
                return this._super(item);
            }
            return super.selectItem(item);
        }
        // One value after another on the same search item: they land in one group, which
        // is what the search bar reads as "or", so the list holds every record matching
        // any of them.
        for (const value of values) {
            this.env.searchModel.addAutoCompletionValues(item.searchItemId, {
                label: value,
                operator: item.operator,
                value,
            });
        }
        
        // Safely close the dropdown if the dropdown state exists
        if (this.inputDropdownState && this.inputDropdownState.close) {
            this.inputDropdownState.close();
        } else if (this.searchBarDropdownState && this.searchBarDropdownState.close) {
            this.searchBarDropdownState.close();
        }
        
        this.resetState();
    },
};

try {
    patch(SearchBar.prototype, "sm_bulk_search.SearchBarPatch", patchValue);
} catch (e) {
    patch(SearchBar.prototype, patchValue);
}
