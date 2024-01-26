import { createSlice } from "@reduxjs/toolkit";

const storyBookSlice = createSlice({
  name: 'storyBook',
  initialState: {
    chapterImages: [],
    chapterTexts: [],
    renderChapter: 0,
  },
  reducers: {
    addChapter: {
      reducer(state, action) {
        console.log("made it here in the slice")
        state.chapterImages.push(action.payload.chapterImage)
        state.chapterTexts.push(action.payload.chapterText)
      },
      prepare(chapterImage, chapterText) {
        return {
          payload: {
            chapterImage,
            chapterText,
          }
        }
      },
    },
    nextPage: (state) => {
      state.renderChapter += 1
    },
    previousPage: (state) => {
      state.renderChapter -= 1
    },
  },
});

export const selectAllChapterImages = (state) => state.storyBook.chapterImages;
export const selectAllChapterTexts = (state) => state.storyBook.chapterTexts;
export const selectRenderChapter = (state) => state.storyBook.renderChapter;

// export const storyBook = (state) => state.storyBook;

export const { addChapter, nextPage, previousPage } = storyBookSlice.actions;
export default storyBookSlice.reducer;