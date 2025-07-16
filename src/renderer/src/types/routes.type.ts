import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { IconType } from "react-icons/lib";

export interface ROUTES_TYPE {
    path: string,
    icon: IconType | OverridableComponent<SvgIconTypeMap<object, "svg">> & { muiName: string; },
    name: string,
    submenu?: ROUTES_TYPE[]
}