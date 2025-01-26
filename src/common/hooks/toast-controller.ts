import { useToastController as useFluentToastController } from "@fluentui/react-components";
import * as React from "react";

import { ToastContext } from "../providers/ToastProvider.ctx";

export const useToastController = () => useFluentToastController(React.useContext(ToastContext));
