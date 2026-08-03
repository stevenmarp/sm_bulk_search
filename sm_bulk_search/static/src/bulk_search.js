/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { SearchBar } from "@web/search/search_bar/search_bar";
import SearchBarLegacy from "web.SearchBar";

const SPLITTABLE_TYPES = ["char", "text", "html", "many2one", "many2many", "one2many"];

const patchValue = {
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
        for (const value of values) {
            this.env.searchModel.addAutoCompletionValues(item.searchItemId, {
                label: value,
                operator: item.operator,
                value,
            });
        }
        
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

const legacyPatchValue = {
    smBulkValuesLegacy(source) {
        if (!source.active || source.parent) {
            return null;
        }
        if (!SPLITTABLE_TYPES.includes(source.type)) {
            return null;
        }
        const query = this.state.inputValue;
        if (!query || !query.includes(",")) {
            return null;
        }
        const values = [...new Set(query.split(",").map((part) => part.trim()).filter(Boolean))];
        return values.length > 1 ? values : null;
    },

    _selectSource(source) {
        const values = this.smBulkValuesLegacy(source);
        if (!values) {
            return this._super(source);
        }
        for (const value of values) {
            this.model.dispatch('addAutoCompletionValues', {
                filterId: source.filterId,
                value: "value" in source ? source.value : this._parseWithSource(value, source),
                label: value,
                operator: source.filterOperator || source.operator,
            });
        }
        this._closeAutoComplete();
    },
};

try {
    patch(SearchBarLegacy.prototype, "sm_bulk_search.SearchBarLegacyPatch", legacyPatchValue);
} catch (e) {
    patch(SearchBarLegacy.prototype, legacyPatchValue);
}
