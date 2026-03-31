import { createSlice } from "@reduxjs/toolkit";

const filesSlice = createSlice([
	{
		name: "files",
		initialState: {
			storedFiles: [],
		},
		reducers: {
			addFiles: (state, action) => {
				state.storedFiles = [...state, action.payload];
			},
			deleteFile: (state, action) => {
				state.storedFiles = action.payload;
			},
		},
	},
]);

export const { addFiles, deleteFile } = filesSlice.actions;
export default filesSlice.reducer;
