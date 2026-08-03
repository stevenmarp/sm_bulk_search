odoo.define('sm_bulk_search.bulk_search', function (require) {
    "use strict";

    const SearchBar = require('web.SearchBar');
    const utils = require('web.utils');
    const SPLITTABLE_TYPES = ["char", "text", "html", "many2one", "many2many", "one2many"];

    utils.patch(SearchBar, "sm_bulk_search.SearchBarPatch", {
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
        }
    });
});
