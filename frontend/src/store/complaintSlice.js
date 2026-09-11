import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    complaint_source: "",
    customer_name: "",
    product_name: "",
    product_strength: "",
    batch_number: "",
    affected_quantity: "",
    manufacturing_date: "",
    expiry_date: "",
    originating_site_block: "",
    impacted_npm: "",
    complaint_category: "",
    complaint_description: "",

    severity: "",
    suggested_action: "",
    risk_assessment: "",
    complaint_summary: "",

    status: "Pending Triage",
};

const complaintSlice = createSlice({
    name: "complaint",

    initialState,

    reducers: {
        setComplaintData: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },

        updateComplaintField: (state, action) => {
            const { field, value } = action.payload;
            state[field] = value;
        },

        clearComplaint: () => {
            return initialState;
        },
    },
});

export const {
    setComplaintData,
    updateComplaintField,
    clearComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;