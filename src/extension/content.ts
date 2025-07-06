import Mousetrap from "mousetrap";
import AppInit from "./bootstraps/app_init";
import { appDom } from "./bootstraps/app_dom";

// Load & Init the Application
appDom.setDom(document);
AppInit();
