import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.evmAccounts || initialState

export const selectEvmAccounts = createSelector([selectSlice], evmAccounts => Object.values(evmAccounts))
