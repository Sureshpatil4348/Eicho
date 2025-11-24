import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";

// Define custom selector hook
export const useAppSelector = useSelector.withTypes<RootState>()

// Define custom dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()