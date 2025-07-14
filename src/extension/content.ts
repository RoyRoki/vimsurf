import Mousetrap from "mousetrap";
import AppInit from "./bootstraps/app_init";
import { appDom } from "./bootstraps/app_dom";
import { injectHighlightStyle } from "./utils/style";

// Load & Init the Application
appDom.setDom(document);
injectHighlightStyle(); 
AppInit();
