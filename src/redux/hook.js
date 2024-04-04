import { useDispatch, useSelector } from 'react-redux';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Example usage in a component
// const dispatch = useAppDispatch();
// const selectedData = useAppSelector(state => state.someReducer.someData);
